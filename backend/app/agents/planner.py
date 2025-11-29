from ..groq_client import groq_call
from typing import Dict, Any, List


async def planner_agent(extracted: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"Given goals {extracted.get('goals')} generate tasks with difficulty tags, effort estimates (minutes), and order them."
    resp = groq_call(prompt)
    out_text = resp.get("output", {}).get("text") if isinstance(resp.get("output"), dict) else resp.get("output")
    # Fallback simple planner: turn each goal into one task
    tasks: List[Dict[str, Any]] = []
    for i, g in enumerate(extracted.get("goals", [])):
        tasks.append({"id": f"t{i}", "title": g, "difficulty": "medium", "effort": 60 if i % 2 == 0 else 45})
    return {"tasks": tasks, "raw": out_text}
