# Contributing to NODE OUT

Welcome to the team. This guide gets you operational fast—whether you're a human collaborator or an AI agent.

---

## Quick Start

1. **Load context first** — always run the session startup before doing anything else:
   ```bash
   node CLAUDE_SESSION_STARTUP.js
   ```
2. **Read the communication rules** — [`INTELLIGENCE/TEAM_COMMUNICATION_PROTOCOL.md`](INTELLIGENCE/TEAM_COMMUNICATION_PROTOCOL.md) covers our non-negotiable standards.
3. **Review the architecture** — [`INTELLIGENCE/COMPLETE_ARCHITECTURE_DIAGRAM.md`](INTELLIGENCE/COMPLETE_ARCHITECTURE_DIAGRAM.md) shows the full system map.
4. **Check current priorities** — [`INTEL/AGENT_COORDINATION_LOG.md`](INTEL/AGENT_COORDINATION_LOG.md) has the latest session status.

---

## Onboarding Paths

| Role | Start here |
|------|-----------|
| New AI agent | [`ONBOARDING/awakening_protocol/START_HERE.md`](ONBOARDING/awakening_protocol/START_HERE.md) |
| Task-assigned agent | [`ONBOARDING/direct_action_protocol/BRIEFING.md`](ONBOARDING/direct_action_protocol/BRIEFING.md) |
| Human collaborator | [`INTELLIGENCE/COMPLETE_ARCHITECTURE_DIAGRAM.md`](INTELLIGENCE/COMPLETE_ARCHITECTURE_DIAGRAM.md) |

---

## Team Mantras

- **"Trip the wire first, build second"** — run context startup before any code
- **"Use what works, improve what doesn't"** — don't rebuild existing working systems
- **"Leave notes everywhere"** — document changes so the next session is instant

---

## Making Changes

1. Read [`INTELLIGENCE/TEAM_COMMUNICATION_PROTOCOL.md`](INTELLIGENCE/TEAM_COMMUNICATION_PROTOCOL.md) before starting.
2. Verify the working system status — don't build a duplicate.
3. All API keys go in `config.env` — never hardcode credentials.
4. Document your changes in [`INTEL/FOLLOW_UP_NOTES.md`](INTEL/FOLLOW_UP_NOTES.md) at the end of your session.
5. Open a pull request targeting the `main` branch and describe what you changed and why.

---

*Excellence Made Effortless — Context First, Code Second*
