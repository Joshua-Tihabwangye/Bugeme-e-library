# catalog/management/commands/generate_embeddings.py
from django.core.management.base import BaseCommand
from catalog.models import Book
from catalog.ai_utils import get_embedding


class Command(BaseCommand):
    help = 'Generates embedding vectors for all books using Gemini AI'

    def handle(self, *args, **options):
        # Get books that don't have embeddings yet
        books = Book.objects.filter(embedding_vector__isnull=True, is_published=True)
        total = books.count()
        success_count = 0
        error_count = 0
        
        if total == 0:
            self.stdout.write(self.style.WARNING('No books without embeddings found.'))
            return
        
        self.stdout.write(f"Found {total} books to process...")
        
        for i, book in enumerate(books, 1):
            self.stdout.write(f"[{i}/{total}] Processing: {book.title}")
            
            try:
                # Create text to embed (Title + Description)
                text_to_embed = f"{book.title}: {book.description}"
                
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
