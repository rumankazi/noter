# 🪝 Husky + Commitlint Setup Complete!

## What's Configured

✅ **Husky** - Git hooks automation
✅ **Commitlint** - Conventional commit validation
✅ **Lint-staged** - Fast linting on changed files
✅ **Pre-push validation** - Full checks before push

---

## Your Git Hooks

### 1️⃣ Pre-Commit Hook
**Trigger:** `git commit`

**What runs:**
- ESLint on staged `.ts` and `.tsx` files (auto-fixes)
- Vitest on tests related to changed files

**Speed:** ⚡ Fast (~5-10 seconds)

### 2️⃣ Commit Message Hook
**Trigger:** `git commit`

**What runs:**
- Commitlint validation

**Format required:**
```
<type>[(scope)][!]: <description>

Examples:
✅ feat: add dark mode
✅ fix: resolve crash on startup
✅ feat(editor): add markdown preview
✅ fix!: breaking API change
```

**Valid types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### 3️⃣ Pre-Push Hook
**Trigger:** `git push`

**What runs:**
1. ✅ Lint entire codebase
2. ✅ Run all 74 tests
3. ✅ Build application

**Speed:** 🚀 ~30-60 seconds (mirrors CI/CD)

---

## Quick Test

```bash
# ❌ This will fail
git commit -m "add feature"
# Error: type may not be empty

# ✅ This will pass
git commit -m "feat: add feature"
# Success!

# ✅ Push with validation
git push
# Runs lint → tests → build before pushing
```

---

## Benefits

### Before
```
git commit -m "add stuff"     ✅ Any message
git push                       ✅ No validation
# 10 min later: CI fails ❌
```

### After
```
git commit -m "add stuff"      ❌ Invalid format (instant feedback)
git commit -m "feat: add stuff" ✅ Valid
git push                        🔍 Checks lint, tests, build
                               ✅ All pass → push proceeds
# CI guaranteed to pass ✅
```

---

## Configuration Files

- `.husky/pre-commit` - Runs lint-staged
- `.husky/commit-msg` - Runs commitlint
- `.husky/pre-push` - Runs full validation
- `commitlint.config.js` - Commitlint rules
- `package.json` - lint-staged config + validate script

---

## Manual Commands

```bash
# Run pre-commit checks manually
pnpm lint-staged

# Run pre-push checks manually
pnpm validate

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test
```

---

## Skip Hooks (Emergency Only)

```bash
# Skip all hooks
git commit --no-verify
git push --no-verify
```

⚠️ **Warning:** Skipping hooks will likely cause CI failures. Use only in emergencies.

---

## Troubleshooting

### "commitlint not found"
```bash
pnpm install
```

### "Hooks not running"
```bash
pnpm exec husky init
git add .husky/
```

### "Tests too slow"
Pre-commit only runs tests for **changed files**, so it should be fast.

For pre-push, the full test suite (~74 tests) must pass to match CI/CD.

---

## Result

🎯 **Zero CI failures** - All issues caught locally
⚡ **Fast feedback** - Know immediately if commit is invalid
💯 **Professional commits** - Consistent conventional format
🚀 **Confident pushes** - Everything validated before reaching CI/CD

---

**See GIT_HOOKS.md for complete documentation!**
