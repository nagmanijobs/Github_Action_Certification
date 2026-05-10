# Copilot Instructions for Github_Action_Certification

## Workflow Authoring Standards

### Always use these pinned action versions
- `actions/checkout@v4`
- `actions/setup-node@v4`
- `actions/upload-artifact@v4`
- `actions/download-artifact@v4`
- `actions/github-script@v7`

Never suggest older versions or unpinned references.

### Node.js setup
- Always cache npm: `cache: 'npm'` in `actions/setup-node`
- Default Node versions in this repo: `18` and `20`
- Always run `npm ci` (not `npm install`) for clean installs
- Always set `CI: true` when running tests

### Reusable workflows
- Build and test logic lives in `.github/workflows/build.yml` (reusable)
- New CI workflows must call `build.yml` via `uses: ./.github/workflows/build.yml`
- Never duplicate build/test steps inline — always delegate to the reusable workflow

### Deploy pipeline
- Deploy jobs must always guard with:
  `if: ${{ github.event_name == 'workflow_dispatch' || github.event.workflow_run.conclusion == 'success' }}`
- Always resolve the correct CI run ID before downloading artifacts using:
  ```yaml
  uses: actions/github-script@v7
  with:
    script: |
      const script = require('./.github/scripts/resolve-ci-run.js');
      await script({github, context, core});
  ```
- Never hardcode run IDs — always use `resolve-ci-run.js`
- Artifact name pattern must follow: `build-artifacts-node-<version>-<sha>-<date>`

### Matrix strategy
- Always set `fail-fast: false` on matrix jobs
- Always set `max-parallel: 2` unless a specific override is needed

### Secrets
- Never hardcode secrets inline
- Pass secrets explicitly via `secrets:` in reusable workflow calls
- Always mask secrets with `echo "::add-mask::${{ secrets.token }}"` before use

## Script Authoring Standards

### All bash scripts must
- Start with `#!/usr/bin/env bash`
- Use `set -euo pipefail` on line 2
- Include a usage comment block at the top
- Use `"$var"` (quoted) for all variable references

### GitHub API calls
- Always use `gh` CLI over raw `curl` for GitHub API interactions
- Use `gh api --paginate` for list endpoints

### Script location
- All scripts live in `.github/scripts/`
- Scripts must be executable (`chmod +x`)

## Copilot Skills

### Skill sync
- After cloning this repo, always run `.github/scripts/sync-skills.sh` to pull latest skills
- Never edit skill files directly in this repo — update them in `nagmanijobs/Nagmani-AI-Custom-Skills` and sync
- Skills live in `.github/skills/`

### CI triage
- When diagnosing GitHub Actions failures, use the `github-actions-triage` skill
- Reference `.github/skills/PROMPT_EXAMPLES.md` for standard triage prompt patterns

## Security

- Never add `--no-verify` to git commands
- Never disable branch protection rules as a fix
- Never expose secrets in logs — always mask before use
- Always set minimum required permissions on jobs:
  ```yaml
  permissions:
    contents: read
    actions: read
  ```
