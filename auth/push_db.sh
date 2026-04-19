#!/bin/bash
cd "$(dirname "$0")"
export DATABASE_URL="postgresql://postgres:example@localhost:5432/harmony_auth"
npx prisma db push
