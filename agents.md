### Workflow orchestartion

### 1. Plan Node Default
-Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
-If something goes sideways, STOP and re-plan immediately - don't keep pushing
-For complex tasks
- Use plan mode for verification steps, not just building 
- Write detailed specs upfront to reduce ambiguity
### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- offload research, exploration, and parallel analysis to subagents
- for complex problems, throw more compute at it via subagents
- One tack per subagents for focused execution

### 3. Self improvement Loop
-After any correction from the user: update `tasks/lessons.md` with the pattern
-Write rules for yourself that prevent the same mistake
-Ruthlessly iterate on these lessons until mistake rate drops
-Review lessons at session start for for relevan project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fizzing
- When given a bug report: just fix it. Don't ask for handholding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how 

### Task Management
1. **Plan First**: Write plan to `tasks/plan.md` with checkable items
2. **Verify Plan**: Check in before starting
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review sections to `tasks/lesson.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**" Find root causes. No temporary fixes. Senior development standards.
-- **Minimat Impact**: Changes should only touch what's necessary. Avoid introducing bugs.