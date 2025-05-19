#!/usr/bin/env bash
docker run --rm \
    -v "$(pwd)/game":/usr/src/app \
    -w /usr/src/app \
    node:20-alpine \
    sh -c "npm install --no-save && npx tsc"
