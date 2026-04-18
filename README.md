# 💳 Departmental Expense Wallet — Frontend

React-based dashboard for managing Business Unit wallets, submitting vendor payments, and simulating concurrent transactions.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏢 BU Tabs | Switch between Business Units instantly |
| 💰 Wallet Balance | Live balance display per BU |
| 📋 Transaction History | Scrollable ledger of all payments |
| 💸 Payment Form | Submit vendor invoice payments |
| ⚡ Simulation Panel | Fire concurrent requests to test race conditions |
| 🛠️ Admin Panel | Add BUs, add users, top-up wallets |

---

## 🏗️ Tech Stack

- **React** (Vite)
- **Axios** — API calls
- **uuid** — Idempotency key generation

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js              # Axios instance + all API functions
│   ├── components/
│   │   ├── WalletCard.jsx          # Balance display
│   │   ├── TransactionList.jsx     # Payment history
│   │   ├── PaymentForm.jsx         # Submit a payment
│   │   ├── SimulationPanel.jsx     # Concurrent test controls
│   │   └── admin/
│   │       ├── AddBUForm.jsx       # Create a new Business Unit
│   │       ├── AddUserForm.jsx     # Add user to a BU
│   │       └── TopUpForm.jsx       # Top up a wallet
│   ├── pages/
│   │   ├── Dashboard.jsx           # Main BU dashboard
│   │   └── AdminPage.jsx           # Admin management page
│   ├── App.jsx                     # Root with nav (Dashboard / Admin)
│   ├── index.css                   # Global styles
│   └── main.jsx                    # Vite entry point
├── .env                            # Environment config (not committed)
├── index.html
└── package.json
```

---

## ⚙️ Local Setup

### 1. Navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL=http://localhost:4000/api
```

### 4. Start the dev server

```bash
npm run dev
# App running on http://localhost:5173
```

> Make sure the backend is running on port `4000` before starting the frontend.

---

## 🖥️ Pages

### Dashboard

- Four BU tabs (Engineering, Marketing, Operations, Finance)
- Each tab shows:
  - Live wallet balance
  - Payment form (select user, enter amount, vendor name)
  - Simulation panel to fire concurrent requests
  - Full transaction history with status and balance trail

### Admin Panel

Accessible via the **Admin** button in the top nav.

| Tab | What it does |
|---|---|
| Add BU | Create a new Business Unit with opening wallet balance |
| Add user | Add an admin/viewer user to any BU |
| Top up wallet | Credit funds to a BU wallet with optional remarks |

---

## ⚡ Simulation Panel

Used to prove concurrency safety directly from the UI.

| Scenario | Config | Expected result |
|---|---|---|
| High-volume valid | 10 requests × ₹500, wallet = ₹50,000 | All 10 succeed, balance = ₹45,000 |
| Edge case | 2 requests × ₹1,500, wallet = ₹2,000 | 1 succeeds, 1 fails, balance = ₹500 |

Each request gets a unique `idempotency_key` (UUID) so re-runs never double-charge.

---

## 🌐 Deployment (Render / Vercel / Netlify)

### Build for production

```bash
npm run build
```

Output is in the `dist/` folder — deploy this to any static host.

### Environment variable for production

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

> On Render, set this under **Environment** in your Static Site settings.  
> On Vercel/Netlify, add it under project environment variables.

---

## 🔌 API Base URL

All API calls go through `src/api/client.js` which reads `VITE_API_URL` from `.env`.  
To point to a different backend, just update that one variable — no other changes needed.