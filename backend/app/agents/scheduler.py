from typing import Dict, Any, List
from datetime import datetime, timedelta


def time_from_str(s: str) -> datetime:
    return datetime.strptime(s, "%H:%M")


def time_to_str(t: datetime) -> str:
    return t.strftime("%H:%M")


async def scheduler_agent(extracted: Dict[str, Any], planned: Dict[str, Any]) -> Dict[str, Any]:
    # Create a day timeline starting from wake_time
    wake = extracted.get("wake_time", "07:00")
    wake_dt = time_from_str(wake)
    blocks: List[Dict[str, Any]] = []
    cursor = wake_dt
    # Insert class blocks first (assume classes contain start/end)
    for c in extracted.get("classes", []):
        # expected c: {title, start, end}
        blocks.append({"type": "class", "title": c.get("title", "Class"), "start": c.get("start"), "end": c.get("end"), "color": "#9CA3AF"})
    # Schedule tasks in free time simply after wake time in order
    for t in planned.get("tasks", []):
        eff = t.get("effort", 45)
        start = cursor
        end = start + timedelta(minutes=eff)
        blocks.append({"type": "task", "title": t.get("title"), "start": time_to_str(start), "end": time_to_str(end), "color": "#3B82F6"})
        cursor = end
        # insert short break
        bstart = cursor
        bend = bstart + timedelta(minutes=10)
        blocks.append({"type": "break", "title": "Short Break", "start": time_to_str(bstart), "end": time_to_str(bend), "color": "#10B981"})
        cursor = bend

    return {"blocks": blocks}
