# พอร์ทหุ้น (Portfolio)

เว็บแอปสำหรับ **ดูพอร์ตและติดตามการลงทุนในหุ้น** ในดีไซน์พรีเมียมสไตล์ Apple — เรียบหรู
ใช้งานง่าย รองรับทั้งมือถือและเดสก์ท็อป สร้างด้วย **Next.js + TypeScript + Firebase** และพร้อม deploy บน **Vercel**

> A premium, Apple-inspired stock-portfolio tracker. Built with Next.js (App Router),
> TypeScript (strict), Tailwind CSS, and Firebase (Auth + Firestore).

---

## ✨ ฟีเจอร์หลัก (Features)

**การยืนยันตัวตน (Authentication)**
- สมัครสมาชิก / เข้าสู่ระบบ / ออกจากระบบ จริงผ่าน Firebase Auth
- เข้าสู่ระบบได้ทั้ง **username + password** และ **email + password**
  (ถ้าใส่ username ระบบจะค้นหา email ที่ผูกไว้จาก Firestore ก่อน แล้วจึง login)
- ลืมรหัสผ่าน / รีเซ็ตรหัสผ่าน ผ่านอีเมลจริง
- username และ email ต้องไม่ซ้ำ (บังคับด้วย Firestore transaction + Security Rules)

**แดชบอร์ด (Dashboard)**
- สรุปมูลค่าพอร์ต ต้นทุน กำไร/ขาดทุน และจำนวนหุ้น
- สลับกราฟได้ทันที 3 แบบ **โดยไม่ reload หน้า**: เส้น (Line) · วงกลม (Pie) · แดชบอร์ด (Bar)
- **Top 5 หุ้นน่าซื้อ** ที่ผู้ใช้ **เพิ่ม / แก้ไข / ลบ / จัดอันดับ (reorder)** ได้เอง

**พอร์ตส่วนตัว (Portfolio)**
- **Holdings** — symbol, จำนวนหุ้น, ต้นทุนเฉลี่ย, ราคาปัจจุบัน, กำไร/ขาดทุน
- **History** — ซื้อ / ขาย / ฝากเงิน / ถอนเงิน พร้อมตัวกรอง
- **Performance** — รายวัน / สัปดาห์ / เดือน / ปี (กำไรรับรู้แล้ว, ยังไม่รับรู้, เงินทุนสุทธิ)
- **Journal** — สร้าง / แก้ไข / ลบ / ค้นหา บันทึกการลงทุน

**คุณภาพ UX**
- Loading / Empty / Error states ครบทุกหน้า
- Validation ทุกฟอร์ม · Responsive ทุกขนาดจอ · รองรับ Dark Mode อัตโนมัติ

---

## 🧱 Tech Stack

| ส่วน | เทคโนโลยี |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| ภาษา | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS 3 |
| กราฟ | Recharts |
| Auth + Database | Firebase Authentication, Cloud Firestore |
| Test | Vitest + Testing Library |
| Hosting | Vercel |

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```
src/
├── app/
│   ├── (auth)/                # หน้า public: login, register, forgot/reset password
│   ├── (app)/                 # หน้าที่ต้องล็อกอิน: dashboard, portfolio, profile
│   ├── layout.tsx             # root layout + providers
│   └── globals.css            # design tokens + Tailwind
├── components/
│   ├── ui/                    # ปุ่ม, อินพุต, การ์ด, โมดัล, toast ฯลฯ (reusable)
│   ├── auth/                  # AuthShell, ProtectedRoute
│   ├── layout/                # header, user menu, bottom nav
│   ├── charts/                # line / pie / dashboard chart views + selector
│   ├── dashboard/             # summary cards, Top 5
│   └── portfolio/             # holdings / history / performance / journal tabs
├── hooks/                     # useAuth, useFirestoreList, usePortfolioData
├── lib/
│   ├── firebase/              # client init + config
│   └── auth/                  # AuthProvider + authService
├── services/                  # Firestore CRUD (portfolio, transactions, journal, watchlist)
├── types/                     # โมเดลข้อมูล
├── utils/                     # calc, format, validation, errors (+ unit tests)
└── constants/

firestore.rules               # Security Rules
firestore.indexes.json        # Firestore indexes
firebase.json                 # config สำหรับ Firebase CLI
```

