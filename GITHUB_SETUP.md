# GitHub Setup Instructions for Core Zip

## Step 1: Install Git
Download and install Git from: https://git-scm.com/download/win

Choose default options during installation. After installation, restart your terminal.

## Step 2: Configure Git (first time only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Navigate to Project and Initialize
```powershell
cd "c:\Users\nicely jane\OneDrive\Desktop\nestle-20251114T213440Z-1-001\nestle"
git init
```

## Step 4: Add All Files
```powershell
git add .
```

## Step 5: Create First Commit
```powershell
git commit -m "Initial commit: Core Zip e-commerce with Node.js backend"
```

## Step 6: Add Remote Repository
```powershell
git remote add origin https://github.com/lilmolily/nestle.git
```

## Step 7: Rename Branch to Main (if needed)
```powershell
git branch -M main
```

## Step 8: Push to GitHub
```powershell
git push -u origin main
```

When prompted for authentication:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (recommended) instead of your password
  - Create one at: https://github.com/settings/tokens
  - Scopes needed: repo (full control of private repositories)

## Step 9: Subsequent Pushes
After making changes:
```powershell
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### If you get "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/lilmolily/nestle.git
```

### If the repository doesn't exist on GitHub
1. Go to https://github.com/lilmolily/nestle
2. Make sure the repository is created (it should be from your link)
3. If not, create it at https://github.com/new

## Files to Push
Your project structure includes:
```
nestle/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── admin-login.html
│   ├── admin-dashboard.html
│   ├── about.html
│   ├── contact.html
│   ├── script.js
│   ├── admin.js
│   ├── style.css
│   └── server.js (legacy)
├── scripts/
│   └── push-to-github.ps1
├── README.md
└── README_BACKEND.md
```

## Optional: Create .gitignore
Create a file named `.gitignore` in the project root:
```
node_modules/
.env
.DS_Store
*.log
.vscode/
```

Then add and commit it:
```powershell
git add .gitignore
git commit -m "Add gitignore"
git push
```
