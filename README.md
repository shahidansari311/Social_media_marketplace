# SocialBazar - Social Media Account Marketplace

SocialBazar is a premium, secure marketplace for buying and selling social media accounts (YouTube, Instagram, TikTok, etc.) with built-in escrow protection and automated verification workflows.

## 🚀 Features

- **Premium Marketplace**: Browse verified social media assets with deep metrics (followers, engagement rate, etc.).
- **Escrow System**: Secure transactions where payments are held until credentials are verified and transferred.
- **Admin Panel**: Comprehensive dashboard for admins to manage listings, verify credentials, and process withdrawals.
- **Real-time Communication**: Integrated chat system for buyers and sellers (Negotiation phase).
- **Authentication**: Powered by Clerk for secure user management and social login.
- **Cloud Infrastructure**: Neon (Postgres), Imagekit (Optimized Assets), and Inngest (Background Jobs).

## 🛠️ Tech Stack

- **Frontend**: React, TailWind CSS, Redux Toolkit, Lucide Icons.
- **Backend**: Node.js, Express, Prisma ORM, Stripe.
- **Infrastructure**: Neon (Serverless Postgres), Inngest (Background Events), Clerk (Auth).

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- Postgres Database (Neon recommended)
- Stripe Account
- Clerk Account
- Imagekit Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/Social_media_marketplace.git
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Fill in your environment variables in .env
   npx prisma generate
   npx prisma db push
   npm run start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   cp .env.example .env
   # Fill in your environment variables in .env
   npm run dev
   ```

## 🔐 Production Readiness

- **Validation**: Strict request validation using Zod.
- **Security**: Stripe webhooks for secure payment processing, Clerk-protected routes, and Admin-only endpoints.
- **Performance**: Imagekit for on-the-fly image optimization and Inngest for offloading heavy tasks.
- **Consistency**: Centralized error handling and standardized API responses.

## 📄 License

This project is licensed under the MIT License.