---

## 🚀 เริ่มต้นใช้งาน (Getting Started)

### 1) ติดตั้ง dependencies
```bash
npm install
```

> โปรเจกต์มีไฟล์ `.npmrc` ที่ตั้ง `legacy-peer-deps=true` เพื่อให้ install ได้ราบรื่นกับ React 19

### 2) ตั้งค่า Firebase (ดูขั้นตอนละเอียดด้านล่าง)
คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่าจริงจาก Firebase

### 3) รันในเครื่อง
```bash
npm run dev        # http://localhost:3000
```

### คำสั่งอื่น ๆ
```bash
npm run build      # build production (type-check ด้วย)
npm run start      # รัน production build
npm run lint       # ตรวจ ESLint
npm run test       # รัน unit tests (Vitest)
npm run test:watch # รัน tests แบบ watch
```

---

## 🔥 ตั้งค่า Firebase ทีละขั้น (Firebase Setup)

1. ไปที่ [Firebase Console](https://console.firebase.google.com) → **Add project** สร้างโปรเจกต์ใหม่
2. **Authentication** → Get started → แท็บ **Sign-in method** →
   เปิดใช้งาน **Email/Password**
3. **Firestore Database** → Create database → เลือก region (เช่น `asia-southeast1`) → 
   เริ่มแบบ *production mode* (เราจะวาง Security Rules เอง)
4. **Project settings (⚙️)** → เลื่อนลงไปที่ **Your apps** → กดไอคอน Web `</>` →
   ตั้งชื่อแอป → คัดลอกค่าใน `firebaseConfig`
5. สร้างไฟล์ `.env.local` ที่ root แล้วใส่ค่า (ดูหัวข้อ Environment Variables)
6. วาง Security Rules:
   - **แบบเร็ว:** คัดลอกเนื้อหาไฟล์ [`firestore.rules`](./firestore.rules) ไปวางใน
     Firebase Console → Firestore → แท็บ **Rules** → **Publish**
   - **แบบ CLI:**
     ```bash
     npm i -g firebase-tools
     firebase login
     firebase use --add          # เลือกโปรเจกต์ของคุณ
     firebase deploy --only firestore:rules
     ```

> หลังใส่ค่าจริงครบ แถบเตือน “ยังไม่ได้เชื่อมต่อ Firebase” จะหายไป และระบบล็อกอินจะใช้งานได้จริง

### Environment Variables
ทุกค่าขึ้นต้นด้วย `NEXT_PUBLIC_` เพราะ Firebase Web SDK ทำงานฝั่ง browser
(ความปลอดภัยมาจาก Firebase Auth + Security Rules ไม่ใช่จากการซ่อนค่าเหล่านี้)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## 🗃️ โครงสร้างข้อมูล (Firestore Data Model)

```
users/{uid}                      → { username, usernameLower, email, avatarColor, createdAt, updatedAt }
usernames/{usernameLower}        → { uid, email, username }      # public map สำหรับ login ด้วย username
portfolio/{uid}/holdings/{id}    → { symbol, shares, averageCost, currentPrice, currency, ... }
transactions/{uid}/history/{id}  → { type, symbol?, shares?, price?, amount, currency, date, ... }
journal/{uid}/notes/{id}         → { title, content, tags[], createdAt, updatedAt }
watchlist/{uid}/top5/{id}        → { symbol, name?, targetPrice?, currency, note?, order }
```

**ทำไมต้องมี `usernames` collection?**
การล็อกอินด้วย username ต้องหา email ก่อน *ตั้งแต่ยังไม่ได้ล็อกอิน* — เราจึงเก็บ map
`usernameLower → email` ไว้แบบอ่านได้สาธารณะ (อ่านได้เฉพาะ “ทีละเอกสาร” ห้าม list ทั้งคอลเล็กชัน)
ส่วนข้อมูลพอร์ตทั้งหมดผู้ใช้เห็นได้เฉพาะของตัวเองเท่านั้น (`request.auth.uid == uid`)

---

## 🧮 หมายเหตุการออกแบบ (Design Decisions)

- **ราคาหุ้นกรอกเอง (manual):** ผู้ใช้อัปเดต `currentPrice` เองเพื่อคำนวณกำไร/ขาดทุน
  ไม่มีการพึ่ง API ภายนอก ทำให้ใช้งานได้ฟรีและเสถียร (ต่อยอดเชื่อม API จริงได้ภายหลังที่ `services/`)
- **หลายสกุลเงิน (THB/USD):** เก็บสกุลเงินต่อรายการหุ้น และ **สรุปยอดแยกตามสกุลเงิน**
  (ไม่มีการแปลงค่าเงินข้ามสกุลเพื่อความถูกต้อง)
- **กราฟเส้น** สร้างจากประวัติรายการจริงของผู้ใช้ (cost-basis curve + ราคาตลาดล่าสุด)
  หากยังไม่มีรายการซื้อ/ขาย จะแสดงเป็นเงินทุนสุทธิสะสมแทน

---

## ▲ Deploy บน Vercel (Deployment Guide)

1. **Push โค้ดขึ้น Git** (GitHub / GitLab / Bitbucket)
   ```bash
   git init && git add . && git commit -m "Initial commit"
   git remote add origin <your-repo-url> && git push -u origin main
   ```
2. ไปที่ [vercel.com/new](https://vercel.com/new) → **Import** repository นี้
   (Vercel จะตรวจพบว่าเป็น Next.js อัตโนมัติ ไม่ต้องตั้งค่า build เพิ่ม)
3. **Environment Variables** → เพิ่มทั้ง 6 ตัว `NEXT_PUBLIC_FIREBASE_*` (ค่าเดียวกับ `.env.local`)
   ให้ครบทุก Environment (Production / Preview / Development)
4. กด **Deploy**
5. หลัง deploy เสร็จ ให้เพิ่มโดเมนของ Vercel (เช่น `your-app.vercel.app`) ไว้ใน
   Firebase Console → **Authentication → Settings → Authorized domains**
   เพื่อให้ระบบล็อกอินทำงานบนโดเมนนั้น
6. (ตัวเลือก) ตั้งค่า **Password reset** ให้สวยขึ้น: Firebase Console → Authentication →
   Templates → Password reset → ปรับ Action URL ให้ชี้มาที่ `https://your-app.vercel.app/reset-password`
   (แอปมีหน้า `/reset-password` รองรับ `oobCode` ไว้แล้ว)

> ไฟล์ `.npmrc` ในรีโปจะถูก Vercel ใช้อัตโนมัติ ทำให้ `npm install` บน Vercel ผ่านเช่นเดียวกับในเครื่อง

---

## ✅ Definition of Done

- [x] `npm run lint` ผ่าน
- [x] `npm run test` ผ่าน (34 tests)
- [x] `npm run build` ผ่าน (ไม่มี TypeScript error)
- [x] login/logout, login ด้วย username และ email, forgot password ใช้งานได้จริง
- [x] สลับกราฟได้ 3 แบบ และ Top 5 แก้ไข/จัดอันดับได้
- [x] Portfolio: holdings / history / performance / journal ครบ
- [x] Firestore Security Rules — ผู้ใช้เห็นเฉพาะข้อมูลตัวเอง
- [x] Responsive + Loading/Empty/Error states

---

## 📜 License

MIT
