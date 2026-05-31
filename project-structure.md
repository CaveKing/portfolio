# Project Structure

src
│
├── app
│   ├── login
│   ├── register
│   ├── forgot-password
│   ├── dashboard
│   ├── portfolio
│   └── profile
│
├── components
│   ├── ui
│   ├── charts
│   ├── portfolio
│   ├── dashboard
│   └── auth
│
├── hooks
│
├── lib
│   ├── firebase
│   ├── auth
│   └── firestore
│
├── services
│
├── types
│
├── utils
│
├── tests
│
├── styles
│
└── constants

---

Firestore

users
    userId

portfolio
    userId

transactions
    userId

journal
    userId

watchlist
    userId

---

Main Navigation

Dashboard
Portfolio
Profile

---

Dashboard Layout

Header

- Logo
- Username
- Avatar
- Logout

Main Content

- Portfolio Summary
- Charts
- Top 5 Must Buy

Footer