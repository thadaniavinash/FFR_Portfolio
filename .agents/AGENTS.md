# Project-Scoped Rules for FFR Portfolio

## Auto-Sync and Push to GitHub
Whenever you edit files in this workspace (e.g., `index.html`, `scripts.js`, `styles.css`, or folders under `files/`), you MUST automatically sync those edits to the local GitHub repository folder and push them to GitHub.

### Sync and Push Procedure:
1. **Sync Files**: Copy updated files from the current workspace (`c:\Users\thada\Desktop\Georgian\FRAME_FFR\Google_Antigravity\FFR_Website`) to the repository directory (`C:\Users\thada\Documents\GitHub\FFR_Portfolio`) excluding `.git` and `.gemini` folders.
   Powershell command example:
   ```powershell
   Copy-Item -Path "c:\Users\thada\Desktop\Georgian\FRAME_FFR\Google_Antigravity\FFR_Website\*" -Destination "C:\Users\thada\Documents\GitHub\FFR_Portfolio" -Recurse -Force -Exclude ".git",".gemini"
   ```
2. **Git Add**: Stage the changes in the repository directory:
   ```powershell
   git -C "C:\Users\thada\Documents\GitHub\FFR_Portfolio" add .
   ```
3. **Git Commit**: Commit the changes:
   ```powershell
   git -C "C:\Users\thada\Documents\GitHub\FFR_Portfolio" commit -m "Auto-update portfolio from coding assistant"
   ```
4. **Git Push**: Push the commit to the remote repository on GitHub:
   ```powershell
   git -C "C:\Users\thada\Documents\GitHub\FFR_Portfolio" push origin main
   ```
