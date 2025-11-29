import os
import requests
from typing import Dict, Any

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_ENDPOINT = os.getenv("GROQ_ENDPOINT", "https://api.groq.ai/v1")


def groq_call(prompt: str, system: str = "") -> Dict[str, Any]:
    """Make a simple call to Groq via the Groq REST API.

    Uses `llama3-70b-versatile` by default. If the GROQ_API_KEY is not set or the call fails,
    returns a safe fallback structure to allow offline development.
    """
    if not GROQ_API_KEY:
        # fallback: echo the prompt for offline testing
        return {"output": {"text": f"[FALLBACK] {prompt}"}}
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }
    model = "llama3-70b-versatile"
    payload = {
        "model": model,
        "input": {
            "system": system,
            "prompt": prompt,
        },
        "max_output_tokens": 800,
    }
    try:
        resp = requests.post(f"{GROQ_ENDPOINT}/models/{model}/generate", json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        return {"output": {"text": f"[ERROR_CALL] {prompt}"}}
