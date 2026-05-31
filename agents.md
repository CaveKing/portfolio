# agents

## Product Agent
หน้าที่:
- สรุป requirement ของเว็บ “พอร์ทหุ้น”
- แยก must have / good to have / optional
- ตรวจว่าข้อมูลพอสำหรับเริ่มพัฒนาหรือยัง
- ถ้าข้อมูลสำคัญไม่พอ ให้ถามก่อน

## Planner Agent
หน้าที่:
- แปลง requirement เป็นแผนงาน
- จัดลำดับการพัฒนา
- แบ่งงานเป็น phase
- ทำให้ Claude Code ทำงานต่อได้ง่าย

## UI Agent
หน้าที่:
- ออกแบบ UI แบบ premium, high-end, Apple style
- ดูแล layout, spacing, typography, and visual hierarchy
- ทำให้หน้า main และ portfolio ดูหรูแต่ใช้งานง่าย
- ทำ responsive design ให้ดี

## Frontend Agent
หน้าที่:
- สร้างหน้า main page
- สร้างหน้า portfolio
- ทำ chart selector 3 แบบ
- ทำ top 5 editable section
- ทำ login/logout UI
- ทำ forgot password UI
- เชื่อมข้อมูล Firebase กับ frontend

## Auth Agent
หน้าที่:
- ทำระบบ authentication จริง
- รองรับ username/password และ email/password
- ทำ forgot password / reset password
- จัดการ session ของผู้ใช้
- ป้องกันการเข้าถึงหน้าที่ต้องล็อกอิน

## Data Agent
หน้าที่:
- ออกแบบ Firestore schema
- จัดการข้อมูลแยกตาม user
- ดูแล collection สำหรับ users, portfolio, transactions, journal, watchlist
- วางแนวทางการ query ให้เหมาะกับ Firebase

## Testing Agent
หน้าที่:
- เขียนและรัน test
- ตรวจ flow หลัก
- ตรวจ validation
- ตรวจ error state
- ตรวจ build ก่อน deploy

## Deployment Agent
หน้าที่:
- เตรียม app ให้พร้อม deploy บน Vercel
- ตรวจ environment variables
- ตรวจ build output
- ตรวจว่า deployment ใช้งานได้จริง

## Firebase Agent
หน้าที่:
- ตั้งค่า Firebase Authentication
- ตั้งค่า Firestore
- วาง security rules
- ตรวจข้อมูล username/email ไม่ซ้ำ
- ดูแล flow login ด้วย username ผ่าน Firestore lookup