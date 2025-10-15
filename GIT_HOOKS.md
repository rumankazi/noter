# 🪝 Git Hooks with Husky

Noter uses **Husky** to run automated checks before commits and pushes, ensuring code quality and preventing CI/CD failures.

---

## What's Configured

### 🎯 Pre-Commit Hook
**Runs on:** `git commit`

**What it does:**
- ✅ Runs ESLint on staged TypeScript/React files
- ✅ Auto-fixes linting issues when possible
- ✅ Runs tests related to changed files
- ✅ Only checks files you're committing (fast!)

**Purpose:** Catch syntax errors and formatting issues early

---

### 📝 Commit Message Hook (commitlint)
**Runs on:** `git commit`

**What it does:**
- ✅ Validates commit message format with **commitlint**
- ✅ Ensures Conventional Commits standard
- ✅ Prevents non-semantic commits
- ✅ Professional validation with detailed error messages

**Purpose:** Maintain consistent commit history for semantic-release

**Powered by:** `@commitlint/cli` + `@commitlint/config-conventional`

**Required format:**
```bash
<type>[(scope)][!]: <description>
```

**Valid types:**
- `feat` - New feature (minor version bump)
- `fix` - Bug fix (patch version bump)
- `perf` - Performance improvement (patch version bump)
- `refactor` - Code refactoring (patch version bump)
- `docs` - Documentation only (no version bump)
- `style` - Formatting, whitespace (no version bump)
- `test` - Tests only (no version bump)
- `build` - Build system changes (no version bump)
- `ci` - CI/CD changes (no version bump)
- `chore` - Maintenance tasks (no version bump)
- `revert` - Revert previous commit (patch version bump)

---

### 🚀 Pre-Push Hook
**Runs on:** `git push`

**What it does:**
1. ✅ **Lint entire codebase** - Ensures no linting errors
2. ✅ **Run all tests** - Ensures all 74 tests pass
3. ✅ **Build application** - Ensures build succeeds

**Purpose:** Verify your code is production-ready before pushing to remote

**Time:** ~30-60 seconds (same checks GitHub Actions runs)

---

## Benefits

### ✅ Before Husky
```bash
# Your workflow
git add .
git commit -m "Add feature"
git push

# 10 minutes later...
❌ GitHub Actions failed: lint error
❌ GitHub Actions failed: test failure
❌ GitHub Actions failed: build error

# Fix and repeat
git add .
git commit -m "Fix issues"
git push

# Another 10 minutes...
```
⏱️ Time wasted: 20+ minutes
😤 Frustration: High

### ✅ After Husky
```bash
# Your workflow
git add .
git commit -m "feat: add feature"
# ✅ Pre-commit: lint-staged passes
# ✅ Commit-msg: valid format

git push
# ✅ Pre-push: lint passes
# ✅ Pre-push: tests pass
# ✅ Pre-push: build passes
# Push proceeds...

# GitHub Actions runs (guaranteed to pass)
✅ All checks green on first try
```
⏱️ Time saved: 20+ minutes
😊 Confidence: 100%

---

## Example Usage

### ✅ Successful Commit
```bash
git add src/components/NewFeature.tsx

git commit -m "feat: add new feature"
# 🔍 Running lint-staged...
# ✅ ESLint passed
# ✅ Tests passed
# ✅ Commit allowed
```

### ❌ Linting Error
```bash
git add src/components/BuggyCode.tsx

git commit -m "feat: buggy feature"
# 🔍 Running lint-staged...
# ❌ ESLint errors found:
#    src/components/BuggyCode.tsx
#      5:10  error  'foo' is not defined
# ❌ Commit blocked
```

**Fix:**
```bash
# Auto-fix if possible
pnpm lint:fix

# Or fix manually, then retry
git add .
git commit -m "feat: fixed feature"
# ✅ Passes
```

### ❌ Invalid Commit Message
```bash
git commit -m "Add new feature"
# ⧗   input: Add new feature
# ✖   subject may not be empty [subject-empty]
# ✖   type may not be empty [type-empty]
#
# ✖   found 2 problems, 0 warnings
# ⓘ   Get help: https://github.com/conventional-changelog/commitlint
```

