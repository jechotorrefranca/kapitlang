---
trigger: always_on
---

Git Commit Message Rules

1. Structure & Format
Pattern: [Emoji] [Action Verb in Title Case] [Short Description]
Mood: Use Imperative Title Case (e.g., "Add", "Fix", "Update").
Length: Strictly one line. No trailing periods.
Specifics: Mention specific filenames only if the change is isolated (e.g., 💄 Improve "Header.tsx" Styles).

2. Gitmoji Mapping
Use exactly one emoji per commit based on the change type:
✨ :sparkles: — New features
🐛 :bug: — Bug fixes
💄 :lipstick: — UI/UX or CSS
♻️ :recycle: — Refactoring
📝 :memo: — Documentation
⚡️ :zap: — Performance
🔥 :fire: — Removing code/files
🔧 :wrench: — Config/Environment
➕ :heavy_plus_sign: — New dependencies
➖ :heavy_minus_sign: — Removing dependencies
✅ :white_check_mark: — Tests

3. Strict Prohibitions (Negative Constraints)
DO NOT use past tense (e.g., No "Added", "Fixed", "Updated").
DO NOT add a period at the end of the line.
DO NOT include a body or footer; summary only.

4. Examples
✨ Add User Authentication Logic
🐛 Fix Memory Leak in Data Fetching
♻️ Refactor Card Component for Reusability
🔧 Update API Base URL in .env.example