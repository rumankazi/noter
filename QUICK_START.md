# Noter - Quick Start Guide

## Getting Started in 30 Seconds

1. **Run the app**: `pnpm dev`
2. **Create your first note**: Click the blue `+` button in the bottom-right corner
3. **Start writing**: Type in the editor on the right
4. **Done!** Your notes auto-save every 2 minutes

---

## Basic Usage

### Creating Notes
- **Quick Way**: Click the floating `+` button (bottom-right)
- **With Menu**: File → New Note
- **Keyboard**: `Ctrl+N`

### Creating Folders
- **Long Press**: Hold the `+` button for 0.5 seconds, then select "New Folder"
- **With Menu**: File → New Folder  
- **Keyboard**: `Ctrl+Shift+N`

### Organizing Notes
1. **Drag & drop** notes into folders (sidebar)
2. **Right-click** folders for rename/delete options
3. **General folder** collects all notes without a folder

### Editing Notes
- Click any note in the sidebar to open it
- Type in the editor - **changes save automatically**
- Use **Markdown** for formatting (headings, lists, links, etc.)
- Live preview shows formatted text as you type

### Deleting Stuff
- **Notes**: Hover over a note → click the trash icon
- **Folders**: Right-click folder → Delete (confirms first)
- **From Editor**: Click trash icon in note title bar

### Finding Notes
- Use the **search bar** at the top
- Searches note titles and content
- Results appear instantly as you type

---

## Settings (Optional)

Click the ⚙️ **Settings** icon in the sidebar to customize:

### Auto-Save
- **On focus change**: Saves when you switch notes (enabled by default)
- **At intervals**: Saves every X seconds while editing
  - Default: 120 seconds (2 minutes)
  - Change to any value from 1-3600 seconds

### Data Storage
- **View location**: See where your notes are stored
- **Change location**: Click "Browse" to move your database
- **See size**: Check how much space your notes use

### Backup & Restore
- **Export**: Save all notes to a JSON file (backup)
- **Import**: Restore notes from a JSON file
- Use this before major changes or to transfer notes between computers

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| New Note | `Ctrl+N` |
| New Folder | `Ctrl+Shift+N` |
| Save | `Ctrl+S` |
| Command Palette | `Ctrl+Shift+P` |
| Search | Click search bar / `Ctrl+F` (in note) |

---

## Tips & Tricks

### Markdown Basics
```markdown
# Heading 1
## Heading 2
**bold** and *italic*
- Bullet list
1. Numbered list
[Link text](https://url.com)
`code`
```

### Quick Navigation
- Use `Ctrl+Shift+P` for command palette (power users)
- Recent notes appear at the top of "General" folder
- Collapse folders to save space

### Stay Organized
1. Create folders for projects/topics
2. Use descriptive note titles
3. Export backups regularly
4. Keep the General folder for quick notes

---

## Troubleshooting

### App won't start?
```bash
# Rebuild everything
pnpm install
pnpm build
pnpm dev
```

### Notes not saving?
- Check Settings → Auto-save is enabled
- Try manual save with `Ctrl+S`
- Check the data location has write permissions

### Can't find my notes?
- Check Settings → Data Storage to see location
- Look in General folder (collects all unorganized notes)
- Use search bar to find by content

### Settings not working?
- Restart the app completely
- Check browser console (F12) for errors
- Rebuild main process: `pnpm build:main`

---

## That's It!

Noter is designed to be simple:
- Create notes with the `+` button
- They save automatically
- Organize with folders
- Search to find

**No accounts, no cloud, no complexity.**
Just your notes, stored locally on your computer.

---

## Need More Help?

- Check `README.md` for technical details
- See `docs/` folder for developer documentation
- Open an issue on GitHub for bugs/features
