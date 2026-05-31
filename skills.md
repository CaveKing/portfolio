# skills

## เป้าหมาย
สร้างเว็บแอป “พอร์ทหุ้น” สำหรับดูพอร์ตหุ้นและติดตามการลงทุนในรูปแบบพรีเมียม เรียบหรู ใช้งานง่าย และพร้อมใช้งานจริง

## Tech Stack
- Next.js
- React
- TypeScript
- HTML5
- CSS3
- JavaScript เมื่อจำเป็น
- Firebase Authentication
- Firebase Firestore
- npm / npx
- Vercel

## ความสามารถที่ต้องใช้
- Frontend development ด้วย Next.js
- Responsive UI
- Premium UI design
- Authentication flow
- Firebase integration
- Database CRUD
- Chart UI
- Form validation
- Testing
- Deployment

## แนวทางการออกแบบ
- minimal
- clean
- premium
- high-end
- Apple style
- อ่านง่าย
- ใช้งานง่าย
- spacing ดี
- hierarchy ชัด
- รองรับ desktop และ mobile

## ฟีเจอร์ที่ต้องมี
- login / logout
- signup / register
- login ด้วย username/password หรือ email/password
- forgot password / reset password
- username มุมขวาบน
- avatar ผู้ใช้
- main dashboard
- chart selector 3 แบบ:
  - line chart
  - pie chart
  - dashboard
- top 5 must buy invest editable
- portfolio page:
  - holdings
  - history
  - performance
  - note/journal

## ข้อกำหนด Firebase
- Firebase Authentication สำหรับ auth
- Firestore สำหรับข้อมูลผู้ใช้และพอร์ต
- username ต้องไม่ซ้ำ
- email ต้องไม่ซ้ำ
- ถ้า login ด้วย username ให้ lookup ผ่าน Firestore ก่อน login ด้วย email/password
- ต้องมี security rules

## คุณภาพโค้ด
- แยก component ชัดเจน
- ใช้ TypeScript strict
- มี loading state
- มี empty state
- มี error handling
- มี validation
- เขียนให้ต่อยอดง่าย

## การทำงาน
- ถ้าข้อมูลไม่พอ ให้ถามก่อน
- ห้ามเดาสิ่งสำคัญเอง
- สร้างโค้ดแบบ production-ready
- รัน test ทุกครั้ง
- แก้ error จน build ผ่าน
- deploy test ไป Vercel
- ตรวจสอบ deployment ก่อนจบงาน