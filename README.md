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
