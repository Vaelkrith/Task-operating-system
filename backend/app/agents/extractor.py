from ..groq_client import groq_call
from typing import Dict, Any


async def extractor_agent(input_payload: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"Extract class timings, goals, available minutes, study style, wake time from the following input:\n{input_payload}"
    resp = groq_call(prompt)
    # Expect response text in resp["output"] or similar. We'll return a best-effort parse.
    # For safety, return structured fields using naive parsing if API isn't available.
    out_text = resp.get("output", {}).get("text") if isinstance(resp.get("output"), dict) else resp.get("output")
    result = {
        "classes": input_payload.get("classes", []),
        "goals": input_payload.get("goals", []),
        "available_minutes": input_payload.get("available_minutes", 180),
        "study_style": input_payload.get("study_style", "moderate"),
        "wake_time": input_payload.get("wake_time", "07:00"),
        "raw": out_text,
    }
    return result
