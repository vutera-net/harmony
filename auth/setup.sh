#!/bin/bash
cd /home/linh/Projects/vu/base1/auth
npm install
npx prisma generate
npx prisma db push
