# How we use Git

1. `main` always runs. Nobody pushes to it directly; everything goes through a Pull Request (PR).
2. One task = one branch = one PR. Name branches `feature/<module>-<what>`, e.g. `feature/soil-booking`.
3. Start every work session with `git checkout main && git pull`.
4. Before pushing: `git pull --rebase origin main`, then `git push -u origin <branch>`.
5. Keep PRs small (merge several times a day). Review within 30 minutes; do not let a PR sit.
6. Only edit files inside your own module. Need a change in a shared file (`pom.xml`, `auth/`, `common/`)? Ask the owner or open an Issue.
7. Never commit secrets or build output. Check `git status` before every commit.
8. Commit messages: short, present tense, say what changed ("Add soil request entity").

## Merge conflict? Do not panic

1. Open the file; look for `<<<<<<<`, `=======`, `>>>>>>>`.
2. Keep the correct code, delete the marker lines.
3. `git add <file>` then `git rebase --continue`.
4. Stuck for more than 10 minutes: ask in the group before running anything destructive.
