#!/usr/bin/env bash
set -e
yarn workspaces focus backend
yarn workspace backend build
cp backend/.env.production backend/dist/routes/.env.production
