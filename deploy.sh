#!/bin/sh

# If a command fails then the deploy stops
set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
export HUGO_ENV=production
hugo --environment production

# Go To Public folder
cd public

# Add changes to git.
git add .

# Commit changes.
msg="Publishing site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

# Update Algolio search index
printf "\033[0;32mUpdating Algolia search index...\033[0m\n"

npm install && npm run algolia  