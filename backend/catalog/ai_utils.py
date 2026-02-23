import os
from google import genai
from dotenv import load_dotenv, find_dotenv
import requests
import PIL.Image
from io import BytesIO

# This tells Python to search for the .env file automatically
load_dotenv(find_dotenv())

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "gemini-embedding-001"
VISION_MODEL = "gemini-1.5-flash"
EMBEDDING_DIMENSIONS = 768

if not GEMINI_KEY:
    # This will help you stop the script early if the key is still missing
    raise ValueError("CRITICAL: GEMINI_API_KEY is not loaded. Check your .env file.")

client = genai.Client(api_key=GEMINI_KEY)


def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for the given text using Gemini's embedding model.
    
    Args:
        text: The text to generate an embedding for
        
    Returns:
        A list of floats representing the embedding vector
    """
    result = client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=text,
        config={"output_dimensionality": EMBEDDING_DIMENSIONS},
    )

    if not result.embeddings:
        raise ValueError("Embedding API returned no embeddings.")

    values = result.embeddings[0].values
    if len(values) == EMBEDDING_DIMENSIONS:
        return values

    # Safety fallback in case provider ignores output_dimensionality.
    if len(values) > EMBEDDING_DIMENSIONS:
        return values[:EMBEDDING_DIMENSIONS]

    raise ValueError(
        f"Embedding dimension too small: expected at least {EMBEDDING_DIMENSIONS}, got {len(values)}"
    )

def analyze_cover_with_vision(image_url):
    """
    Takes a Cloudinary URL, sends it to Gemini Vision, 
    and returns a structured description.
    """
    # 1. Download the image from Cloudinary
    try:
        response = requests.get(image_url, timeout=20)
        response.raise_for_status()
        img = PIL.Image.open(BytesIO(response.content))
    except Exception as e:
        return f"Error loading image: {str(e)}"

    # 2. Define the prompt
    prompt = (
        "Look at this book cover image. Please provide: "
        "1. Text extraction: List all titles and authors visible. "
        "2. Visual subject: Describe the main imagery (e.g., medical diagrams, animals). "
        "3. Keywords: Provide 5 tags suitable for a library catalog."
    )

    # 3. Generate content with google-genai Client API
    result = client.models.generate_content(
        model=VISION_MODEL,
        contents=[prompt, img],
    )

    if getattr(result, "text", None):
        return result.text

    return "No vision text returned from Gemini."
