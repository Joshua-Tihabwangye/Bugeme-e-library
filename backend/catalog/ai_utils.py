import os
from google import genai
from dotenv import load_dotenv, find_dotenv

# This tells Python to search for the .env file automatically
load_dotenv(find_dotenv())

GEMINI_KEY = os.getenv("GEMINI_API_KEY")

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
        model="gemini-embedding-001",
        contents=text,
    )
    return result.embeddings[0].values