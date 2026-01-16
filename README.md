<<<<<<< HEAD
# 🐱 Smart Cat Feeder Dashboard (Vue 3)

Modern dashboard for monitoring and controlling the ESP32-based Smart Cat Feeder.
Built with **Vue 3**, **Vite**, **Tailwind CSS v4**, and **Supabase**.

## 🚀 Features

- **Realtime Monitoring**: Live updates via Supabase Realtime.
- **Active Heartbeat**: Accurate "Online/Offline" status using bidirectional Ping-Pong.
- **Bento Grid UI**: Modern, responsive, and aesthetic design.
- **History Logs**: Feeding records timeline.

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API) + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide Vue

## 📂 Project Structure

```
dashboard-vue/
├── db/                 # SQL Migration files
├── src/
│   ├── assets/         # CSS and Images
│   ├── components/     # Reusable UI components
│   ├── lib/            # Supabase client & Helpers
│   ├── views/          # Page views
│   ├── App.vue         # Root component
│   └── main.ts         # Entry point
└── index.html
```

## ⚡ Deployment & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Database Setup**
   Run the SQL files in `db/` using Supabase SQL Editor:
   - `database_migration_v3.sql` (Device Status Table - **REQUIRED**)
   - `database_migration.sql` (Device Commands Table)
   - `database_migration_v2.sql` (Heartbeats Table - *Deprecated*)

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🤖 IoT Device Integration

The ESP32 code is located in `c:\IOT\iot\iot.ino`.
Ensure the device code is uploaded with the correct WiFi credentials and Supabase URL.
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> f01ce41a0e9852951a47b0fbaf728be022d3ea59
