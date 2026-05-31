# context

## ชื่อโปรเจกต์
พอร์ทหุ้น (Portfolio)

## เป้าหมาย
สร้างเว็บแอปสำหรับดูและจัดการพอร์ตหุ้นในแบบพรีเมียม เรียบหรู ใช้งานง่าย และพร้อม deploy จริง

## ผู้ใช้เป้าหมาย
- คนที่อยากดูพอร์ตของตัวเอง
- คนที่อยากบันทึกหุ้นที่สนใจ
- คนที่อยากติดตาม history, performance และ journal

## Tech Stack
- Next.js
- React
- TypeScript
- HTML
- CSS
- Firebase Authentication
- Firebase Firestore
- npm / npx
- Vercel

## แนวทางดีไซน์
- premium
- high-end
- minimal
- clean
- Apple style
- responsive
- ไม่รก
- ใช้งานง่าย

## หน้าแอป
### Main Page
- ชื่อแอปหรือ logo “พอร์ทหุ้น”
- username อยู่มุมขวาบน
- avatar ผู้ใช้
- logout
- chart เกี่ยวกับหุ้น
- chart selector:
  - line chart
  - pie chart
  - dashboard
- top 5 must buy invest ที่แก้ไขได้

### Portfolio Page
- holdings
- history
- performance
- note/journal

## Authentication
- signup / register
- login
- logout
- forgot password / reset password
- login ได้ทั้ง username/password และ email/password
- username ต้องไม่ซ้ำ
- email ต้องไม่ซ้ำ
- lookup username ผ่าน Firestore แล้ว login ผ่าน Firebase Auth ด้วย email/password

## Firebase Data
### users/{userId}
- username
- email
- createdAt
- updatedAt

### portfolio/{userId}
- holdings

### transactions/{userId}
- history

### journal/{userId}
- notes

### watchlist/{userId}
- top5

## Important Rules
- ใช้ TypeScript แบบ strict
- ใช้ Firebase Security Rules
- ผู้ใช้ต้องเห็นเฉพาะข้อมูลของตัวเอง
- มี loading state / error state / empty state
- โค้ดต้องอ่านง่ายและต่อยอดง่าย
- ถ้าข้อมูลสำคัญไม่พอ ต้องถามก่อน
- ห้ามเดาสิ่งสำคัญเอง
- ต้อง test ก่อน deploy
- ต้อง deploy test ไป Vercel ให้ได้จริง

## Definition of Done
- login/logout ใช้ได้จริง
- login ได้ทั้ง username และ email
- forgot password ใช้ได้จริง
- username แสดงมุมขวาบน
- เปลี่ยน chart ได้ 3 แบบ
- top 5 editable ได้
- portfolio page ใช้ได้
- test ผ่าน
- build ผ่าน
- deploy Vercel สำเร็จ