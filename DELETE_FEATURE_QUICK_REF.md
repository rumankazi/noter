# Quick Reference: Note Delete Feature

## Where Can I Delete Notes?

### 1. Notes List Section (Already Existed)
```
📝 All Notes
  📄 My Note        [🗑️ appears on hover]
  📄 Another Note   [🗑️ appears on hover]
```

### 2. Folder Sidebar (NEW ✨)
```
📁 Folders
  📂 Work
    📄 Meeting Notes    [🗑️ appears on hover]
    📄 Project Ideas    [🗑️ appears on hover]
  📂 Personal
    📄 Shopping List    [🗑️ appears on hover]
```

### 3. Note Editor (NEW ✨)
```
┌─────────────────────────────────────────────┐
│ Note Title...                        [🗑️]  │  ← Delete button always visible
├─────────────────────────────────────────────┤
│ Note content goes here...                   │
│                                              │
└─────────────────────────────────────────────┘
```

## How It Works

1. **Hover over any note** in the folder sidebar → Delete icon appears
2. **Open any note** in the editor → Delete icon always visible in title bar
3. **Click delete icon** → Confirmation dialog appears
4. **Confirm** → Note is permanently deleted

## Consistency

All delete actions work the same way:
- ✅ Same trash icon (🗑️)
- ✅ Same confirmation dialog
- ✅ Same red hover effect
- ✅ Same warning message

## Safety

Every delete action shows a confirmation:
```
┌─────────────────────────────────────────┐
│  Delete Note                            │
│                                         │
│  Are you sure you want to delete        │
│  "Your Note Title"? This action         │
│  cannot be undone.                      │
│                                         │
│         [Cancel]    [Confirm]           │
└─────────────────────────────────────────┘
```

## Keyboard Support

- Hover over note + `Enter` = Select note
- From note list: Hover + Click delete
- From editor: Click delete button in title bar
- Confirm with `Enter` or Cancel with `Esc`

## What Gets Deleted?

When you delete a note:
- ✅ Removed from database
- ✅ Removed from all views (sidebar, list, search)
- ✅ Editor shows next available note (or empty state)
- ✅ Cannot be undone (permanent deletion)

## Tips

1. **Quick Delete from Editor**: When editing a note, use the delete button in the title bar
2. **Organize First**: Move notes to folders before deleting to stay organized
3. **Be Careful**: Deletion is permanent - there's no undo or trash bin
4. **Use Search**: Find old notes with search before deleting

## Implementation Details

- Built on existing delete infrastructure
- No new backend code required
- Same Electron IPC handlers
- Consistent with app's VS Code-like theme
