# catalog/management/commands/generate_embeddings.py
from django.core.management.base import BaseCommand
from catalog.models import Book
from catalog.ai_utils import get_embedding


class Command(BaseCommand):
    help = 'Generates embedding vectors for all books using Gemini AI'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Regenerate embeddings for all published books, including books that already have vectors.'
        )

    def _build_embedding_text(self, book):
        parts = [
            f"Title: {book.title or ''}",
            f"Author: {book.author.name if book.author else ''}",
            f"Description: {book.description or ''}",
        ]

        if book.categories.exists():
            parts.append("Categories: " + ", ".join(c.name for c in book.categories.all() if c.name))

        if isinstance(book.tags, list) and book.tags:
            parts.append("Tags: " + ", ".join(str(tag) for tag in book.tags if str(tag).strip()))

        if book.ai_summary:
            parts.append(f"AI Summary: {book.ai_summary}")

        if isinstance(book.ai_tags, list) and book.ai_tags:
            parts.append("AI Tags: " + ", ".join(str(tag) for tag in book.ai_tags if str(tag).strip()))

        # Keep only non-empty segments to avoid noisy separators.
        return "\n".join(part for part in parts if part.split(":", 1)[-1].strip())

    def handle(self, *args, **options):
        regenerate_all = options.get('all', False)
        filters = {'is_published': True}
        if not regenerate_all:
            filters['embedding_vector__isnull'] = True

        books = Book.objects.filter(**filters).select_related('author').prefetch_related('categories')
        total = books.count()
        success_count = 0
        error_count = 0
        
        if total == 0:
            if regenerate_all:
                self.stdout.write(self.style.WARNING('No published books found to process.'))
            else:
                self.stdout.write(self.style.WARNING('No books without embeddings found.'))
            return
        
        self.stdout.write(f"Found {total} books to process...")
        
        for i, book in enumerate(books, 1):
            self.stdout.write(f"[{i}/{total}] Processing: {book.title}")
            
            try:
                # Create richer text payload for stronger semantic recall.
                text_to_embed = self._build_embedding_text(book)
                
                # Get embedding from Gemini
                vector = get_embedding(text_to_embed)
                
                # Save as float array for pgvector VectorField
                book.embedding_vector = vector
                book.save(update_fields=['embedding_vector'])
                success_count += 1
                
                self.stdout.write(self.style.SUCCESS(f"  ✓ Embedded ({len(vector)} dimensions)"))
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"  ✗ Error: {e}"))
                error_count += 1
                continue
            
        self.stdout.write(self.style.SUCCESS(
            f"\nEmbedding run complete: {success_count}/{total} succeeded, {error_count} failed."
        ))
