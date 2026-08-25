# Pixel Crush — local setup

```
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

Notes:
- Data (products, orders, reviews, bank details) is stored in your browser's localStorage — it lives only on this machine/browser and resets if you clear site data.
- Admin login: use admin@pixelcrush.lk (no password needed, this is a prototype login).
- This is a front-end prototype: for a real production site with real accounts and a shared database, swap the storage helpers in src/App.jsx for a real backend.
