# Project-Scoped Rules for FFR Portfolio

## Direct Editing and Push to GitHub
Whenever you edit files in this workspace, you MUST edit them directly inside the local GitHub repository folder `C:\Users\thada\Documents\GitHub\FFR_Portfolio` (e.g., `C:\Users\thada\Documents\GitHub\FFR_Portfolio\index.html`, `C:\Users\thada\Documents\GitHub\FFR_Portfolio\scripts.js`, etc.) and immediately push those edits to GitHub.

### Edit and Push Procedure:
1. **Direct Edit**: Modify files directly within the repository path `C:\Users\thada\Documents\GitHub\FFR_Portfolio`.
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

