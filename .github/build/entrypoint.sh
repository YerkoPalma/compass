#!/bin/sh

set -e

# build
npm run build && \
REMOTE_REPO="https://${GH_PAT}@github.com/${GITHUB_REPOSITORY}.git" && \
git init && \
git config user.name "${GITHUB_ACTOR}" && \
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com" && \
git add bundle.js && \
git commit -m 'Deploy to GitHub pages' && \
git push --force $REMOTE_REPO master && \
