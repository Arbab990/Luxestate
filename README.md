# LuxEstate

LuxEstate is a full-stack luxury real estate platform built with React, Vite, Express, and MongoDB. It includes a polished public-facing property experience and an admin dashboard for managing listings, inquiries, articles, and careers.

## Overview

This repository contains:

- `frontend` - React + Vite client application
- `backend` - Express + MongoDB API

## Features

- Luxury-style home page with video hero and featured listings
- Property listings with category filters, search, sorting, and detail pages
- Inquiry form for property interest
- Admin authentication
- Admin dashboard for:
  - managing listings
  - viewing inquiry logs
  - publishing articles
  - managing careers
- Responsive UI built with Tailwind CSS

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- bcryptjs
- dotenv

## Project Structure

```text
luxestate/
├─ backend/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ index.js
│  └─ seed.js
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  └─ utils/
│  ├─ index.html
│  └─ vite.config.js
├─ package.json
└─ .gitignore
```

## Local Setup

### Requirements

- Node.js 18+
- npm
- MongoDB local instance or MongoDB Atlas

### Install dependencies

From the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

### Backend

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend

Create `frontend/.env` if needed:

```env
VITE_API_URL=http://localhost:5000
```

If `frontend/.env` is not provided, the frontend falls back to `http://localhost:5000`.

## Running the Project

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

### Root-level helper commands

From the repo root:

```bash
npm run dev:backend
npm run dev:frontend
npm run seed
```

## Seed Data

The backend includes a seed script:

```bash
cd backend
node seed.js
```

This creates demo content including an admin user.

## API Areas

The backend currently exposes routes for:

- `/api/auth`
- `/api/listings`
- `/api/inquiries`
- `/api/company`
- `/api/users`

## Deployment

This project can be deployed as two services:

- frontend on Render Static Site
- backend on Render Web Service

### Backend Render settings

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`

Backend environment variables:

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_random_secret
CLIENT_URL=https://your-frontend-domain.onrender.com
PORT=5000
```

### Frontend Render settings

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

Frontend environment variables:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

## Notes

- Do not commit real `.env` files
- Rotate any exposed database credentials before deployment
- Use MongoDB Atlas for production instead of a local MongoDB instance
- Set the correct deployed frontend URL in `CLIENT_URL` to make CORS work in production

## Scripts

### Root

```json
{
  "dev:backend": "cd backend && npm run dev",
  "dev:frontend": "cd frontend && npm run dev",
  "seed": "cd backend && node seed.js"
}
```

### Frontend

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Backend

```json
{
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## Current Pages

### Public

- Home
- Listings
- Listing Detail
- About
- Blog
- Press
- Careers
- Article Detail

### Admin

- Login
- Dashboard
- Create/Edit Listing
- Create/Edit Article
- Create/Edit Career

## Future Improvements

- Password reset and change-password flow
- Stronger backend validation
- Image storage service integration
- Role-based access expansion
- Production-ready logging and monitoring

