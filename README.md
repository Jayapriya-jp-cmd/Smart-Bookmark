# 🔖 Smart Bookmark App

A modern **Smart Bookmark Manager** built using **Next.js, Supabase, and Tailwind CSS**.
The application allows users to securely save and manage website bookmarks with **Google OAuth authentication** and **real-time updates**.

---

## 🚀 Features

* 🔐 **Google OAuth Authentication** (Sign In & Sign Up)
* 👤 User-specific private bookmarks (Row Level Security)
* ⚡ **Real-time bookmark updates**
* 📊 Interactive dashboard statistics

  * Total Bookmarks
  * Recently Added
  * Weekly Added
* 🔎 Dynamic filtering based on selected statistics
* 🌐 Website favicon preview for each bookmark
* 🎨 Clean white SaaS-style dashboard UI
* ☁️ Deployed on Vercel

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 14 (App Router), TypeScript
* **Styling:** Tailwind CSS
* **Backend & Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Google OAuth
* **Realtime:** Supabase Realtime subscriptions
* **Deployment:** Vercel

---

## ⚙️ Setup Instructions

1. Clone the repository

```bash
git clone <repo-url>
cd smart-bookmark
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run locally

```bash
npm run dev
```

---

## 🧩 Challenges Faced & Solutions

### 1️⃣ Real-Time Updates Not Working

**Problem:**
Bookmarks appeared only after page refresh.

**Solution:**
Enabled Supabase realtime replication and implemented `postgres_changes` subscription with proper refetch logic and cleanup.

---

### 2️⃣ Authentication UX (Sign In & Sign Up)

**Problem:**
Initially only a single Google login button existed, which felt like signup only.

**Solution:**
Created separate **Sign In** and **Sign Up** pages while using the same Google OAuth flow, improving user experience and navigation clarity.

---

### 3️⃣ Low UI Design

**Problem:**
Initial dashboard looked basic and lacked professional feel.

**Solution:**
Improved layout using Tailwind:

* White dashboard theme
* Card-based layout
* Interactive statistics filtering
* Better spacing and typography

---

### 4️⃣ Deployment Errors on Vercel

**Problem:**
Build failed with ESLint error:

```
react/no-unescaped-entities
Error: `'` can be escaped with &apos;
```

**Solution:**
Escaped special characters inside JSX and replaced `<img>` tags with optimized Next.js `<Image />` where required.

---

## 🌍 Live Demo

👉 https://smart-bookmark-xo6l.vercel.app/
---

## 📌 Future Improvements

* Bookmark categories & tagging
* Search and sorting options
* Metadata preview for links

---

## 👩‍💻 Author

**Jaya Priya R**

