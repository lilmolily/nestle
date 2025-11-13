param(
    [string]$RepoSsh = 'git@github.com:lilmolily/nestle.git'
)

# Simple helper script to init, commit, set SSH remote and push the current repo to GitHub.
# Run this from the repository root in PowerShell (pwsh.exe):
#   .\scripts\push-to-github.ps1

Write-Host "Running push-to-github.ps1 against remote: $RepoSsh`n"

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not available in PATH. Please install Git for Windows: https://git-scm.com/download/win"
    exit 1
}

try {
    # initialize repo if needed
    git init

    # stage and commit
    git add .
    git commit -m "Initial commit: frontend + backend, apparel products, UI updates" 2>$null | Out-Null

    # add or update remote
    git remote remove origin 2>$null
    git remote add origin $RepoSsh

    # set branch to main and push
    git branch -M main
    git push -u origin main

    Write-Host "Push completed (or in progress). If authentication is required, you'll be prompted to authenticate."
} catch {
    Write-Error "An error occurred: $_"
    exit 1
}
