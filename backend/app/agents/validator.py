from ..groq_client import groq_call
from typing import Dict, Any


async def validator_agent(blocks: Dict[str, Any]) -> Dict[str, Any]:
    # Use Groq to check for overlaps etc. Fallback to simple python checks.
    issues = []
    seen = []
    for b in blocks.get("blocks", []):
        s = b.get("start")
        e = b.get("end")
        if s == e:
            issues.append({"msg": "Zero-length block", "block": b})
        key = (s, e)
        if key in seen:
            issues.append({"msg": "Duplicate time block", "block": b})
        seen.append(key)
    # naive long streak detection
    # If more than 4 consecutive tasks without break, issue
    consec = 0
    for b in blocks.get("blocks", []):
        if b.get("type") == "task":
            consec += 1
            if consec > 4:
                issues.append({"msg": "Long work streak", "detail": {"count": consec}})
        else:
            consec = 0

    # Optionally call Groq for suggestions
    prompt = f"Validate schedule and suggest refinement: {blocks.get('blocks', [])}"
    try:
        resp = groq_call(prompt)
        groq_text = resp.get("output", {}).get("text") if isinstance(resp.get("output"), dict) else resp.get("output")
    except Exception:
        groq_text = None

    return {"issues": issues, "suggestions": groq_text}
