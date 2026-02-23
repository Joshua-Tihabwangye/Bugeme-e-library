from django.core.management.base import BaseCommand
from catalog.models import Book
from catalog.ai_utils import analyze_cover_with_vision, get_embedding

class Command(BaseCommand):
    help = "Generates Vision descriptions and updates all book embeddings"

    def handle(self, *args, **options):
        books = Book.objects.all()
        self.stdout.write(f"Found {books.count()} books. Starting process...")

        for book in books:
            self.stdout.write(f"--- Processing: {book.title} ---")
            
            # 1. Vision Analysis (The 'Eyes')
            if book.file_url:
                self.stdout.write("Analyzing cover image...")
                vision_text = analyze_cover_with_vision(book.file_url)
                # Store this in your visual field
                book.ai_description = vision_text 
            else:
                vision_text = ""

            # 2. Construct the Rich String
            # We combine Title, Author, and the new Vision data for a 'deep' search
            rich_text = f"Title: {book.title} | Author: {book.author} | Visuals: {vision_text}"

            # 3. Generate and Save the Embedding
            self.stdout.write("Generating new vector...")
            book.embedding_vector = get_embedding(rich_text)
            book.save()

            self.stdout.write(self.style.SUCCESS(f"Successfully updated {book.title}"))

        self.stdout.write(self.style.SUCCESS("All books have been re-indexed with Vision data!"))