**Fix:**
```bash
git commit -m "feat: add new feature"
# ✅ Valid format - commit allowed
```

### ❌ Test Failure
```bash
git push
# 🔍 Running pre-push validation...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# 📝 Linting code...
# ✅ Linting passed
#
# 🧪 Running tests...
# ❌ FAIL src/components/MyComponent.test.tsx
# ❌ Tests failed. Fix the failing tests before pushing.
```

**Fix:**
```bash
# Fix the test
pnpm test

# Try again
git push
# ✅ All checks passed!
```

### ✅ Successful Push
```bash
git push
# 🔍 Running pre-push validation...
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# 📝 Linting code...
# ✅ Linting passed
#
# 🧪 Running tests...
# ✅ Tests passed (74 tests)
#
# 🏗️  Building application...
# ✅ Build passed
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# ✨ All checks passed! Proceeding with push...
#
# Pushing to origin...
```

---

## Manual Commands

Run the same checks manually:

### Quick Checks (Pre-Commit)
```bash
# Check only changed files
pnpm lint-staged
```

### Full Validation (Pre-Push)
```bash
# Run all checks
pnpm validate

# Or step by step:
pnpm lint          # Check linting
pnpm test --run    # Run all tests
pnpm build         # Build app
```

### Fix Issues
```bash
# Auto-fix linting
pnpm lint:fix

# Run tests in watch mode
pnpm test

# Run specific test
pnpm test MyComponent
```

---

## Skipping Hooks (NOT RECOMMENDED)

### Skip Pre-Commit (lint-staged)
```bash
git commit -m "feat: emergency fix" --no-verify
```

### Skip Pre-Push (validation)
```bash
git push --no-verify
```

⚠️ **Warning:** Skipping hooks means you might push broken code that will fail in CI/CD. Only use in emergencies.

---

## What Gets Checked

### Pre-Commit (Fast - Staged Files Only)
```
Changed files: 3 files
├─ src/components/Note.tsx
│  ├─ ESLint (auto-fix)
│  └─ Vitest (related tests only)
├─ src/hooks/useNotes.ts
│  ├─ ESLint (auto-fix)
│  └─ Vitest (related tests only)
└─ src/utils/helpers.ts
   ├─ ESLint (auto-fix)
   └─ Vitest (related tests only)

Time: ~5-10 seconds
```

### Pre-Push (Complete - All Files)
```
Full validation:
├─ ESLint (all 50+ files)
├─ Vitest (all 74 tests)
└─ Build (TypeScript + Vite + Electron)

Time: ~30-60 seconds
```

---

## Hook Configuration

### Commitlint (commitlint.config.js)
```javascript
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['feat', 'fix', 'docs', 'style', 'refactor', 
             'perf', 'test', 'build', 'ci', 'chore', 'revert']
        ],
        'subject-case': [0],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never']
    }
};
```

**What it validates:**
- Must have a valid type (feat, fix, etc.)
- Must have a non-empty subject
- Type must be lowercase
- Follows conventional commits specification

### Lint-Staged (package.json)
```json
"lint-staged": {
  "*.{ts,tsx}": [
    "eslint --fix",
    "vitest related --run"
  ]
}
```

**What it does:**
- Only runs on staged `.ts` and `.tsx` files
- Auto-fixes ESLint issues
- Runs tests related to changed files
- Fast and focused

### Pre-Push Script (package.json)
```json
"validate": "pnpm lint && pnpm test --run && pnpm build"
```

**What it does:**
- Lints entire codebase
- Runs all tests
- Builds complete application
- Mirrors GitHub Actions checks

---

## Troubleshooting

### "Husky not installed"
```bash
pnpm install
# Runs 'prepare' script automatically
```

### "Pre-commit hook not running"
```bash
# Reinstall hooks
rm -rf .husky
pnpm exec husky init

# Restore custom hooks
git checkout .husky/
```

### "Tests too slow in pre-commit"
The pre-commit hook only runs tests **related to changed files**, so it should be fast.

If still slow, you can modify `.husky/pre-commit`:
```bash
# Option 1: Skip tests in pre-commit (not recommended)
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm eslint src --fix

# Option 2: Run fewer tests
pnpm vitest --run --changed
```

### "Want to skip validation once"
```bash
# Emergency only
git push --no-verify
```

