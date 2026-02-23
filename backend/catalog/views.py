import os
import logging 
import re
import cloudinary 
import requests
from requests.adapters import HTTPAdapter, Retry
import time
from urllib.parse import urlparse
from django.utils import timezone
from django.shortcuts import get_object_or_404, render   
from rest_framework import generics, status, filters, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.http import Http404, HttpResponse
from django.db.models import Q, Max, F, Prefetch
from django.db import models 
from django.db.models.functions import Cast
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from django.core.cache import cache

from django.conf import settings 
from django.http import HttpResponse, Http404, FileResponse, StreamingHttpResponse, HttpResponseRedirect

from .models import Category, Book, BookLike, Bookmark
from .serializers import (
    CategorySerializer, BookListSerializer, BookDetailSerializer,
    BookCreateUpdateSerializer, BookLikeSerializer, BookmarkSerializer
)
from accounts.permissions import IsAdminRole
from rest_framework.parsers import MultiPartParser, FormParser
from analytics.models import BookView

from .ai_utils import get_embedding
from pgvector.django import CosineDistance
from .models import Book

# Initialize logger
logger = logging.getLogger(__name__)

# Shared HTTP session for Cloudinary downloads with retry on transient failures
cloudinary_session = requests.Session()
retry_config = Retry(
    total=3,
    backoff_factor=1,
    allowed_methods=frozenset(['GET']),
    status_forcelist=[500, 502, 503, 504],
    raise_on_status=False,
)
cloudinary_session.mount('https://', HTTPAdapter(max_retries=retry_config))

# --- CATEGORY VIEWS ---
@method_decorator(cache_page(60 * 15), name='dispatch')  # Cache for 15 minutes
class CategoryListView(generics.ListAPIView):
    """List all categories with book counts"""
    queryset = Category.objects.annotate(
        book_count=models.Count('books', filter=models.Q(books__is_published=True), distinct=True)
    ).all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# --- BOOK LIST/CREATE VIEWS ---
