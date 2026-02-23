import os
from google import genai
from dotenv import load_dotenv, find_dotenv

# This tells Python to search for the .env file automatically
load_dotenv(find_dotenv())

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "gemini-embedding-001"
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
