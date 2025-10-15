# Noter - Visual Quick Reference

## Starting Noter

### Step 1: Install & Run
```bash
pnpm install    # First time only
pnpm dev        # Every time you want to use Noter
```

The app opens automatically!

---

## The Interface

```
┌───────────────────────────────────────────────────────────────┐
│  Noter                                      🔍 [Search...]    │
├─────────────┬─────────────────────┬──────────────────────────┤
│             │                     │                          │
│  FOLDERS    │   EDITOR            │   PREVIEW                │
│             │                     │                          │
│  📁 General │   # My Note         │   My Note                │
│   📝 Note 1 │                     │   ═════════              │
│   📝 Note 2 │   This is my note   │   This is my note        │
│             │                     │                          │
│  📁 Work    │   - Item 1          │   • Item 1               │
│   📝 Meeting│   - Item 2          │   • Item 2               │
│             │                     │                          │
│  📁 Personal│   **Bold text**     │   Bold text              │
│             │                     │                          │
│  ⚙️ Settings│                     │                          │
│             │                     │                          │
└─────────────┴─────────────────────┴──────────────────────────┘
                                                         🔵 [+]
```

---

## Key Actions

### 1️⃣ Create a Note
```
Step 1: Click the blue [+] button (bottom-right)
        ↓
Step 2: A new note appears
        ↓
Step 3: Start typing
        ↓
✅ Done! (saves automatically)
```

### 2️⃣ Create a Folder
```
Step 1: HOLD the blue [+] button (0.5 seconds)
        ↓
Step 2: Menu appears → Click "New Folder"
        ↓
Step 3: Type folder name → Press Enter
        ↓
✅ Done!
```

### 3️⃣ Organize Notes
```
Step 1: Click and hold a note
        ↓
Step 2: Drag it to a folder
        ↓
Step 3: Release
        ↓
✅ Note moved!
```

### 4️⃣ Delete a Note
```
Method A: Hover over note → Click 🗑️ trash icon

Method B: Open note → Click 🗑️ in title bar

Method C: Right-click note → Delete
```

### 5️⃣ Search for Notes
```
Step 1: Click search bar at top
        ↓
Step 2: Type anything
        ↓
Step 3: Results appear instantly
        ↓
✅ Found!
```

---

## The Magic `+` Button

Located: **Bottom-right corner**

### Quick Click = New Note
```
[+]  ←  Click once
 ↓
📝 New note created instantly
```

### Long Press = Menu
```
[+]  ←  Hold for 0.5 seconds
 ↓
┌─────────────┐
│ New Note    │ ← Create note
│ New Folder  │ ← Create folder
└─────────────┘
```

---

## Auto-Save

### How it works:
```
You type → Wait 2 minutes → Automatically saved ✅

OR

You type → Switch notes → Automatically saved ✅

OR

You type → Press Ctrl+S → Manually saved ✅
```

### Change auto-save timing:
```
1. Click ⚙️ Settings (bottom-left)
2. See "Auto-save at regular intervals"
3. Change number (in seconds)
4. Done! (120 = 2 minutes, 60 = 1 minute, etc.)
```

---

## Keyboard Shortcuts

```
┌──────────────────┬─────────────────────────┐
│  Shortcut        │  Action                 │
├──────────────────┼─────────────────────────┤
│  Ctrl+N          │  New Note               │
│  Ctrl+Shift+N    │  New Folder             │
│  Ctrl+S          │  Save Now               │
│  Ctrl+Shift+P    │  Command Palette        │
│  Esc             │  Close Dialog/Palette   │
└──────────────────┴─────────────────────────┘
```

---

## Settings Page

Click ⚙️ icon to access:

### Auto-Save Section
```
┌─────────────────────────────────────────┐
│ ☑️ Auto-save on focus change           │
│   └─ Saves when you switch notes       │
│                                         │
│ ☑️ Auto-save at regular intervals      │
│   └─ Every [120] seconds               │
└─────────────────────────────────────────┘
```

### Data Storage Section
```
┌─────────────────────────────────────────┐
│ Current Location:                       │
│ C:\Users\You\AppData\Local\Noter        │
│ [Browse] ← Click to change              │
│                                         │
│ Database size: 0.05 MB                  │
└─────────────────────────────────────────┘
```

### Backup Section
```
┌─────────────────────────────────────────┐
│  [Export Data]    [Import Data]         │
│  Save backup      Restore backup        │
└─────────────────────────────────────────┘
```

---

## Markdown Quick Reference

Type this → See this:

```
# Heading          →  Heading
                      ═══════

## Subheading      →  Subheading
                      ──────────

**bold**           →  bold (thick)

*italic*           →  italic (slanted)

- item             →  • item
- item             →  • item

1. first           →  1. first
2. second          →  2. second

[link](url)        →  clickable link

`code`             →  code (monospace)
```

**Don't like Markdown?** Just type normally! It works fine as plain text.

---

## Common Workflows

### Daily Note Taking
```
1. Open Noter
2. Click [+]
3. Type title: "2025-10-15 Notes"
4. Write your notes
5. Close app (saves automatically)
```

### Organized Project Notes
```
1. Hold [+] → Create folder "Project X"
2. Click [+] → Create notes
3. Drag notes into "Project X" folder
4. Use search when you need to find something
```

### Quick Capture
```
1. Click [+] (don't bother with title)
2. Type idea quickly
3. Organize later (or never - General folder keeps it)
```

---

## Troubleshooting

### Problem: App won't start
**Solution:**
```bash
pnpm install
pnpm build
pnpm dev
```

### Problem: Can't find a note
**Solution:**
1. Use search bar at top
2. Check "General" folder (collects all unorganized notes)

### Problem: Notes not saving
**Solution:**
1. Press `Ctrl+S` to save manually
2. Check Settings → Auto-save is enabled
3. Wait 2 minutes (default auto-save interval)

### Problem: Want to backup
**Solution:**
1. Click ⚙️ Settings
2. Click "Export Data"
3. Save file somewhere safe
4. Done!

---

## Summary

**Noter in 3 Steps:**
1. Click `+` → New note
2. Type → Your content
3. Forget it → Saves automatically

**Everything else is optional.**

---

## Questions?

- **Quick Start**: [QUICK_START.md](QUICK_START.md)
- **Full Guide**: [USER_GUIDE.md](USER_GUIDE.md)
- **Ultra Simple**: [HOW_TO_USE.md](HOW_TO_USE.md)
- **Technical**: [README.md](README.md)

**Still confused?** Open an issue on GitHub. We'll make it simpler!