class BookViewSet(viewsets.ModelViewSet):
    """
    Handles CRUD operations for Books, replacing BookListCreateView and BookDetailView.
    """
    # REQUIRED for file upload to be detected by Swagger/DRF
    parser_classes = (MultiPartParser, FormParser) 

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categories__id', 'language', 'year', 'file_type'] 
    search_fields = ['title', 'author__name', 'description', '@tags'] # NOTE: changed to author__name for ForeignKey lookup
    ordering_fields = ['created_at', 'view_count', 'like_count', 'title']
    ordering = ['-created_at']

    def _is_semantic_mode(self, request):
        mode = (
            request.query_params.get('mode')
            or request.query_params.get('search_mode')
            or ''
        ).strip().lower()
        return mode in {'semantic', 'vector', 'ai'}

    def _searchable_clauses(self, text):
        return (
            Q(title__icontains=text)
            | Q(author__name__icontains=text)
            | Q(description__icontains=text)
            | Q(tags__icontains=text)
            | Q(ai_summary__icontains=text)
            | Q(ai_tags__icontains=text)
        )

    def _keyword_filter(self, qs, query):
        normalized_query = " ".join(query.split())
        terms = [term for term in re.split(r"\s+", normalized_query) if term]
        if not terms:
            return qs.none()

        # Match the full phrase OR require every token to appear in searchable fields.
        all_terms_clause = Q()
        for term in terms:
            all_terms_clause &= self._searchable_clauses(term)

        return qs.filter(
            self._searchable_clauses(normalized_query) | all_terms_clause
        ).distinct()

    def _semantic_filter(self, qs, query, strict=False):
        query_vector = get_embedding(query)
        scored_qs = (
            qs.filter(embedding_vector__isnull=False)
            .annotate(distance=CosineDistance('embedding_vector', query_vector))
            .order_by('distance')
        )

        # Relevance controls:
        # - strict=True: used for keyword-fallback, so only return sufficiently close matches.
        # - strict=False: explicit semantic mode can be broader.
        max_distance = 0.48 if strict else 0.62
        top_k = 12

        filtered_qs = scored_qs.filter(distance__lte=max_distance)
        candidate_ids = list(filtered_qs.values_list('id', flat=True)[:top_k])

        # In strict fallback mode, never return weak matches.
        if strict and not candidate_ids:
            return scored_qs.filter(pk__in=[])

        # In explicit semantic mode, keep behavior broad if no strong matches.
        if not strict and not candidate_ids:
            candidate_ids = list(scored_qs.values_list('id', flat=True)[:top_k])

        if not candidate_ids:
            return scored_qs.filter(pk__in=[])

        return scored_qs.filter(pk__in=candidate_ids).order_by('distance')

    def _fulltext_filter(self, qs, query):
        # Build a weighted full-text index on the fly from the fields we persist.
        qs = qs.annotate(
            tags_text=Cast('tags', models.TextField()),
            ai_tags_text=Cast('ai_tags', models.TextField()),
        ).annotate(
            search_vector=(
                SearchVector('title', weight='A', config='english')
                + SearchVector('author__name', weight='A', config='english')
                + SearchVector('description', weight='B', config='english')
                + SearchVector('ai_summary', weight='B', config='english')
                + SearchVector('tags_text', weight='A', config='simple')
                + SearchVector('ai_tags_text', weight='A', config='simple')
            )
        )

        query_obj = SearchQuery(query, search_type='websearch', config='english')
        return (
            qs.annotate(search_rank=SearchRank(F('search_vector'), query_obj))
            .filter(search_rank__gte=0.01)
            .order_by('-search_rank', '-view_count')
        )

    def get_queryset(self):
        """
        Base queryset with optional free-text search using ?query=...
        Frontend sends `query` while DRF's SearchFilter defaults to `search`,
        so we support both for convenience.
        """
        qs = Book.objects.filter(is_published=True) if self.action in ['list', 'retrieve'] else Book.objects.all()
        
        # Optimize queries with select_related and prefetch_related
        qs = qs.select_related('author').prefetch_related('categories')

        request = self.request
        query = (request.query_params.get('query') or request.query_params.get('search') or '').strip()
        use_semantic = self._is_semantic_mode(request)
        if query:
            if use_semantic:
                try:
                    qs = self._semantic_filter(qs, query, strict=False)
                    # Keep semantic ranking as default unless caller explicitly sets ordering.
                    self.ordering = ['distance']
                except Exception:
                    logger.warning("Semantic search failed; falling back to keyword search.", exc_info=True)
                    qs = self._keyword_filter(qs, query)
                    self.ordering = ['-view_count', '-created_at']
            else:
                keyword_qs = self._keyword_filter(qs, query)
                if keyword_qs.exists():
                    qs = keyword_qs
                    self.ordering = ['-view_count', '-created_at']
                else:
                    # Fallback 1: weighted full-text search (better token handling).
                    try:
                        fulltext_qs = self._fulltext_filter(qs, query)
                        if fulltext_qs.exists():
                            qs = fulltext_qs
                            self.ordering = ['-search_rank', '-view_count']
                        else:
                            # Fallback 2: semantic similarity (strict).
                            query_has_signal = len(query) >= 3
                            if query_has_signal:
                                qs = self._semantic_filter(qs, query, strict=True)
                                self.ordering = ['distance']
                            else:
                                qs = keyword_qs
                                self.ordering = ['-view_count', '-created_at']
                    except Exception:
                        logger.warning("Fallback search failed; returning keyword result set.", exc_info=True)
                        try:
                            query_has_signal = len(query) >= 3
                            if query_has_signal:
                                qs = self._semantic_filter(qs, query, strict=True)
                                self.ordering = ['distance']
                            else:
                                qs = keyword_qs
                                self.ordering = ['-view_count', '-created_at']
                        except Exception:
                            logger.warning("Semantic fallback failed; returning keyword result set.", exc_info=True)
                            qs = keyword_qs
                            self.ordering = ['-view_count', '-created_at']
        else:
            self.ordering = ['-created_at']
        
        # Prefetch user-specific data if authenticated
        if request.user.is_authenticated:
            from reading.models import ReadingProgress
            qs = qs.prefetch_related(
                Prefetch('likes', queryset=BookLike.objects.filter(user=request.user)),
                Prefetch('bookmarks', queryset=Bookmark.objects.filter(user=request.user)),
                Prefetch('reading_progresses', queryset=ReadingProgress.objects.filter(user=request.user))
            )
        
        return qs

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return BookCreateUpdateSerializer
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookListSerializer

    def get_permissions(self):
        # Apply permissions based on action
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()] 
        return [AllowAny()]

    def list(self, request, *args, **kwargs):
        """Override list to add error handling and caching"""
        try:
            # Build cache key based on query parameters
            cache_key = f"books_list_v2_{hash(str(request.query_params))}"
            cached_response = cache.get(cache_key)
            
            if cached_response is not None:
                return Response(cached_response)
            
            response = super().list(request, *args, **kwargs)
            
            # Cache successful responses for 5 minutes
            if response.status_code == 200:
                cache.set(cache_key, response.data, 60 * 5)
            
            return response
        except Exception as e:
            logger.error(f"Error listing books: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to fetch books', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        """Re-implement the view count logic from the old BookDetailView"""
        try:
            instance = self.get_object()
            
            # Increment view count asynchronously (non-blocking)
            Book.objects.filter(pk=instance.pk).update(view_count=F('view_count') + 1)
            
            # Create BookView record for analytics asynchronously (only for authenticated users)
            # Use get_or_create to avoid blocking on duplicate key errors
            if request.user.is_authenticated:
                try:
                    BookView.objects.get_or_create(
                        user=request.user,
                        book=instance,
                        defaults={'viewed_at': timezone.now()}
                    )
                except Exception as e:
                    # Log but don't fail the request
                    logger.warning(f"Failed to create BookView: {str(e)}")
            
            # Don't refresh from DB - use the instance we already have
            # This saves a database query

            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error retrieving book: {str(e)}", exc_info=True)
            return Response(
                {'error': 'Failed to fetch book', 'detail': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --- COVER IMAGE VIEW (Placeholder) ---
@api_view(['GET'])
@permission_classes([AllowAny])
def book_cover(request, book_id):
    """Serve book cover image (Placeholder for new file serving logic)"""
    try:
        book = Book.objects.get(id=book_id, is_published=True)
        if not book.cover_image:
            raise Http404("Cover image not found")
        
        return HttpResponse(status=status.HTTP_501_NOT_IMPLEMENTED, 
                            content="File serving logic needs to be updated for new storage.")
    except Book.DoesNotExist:
        raise Http404("Book not found")


# ----------------------------------------------------------------------
#  BOOK STREAMING VIEW – SIGNED CLOUDINARY URL (Option 1)
# ----------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def book_read_stream(request, book_id):
    try:
        book = get_object_or_404(Book, id=book_id, is_published=True)

        public_id = book.cloudinary_public_id
        if not public_id:
            return Response(
                {'error': 'Missing Cloudinary public_id'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Match this to HOW you uploaded the asset.
        # If you uploaded PDFs as image-type (image/upload), use "image".
        # If you uploaded them as raw (raw/upload), use "raw".
        if book.file_type in ("PDF", "EPUB"):
            resource_type = "image"   # change to "raw" if you upload PDFs as raw
        elif book.file_type == "VIDEO":
            resource_type = "video"
        else:
            resource_type = "image"

        signed_url, _ = cloudinary.utils.cloudinary_url(
            public_id,
            resource_type=resource_type,
            type="upload",          
            sign_url=True,
            secure=True,
            expires_at=int(time.time()) + 3600,
        )

        logger.info(
            f"Returning Cloudinary URL for book {book_id}: "
            f"public_id='{public_id}', resource_type='{resource_type}', url='{signed_url}'"
        )

        return Response({'url': signed_url})

    except Exception as exc:
        logger.exception(f"Error preparing book URL {book_id}")
        return Response(
            {'error': 'An internal error occurred.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def book_read_token(request, book_id):
    """
    Lightweight endpoint used by the frontend to verify access before opening the reader.
    For now we just ensure the book exists and the user is authenticated, then return a
    short-lived opaque token string that the frontend passes back as a query param.
    """
    book = get_object_or_404(Book, id=book_id, is_published=True)
    # Optionally log a BookView here in the future.
    # For simplicity, the "token" is not validated server-side by the stream view.
    return Response({'token': f'allowed-{book.id}'}, status=status.HTTP_200_OK)


# --- LIKE/BOOKMARK VIEWS ---
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, book_id):
    """Toggle book like"""
    try:
        book = Book.objects.get(id=book_id, is_published=True)
        user = request.user
        
        like = BookLike.objects.filter(user=user, book=book).first()
        
        if like:
            like.delete()
            
            # Re-fetch book to ensure we have latest data
            book.refresh_from_db()
            if book.like_count > 0:
                book.like_count -= 1
                book.save(update_fields=['like_count'])
            
            book.refresh_from_db()
            return Response({'liked': False, 'like_count': book.like_count})
        else:
            BookLike.objects.create(user=user, book=book)
            Book.objects.filter(pk=book.pk).update(like_count=F('like_count') + 1)
            
            book.refresh_from_db()
            return Response({'liked': True, 'like_count': book.like_count})
    
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error toggling like for book {book_id}: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Failed to toggle like', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, book_id):
    """Toggle book bookmark"""
    try:
        book = Book.objects.get(id=book_id, is_published=True)
        user = request.user
        location = request.data.get('location', '')
        
        bookmark = Bookmark.objects.filter(user=user, book=book).first()
        
        if bookmark:
            bookmark.delete()
            # Re-fetch book
            book.refresh_from_db()
            if book.bookmark_count > 0:
                book.bookmark_count -= 1
                book.save(update_fields=['bookmark_count'])
            
            book.refresh_from_db()
            return Response({'bookmarked': False, 'bookmark_count': book.bookmark_count})
        else:
            Bookmark.objects.create(user=user, book=book, location=location)
            Book.objects.filter(pk=book.pk).update(bookmark_count=F('bookmark_count') + 1)
            
            book.refresh_from_db()
            return Response({'bookmarked': True, 'bookmark_count': book.bookmark_count})
    
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error toggling bookmark for book {book_id}: {str(e)}", exc_info=True)
        return Response(
            {'error': 'Failed to toggle bookmark', 'detail': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# --- SEARCH SUGGESTIONS VIEW ---
@api_view(['GET'])
@permission_classes([AllowAny])
def search_suggestions(request):
    """Get search suggestions"""
    query = request.GET.get('query', '').strip()
    if len(query) < 2:
        return Response({'suggestions': []})
    
    books = Book.objects.filter(
        Q(title__icontains=query) | Q(author__name__icontains=query),
        is_published=True
    ).order_by('-view_count')[:10]
    
    suggestions = []
    
    for book in books:
        if query.lower() in book.title.lower():
            suggestions.append({
                'type': 'title',
                'text': book.title,
                'book_id': str(book.id)
            })
        elif query.lower() in book.author.name.lower():
            suggestions.append({
                'type': 'author',
                'text': book.author.name,
                'book_id': str(book.id)
            })
    
    tag_suggestions = Book.objects.filter(
        tags__icontains=query,
        is_published=True
    ).values_list('tags', flat=True).distinct()

    unique_tags = set()
    for tag_value in tag_suggestions:
        if not tag_value:
            continue

        # tags are stored as JSON lists; handle string fallback defensively.
        if isinstance(tag_value, list):
            candidates = [str(t).strip() for t in tag_value if str(t).strip()]
        else:
            candidates = [t.strip() for t in str(tag_value).split(',') if t.strip()]

        for tag in candidates:
            if query.lower() in tag.lower():
                unique_tags.add(tag)
    
    for tag in list(unique_tags)[:5]:
        suggestions.append({
            'type': 'tag',
            'text': tag
        })
    
    return Response({'suggestions': suggestions[:10]})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def book_file_url(request, book_id):
    book = get_object_or_404(Book, id=book_id, is_published=True)
    if not book.file:
        return Response({'error': 'No file for this book'}, status=404)
    return Response({'url': book.file.url})


#========================= AI integration in the system ==========================
#Changing querries into vectors to be stored in the database and used for semantic search with cosine similarity. This is a simple implementation and can be expanded with more complex logic as needed.
def semantic_search(request):
    query = request.GET.get('q')
    results = []
    
    if query:
        # 1. Turn the user's search words into a vector
        query_vector = get_embedding(query)
        
        # 2. Find the top 5 most similar books using Cosine Similarity
        # Lower distance = higher similarity
        results = Book.objects.annotate(
            distance=CosineDistance('embedding_vector', query_vector)
        ).order_by('distance')[:5]
        
    return render(request, 'catalog/search.html', {
        'results': results, 
        'query': query
    })

