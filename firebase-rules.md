# Firestore Security Rules

Goals:

- User can access only their own data
- Prevent unauthorized reads
- Prevent unauthorized writes

Collections

users
portfolio
transactions
journal
watchlist

Rules

Authenticated users only.

User document access:

request.auth.uid == userId

No user can access another user's document.

All portfolio data must belong to owner uid.

All journal entries must belong to owner uid.

All watchlist entries must belong to owner uid.