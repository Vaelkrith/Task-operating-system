from .agents.extractor import extractor_agent
from .agents.planner import planner_agent
from .agents.scheduler import scheduler_agent
from .agents.validator import validator_agent
from typing import Dict, Any


async def run_pipeline(input_payload: Dict[str, Any]) -> Dict[str, Any]:
    logs = []
    extracted = await extractor_agent(input_payload)
    logs.append({"agent": "extractor", "message": "extracted fields", "detail": extracted})

    planned = await planner_agent(extracted)
    logs.append({"agent": "planner", "message": "generated tasks", "detail": planned})

    schedule = await scheduler_agent(extracted, planned)
    logs.append({"agent": "scheduler", "message": "created timeline", "detail": schedule})

    validation = await validator_agent(schedule)
    logs.append({"agent": "validator", "message": "validated schedule", "detail": validation})

    # If issues and less than 2 iterations, attempt auto-fix by adjusting breaks
    iteration = 0
    while iteration < 2 and validation.get("issues"):
        # simple auto-fix: insert breaks after every 2 tasks
        blocks = schedule.get("blocks", [])
        new_blocks = []
        task_count = 0
        for b in blocks:
            new_blocks.append(b)
            if b.get("type") == "task":
                task_count += 1
            if task_count >= 2:
                # insert 15-minute break placeholder
                new_blocks.append({"type": "break", "title": "Auto Break", "start": b.get("end"), "end": b.get("end"), "color": "#10B981"})
                task_count = 0
        schedule["blocks"] = new_blocks
        logs.append({"agent": "orchestrator", "message": "applied auto-fix", "detail": {"iteration": iteration}})
        validation = await validator_agent(schedule)
        logs.append({"agent": "validator", "message": "re-validated schedule", "detail": validation})
        iteration += 1

    return {"schedule": schedule, "agent_logs": logs}
