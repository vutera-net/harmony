#!/bin/bash
cd /home/linh/Projects/vutera.net/harmony/auth
npm install
npx prisma generate
npx prisma db push
