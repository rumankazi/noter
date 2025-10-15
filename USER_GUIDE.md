# Noter - What Users Need to Know

## The Absolute Basics

### Starting the App
```bash
pnpm dev
```
That's it. The app opens automatically.

---

## Your First 5 Minutes

### Step 1: Create Your First Note (5 seconds)
👉 **See the blue `+` button in the bottom-right corner?**
- Click it
- A new note appears
- Start typing

**That's it.** Your note is created.

### Step 2: Give It a Title (10 seconds)
- See the text at the top that says "Untitled"?
- Click it
- Type a title
- Press Enter

**Done.** Your note has a name.

### Step 3: Write Something (30 seconds)
- The big white area? That's your editor
- Just type like any other text editor
- Try typing: `# My First Note`
- See the live preview on the right? That's Markdown formatting

**Magic.** Your note looks pretty.

### Step 4: Create a Folder (10 seconds)
- Go back to the blue `+` button
- **Hold it down** for half a second
- Click "New Folder"
- Name it whatever you want

**Organized.** Now you can group notes.

### Step 5: Relax (Forever)
**Your notes save automatically every 2 minutes.**

You don't need to click save. You don't need to worry. Just write.

---

## Common Questions

### "Where's the save button?"
**There isn't one.** Notes save automatically.

If you really want to save right now: Press `Ctrl+S`

### "Where are my notes stored?"
On your computer. Not in the cloud.

Want to know exactly where? Go to Settings (⚙️ icon) → Data Storage

### "How do I organize notes?"
1. Create folders (hold the `+` button)
2. Drag notes into folders
3. Done

### "How do I delete a note?"
- Hover over the note in the sidebar
- Click the trash icon that appears
- Confirm

Or: Open the note, click the trash icon in the title bar

### "What's Markdown?"
A simple way to format text:
- `# Big Heading` → Big heading
- `**bold**` → **bold**
- `- item` → bullet list

Don't worry about it. Just type normally and notes work fine.

### "Can I change the auto-save time?"
Yes!
1. Click ⚙️ Settings
2. See "Auto-save at regular intervals"
3. Change the number (in seconds)
4. Done

### "How do I backup my notes?"
1. Click ⚙️ Settings
2. Click "Export Data"
3. Choose where to save the file
4. Done

To restore: Click "Import Data" and select your backup file.

---

## The Interface

```
┌─────────────────────────────────────────────────┐
│  Noter                            [Search...]   │ ← Top bar
├──────────┬──────────────────────────────────────┤
│          │                                      │
│  📁 General   ← Your folders/notes              │
│  📝 Note 1                                       │
│  📝 Note 2    ← Click to open                    │
│          │                                      │
│  📁 Work      Your note content →               │
│    📝 Meeting │                                 │
│          │  Type here                           │
│          │                                      │
│  ⚙️ Settings  Live preview →                     │
│          │                                      │
└──────────┴──────────────────────────────────────┘
                                            [+] ← Click for new note
```

### Left Sidebar
- Your folders and notes
- Click to open
- Drag to organize
- Right-click for options

### Center
- Where you type
- Works like any text editor
- Supports Markdown (optional)

### Right
- Live preview of your note
- Shows how formatting looks
- Updates as you type

### Bottom-Right `+` Button
- **Click**: New note
- **Hold**: Show menu (new note or folder)

### Bottom Left Settings (⚙️)
- Auto-save settings
- Data location
- Backup/restore

---

## You're Done!

That's literally everything you need to know to use Noter.

**The Philosophy:**
- Creating notes should be effortless
- Organizing should be optional
- Saving should be automatic
- Everything should just work

If something confuses you, it's probably our fault. Open an issue and we'll make it simpler.

---

## Advanced Features (If You Want Them)

### Command Palette
Press `Ctrl+Shift+P` to search for any action.

### Keyboard Shortcuts
- `Ctrl+N`: New note
- `Ctrl+Shift+N`: New folder
- `Ctrl+S`: Save now

### Search
Type in the search bar to find notes by title or content.

### Markdown
Learn at https://www.markdownguide.org/basic-syntax/

But honestly? You don't need it. Plain text works great.

---

## Troubleshooting

### App won't start?
```bash
pnpm install
pnpm build
pnpm dev
```

### Notes not saving?
- They save automatically every 2 minutes
- Or press `Ctrl+S` to save immediately
- Check Settings → Auto-save is enabled

### Something broke?
Close the app and start it again. Most problems fix themselves.

Still broken? Open an issue on GitHub with:
- What you did
- What happened
- What you expected

---

## That's Everything

Noter is simple by design:
1. Click `+` to create
2. Type to write
3. It saves automatically

Everything else is optional.

**Happy note-taking! 📝**
