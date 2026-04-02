# Zipzo

Zipzo is a full-stack quick-commerce web application inspired by Blinkit and extended with AI recommendations, recurring subscriptions, loyalty rewards, scheduled delivery slots, voice search, dark mode, and basic price comparison across stores.

Motto: `Essentials In Minutes`

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: Firebase Firestore or MongoDB
- Auth: JWT
- Payments: Razorpay
- Hosting targets: Vercel for the frontend, Render for the backend

## Features

- User signup and login with JWT auth
- Browse products by category, brand, and search filters
- Product details with stock, weight, pricing, and comparison data
- Cart add, update, and remove flows
- Multiple saved delivery addresses
- Checkout with instant or scheduled delivery slots
- Razorpay-ready payment order creation with a mock fallback
- Live order tracking timeline
- Order history
- AI-style recommendations using purchase preferences
- Recurring subscriptions for daily, weekly, or monthly essentials
- Loyalty points and rewards progress
- Voice search in supported browsers
- Dark mode

## Project Structure

```text
backend/   Express API, MongoDB models, seed script
frontend/  React + Tailwind client
```

## Local Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Copy env templates:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Choose one backend storage mode in `backend/.env`:

Firebase Firestore:

```bash
USE_FIREBASE=true
DEMO_MODE=false
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Alternative single-variable option:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON='{"project_id":"...","client_email":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n..."}'
```

MongoDB:

```bash
USE_FIREBASE=false
DEMO_MODE=false
MONGODB_URI=your-mongodb-uri
```

Also set:

```bash
JWT_SECRET=replace-me
CLIENT_URL=http://127.0.0.1:5173
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

4. Seed sample products:

```bash
npm run seed
```

5. Run the apps in separate terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend runs on `http://localhost:5173` and backend on the `PORT` you configure.

## Deploy

### Render backend

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `PORT`
- `MONGODB_URI`
- `USE_FIREBASE`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `JWT_SECRET`
- `CLIENT_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

### Vercel frontend

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL`
  - `VITE_RAZORPAY_KEY_ID`

Point `VITE_API_URL` to your Render backend `/api` base URL.

## Notes

- Voice search depends on the browser Speech Recognition API.
- The Razorpay flow currently creates an order object and uses a mock fallback when keys are not configured.
- The recommendation engine is rule-based on purchase history and can be replaced with a dedicated ML or LLM service later.
- Firestore integration keeps the current Express + JWT API shape, so the React frontend does not need a Firebase client SDK rewrite.
