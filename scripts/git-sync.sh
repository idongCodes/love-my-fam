#!/bin/bash

# Usage: ./scripts/git-sync.sh "commit message" [new-branch-name]

COMMIT_MSG="$1"
NEW_BRANCH="$2"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

if [ -z "$COMMIT_MSG" ]; then
  echo -e "${RED}Error: Commit message is required.${NC}"
  echo "Usage: $0 \"commit message\" [new-branch-name]"
  exit 1
fi

# 1. Add all changes
echo -e "${YELLOW}Step 1: Adding all changes...${NC}"
git add .

# 2. Commit
echo -e "${YELLOW}Step 2: Committing...${NC}"
if git commit -m "$COMMIT_MSG"; then
    echo -e "${GREEN}Commit successful.${NC}"
else
    echo -e "${RED}Commit failed (perhaps nothing to commit?)${NC}"
    # We continue even if commit fails, in case user just wants to push/switch, 
    # but usually if commit fails due to empty, push might still be valid for previous commits.
fi

# 3. Push current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${YELLOW}Step 3: Pushing $CURRENT_BRANCH to origin...${NC}"
if git push origin "$CURRENT_BRANCH"; then
    echo -e "${GREEN}Push successful.${NC}"
else
    echo -e "${RED}Push failed.${NC}"
    exit 1
fi

# 4. Checkout new branch (if provided)
if [ -n "$NEW_BRANCH" ]; then
  echo -e "${YELLOW}Step 4: Creating and switching to new branch '$NEW_BRANCH'...${NC}"
  if git checkout -b "$NEW_BRANCH"; then
      echo -e "${GREEN}Switched to new branch: $NEW_BRANCH${NC}"
  else
      echo -e "${RED}Failed to create branch $NEW_BRANCH${NC}"
      exit 1
  fi
else
  echo -e "${YELLOW}Step 4: No new branch specified. Staying on $CURRENT_BRANCH.${NC}"
fi

echo -e "${GREEN}Done!${NC}"
