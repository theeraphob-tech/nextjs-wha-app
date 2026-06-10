---
name: project-onboarding
description: Use when a new developer asks about setup project. how to get started, what tech stack is used. Trigger on "โปรเจคนี้ตั้งค่าอย่างไร", "จะเริ่มต้นกับโปรเจคนี้ยังไงดี", "เทคสแตกของโปรเจคนี้มีอะไรบ้าง" or any oreintation question from someone unfamiliar with the project.
compatibility: Use Node.js 22+
license: MIT
metadata: 
  author: Theeraphob Soimora
  version: "1.0"
---

## First-Time Setup

```bash
# 1. Install Deps
npm install

# 2. Copy env
cp .env.example .env

# 3. Pull DB Schema (Prisma ORM)
npx prisma pull

# 4. Generate Prisma Client
npx prisma generate

# 5. Check lint
npm run lint
```

## Gotchas

- ต้องติดตั้ง และเปิด Docker Desktop ไว้ตลอดเวลาที่ทำงานกับโปรเจคนี้ เพราะเราจะใช้ Docker ในการรันฐานข้อมูล และบริการอื่นๆ ที่จำเป็นสำหรับการพัฒนา
- ให้อธิบายการรันโปรเจค ต้องใช้คำสั่ง `npm run dev` เพื่อรันโปรเจคในโหมดพัฒนา และสามารถเข้าถึงได้ที่ `http://localhost:3000`

## Output
- ถ้าถามการ Setup ให้ตอบเป็นรูปแบบตาราง และอ่านง่ายๆ สำหรับคนที่ไม่คุ้นเคยกับเทคโนโลยีที่ใช้ในโปรเจคนี้