⚠️ This will likely fail in CI/CD

---

## Comparison

### Without Hooks
```
Developer cycle:
1. Code changes
2. git add .
3. git commit
4. git push
5. Wait 10 min for CI
6. ❌ CI fails (lint error)
7. Fix locally
8. git add .
9. git commit
10. git push
11. Wait 10 min for CI
12. ❌ CI fails (test error)
13. Fix locally
14. git add .
15. git commit
16. git push
17. Wait 10 min for CI
18. ✅ Finally passes

Time wasted: 30+ minutes
Commits: 3 fix commits
Frustration: High
```

### With Hooks
```
Developer cycle:
1. Code changes
2. git add .
3. git commit (pre-commit checks)
   ❌ Lint error caught
4. pnpm lint:fix
5. git add .
6. git commit
   ✅ Passes
7. git push (pre-push checks)
   ❌ Test error caught
8. Fix test
9. git push
   ✅ All checks pass
10. CI runs (guaranteed pass)
11. ✅ Success

Time saved: 20+ minutes
Commits: 1 good commit
Frustration: None
CI failures: Zero
```

---

## Best Practices

### ✅ Do This
```bash
# Make focused commits
git add src/components/Feature.tsx
git commit -m "feat(ui): add new button"

# Run checks before pushing
pnpm validate

# Fix issues immediately
pnpm lint:fix
```

### ❌ Avoid This
```bash
# Don't commit everything at once
git add .
# (50 files changed, hard to debug hook failures)

# Don't skip hooks habitually
git commit --no-verify

# Don't ignore hook failures
# (Fix them! They're there to help)
```

---

## Hook Files

All hooks are in `.husky/`:

```
.husky/
├── _/              # Husky internals
├── pre-commit      # Runs lint-staged
├── commit-msg      # Validates commit format
└── pre-push        # Runs full validation
```

Each hook is a shell script you can customize.

---

## Impact

### Time Investment
- ✅ Setup: 5 minutes (already done)
- ✅ Per commit: +5-10 seconds
- ✅ Per push: +30-60 seconds

### Time Savings
- ✅ Avoid CI failures: 10+ minutes per failure
- ✅ Catch issues early: Immediate feedback
- ✅ Fewer fix commits: Cleaner history

**Net benefit:** Save 20+ minutes per development session

### Quality Impact
- ✅ Zero linting errors in main
- ✅ Zero test failures in main
- ✅ Zero build failures in main
- ✅ 100% Conventional Commits
- ✅ Clean semantic versioning

---

## Integration with Semantic Release

Husky hooks work perfectly with semantic-release:

```bash
# 1. Make changes
vim src/components/Feature.tsx

# 2. Stage changes
git add src/components/Feature.tsx

# 3. Commit (pre-commit + commit-msg hooks)
git commit -m "feat: add amazing feature"
# ✅ Lint-staged passes
# ✅ Conventional format validated

# 4. Push (pre-push hook)
git push
# ✅ Lint passes
# ✅ Tests pass (74/74)
# ✅ Build passes

# 5. GitHub Actions runs
# ✅ All checks pass (guaranteed)
# ✅ Semantic-release analyzes commit
# ✅ Version bumped: 1.0.0 → 1.1.0
# ✅ CHANGELOG.md updated
# ✅ GitHub release created
# ✅ Installers uploaded

# All automatic. Zero failures. Zero stress.
```

---

## Summary

**What you get:**
- ✅ **Pre-commit:** Fast checks on changed files (lint + tests)
- ✅ **Commit-msg:** Enforce conventional commits format
- ✅ **Pre-push:** Full validation (lint + tests + build)
- ✅ **Zero CI failures:** Catch all issues locally
- ✅ **Faster development:** Immediate feedback
- ✅ **Better commits:** Consistent, semantic messages

**Your new workflow:**
```bash
# Code
git add .

# Commit (hooks catch issues)
git commit -m "feat: add feature"

# Push (hooks validate everything)
git push

# CI/CD passes every time ✅
```

**Result:**
- 🚀 Faster development
- 🎯 Zero CI failures
- 💯 Professional code quality
- 😊 Less frustration

---

**Welcome to automated quality checks! Every commit is production-ready.** 🎉
