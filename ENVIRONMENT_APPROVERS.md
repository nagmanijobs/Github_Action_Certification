# Environment Approvers Configuration

This guide explains how to configure required approvers for the QA, Beta, and Prod environments in the GitHub Actions deployment pipeline.

## Overview

The Deploy Pipeline workflow (`deploy.yml`) deploys to three sequential environments:
1. **QA** - Quality Assurance environment (first stage)
2. **Beta** - Beta/Staging environment (second stage, requires QA approval)
3. **Prod** - Production environment (final stage, requires Beta approval)

## Setting Up Required Reviewers

### Via GitHub UI (Recommended)

1. **Go to Repository Settings**
   - Navigate to your repository on GitHub
   - Click `Settings` → `Environments`

2. **Configure QA Environment**
   - Click on `QA` environment
   - Under "Protection rules", check `"Require reviewers"`
   - Add required reviewers/teams (e.g., QA team members)
   - Save

3. **Configure Beta Environment**
   - Click on `Beta` environment
   - Under "Protection rules", check `"Require reviewers"`
   - Add required reviewers/teams (e.g., QA leads, release managers)
   - Save

4. **Configure Prod Environment**
   - Click on `Prod` environment
   - Under "Protection rules", check `"Require reviewers"`
   - Add required reviewers/teams (e.g., DevOps team, release manager)
   - Consider enabling `"Dismiss stale pull request approvals when new commits are pushed"`
   - Save

### Via GitHub CLI

You can also configure approvers programmatically using the GitHub CLI:

```bash
# Set approvers for QA environment (add your GitHub usernames)
gh api repos/nagmanijobs/Github_Action_Certification/environments/QA/protection_rules \
  -X POST \
  -f type='required_reviewers' \
  -f reviewers='[{"id": USER_ID, "type": "User"}]'

# Set approvers for Beta environment
gh api repos/nagmanijobs/Github_Action_Certification/environments/Beta/protection_rules \
  -X POST \
  -f type='required_reviewers' \
  -f reviewers='[{"id": USER_ID, "type": "User"}]'

# Set approvers for Prod environment
gh api repos/nagmanijobs/Github_Action_Certification/environments/Prod/protection_rules \
  -X POST \
  -f type='required_reviewers' \
  -f reviewers='[{"id": USER_ID, "type": "User"}]'
```

Replace `USER_ID` with the actual GitHub user IDs.

## Workflow Trigger Scenarios

### Manual Dispatch
When triggering deploy manually via workflow dispatch:
- You select the Node version (18 or 20)
- Each environment stage requires approval from configured reviewers before proceeding

### Auto-Trigger (After CI Tests)
When deploy automatically triggers after CI tests pass:
- Default Node version (20) is used
- Each environment still requires approval from configured reviewers
- Ensures production safety even with automated deployments

## Approval Flow

```
Push to main
    ↓
CI - run tests passes
    ↓
Deploy Pipeline triggered
    ↓
QA Stage
├─ Requires approval from QA reviewers
├─ Downloads artifacts
└─ Deploys to QA environment
    ↓
Beta Stage
├─ Requires approval from Beta reviewers
├─ Downloads artifacts
└─ Deploys to Beta environment
    ↓
Prod Stage
├─ Requires approval from Prod reviewers
├─ Downloads artifacts
└─ Deploys to Production
```

## Best Practices

1. **QA Environment**
   - Require 1-2 QA engineers
   - Can be less restrictive (testing environment)

2. **Beta Environment**
   - Require 1-2 senior QA or release managers
   - Good place to catch issues before production

3. **Prod Environment**
   - Require 2+ approvers (e.g., CTO, DevOps lead, Release manager)
   - Consider requiring dismissal of stale approvals on new commits
   - This is the most critical approval gate

## Testing Approval Flow

1. Push code to main branch
2. CI tests run and pass
3. Deploy workflow auto-triggers
4. On Workflow run page, you'll see pending approval notifications
5. Required reviewers receive notifications to approve/deny
6. Once approved, deployment proceeds to that environment

## Notes

- Only repository administrators can modify environment protection rules
- Approvals are tied to specific commits/deployment requests
- Once all stages are approved, the full deployment completes
- Deployments can be retried if a stage fails
