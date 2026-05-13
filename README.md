# ✨ Wishify — Personalized Greeting Cards App

A full-featured Next.js web application that lets users create beautiful personalized greeting cards with their photo and name, then share them across WhatsApp, Instagram, Email, and more.

---

## 🚀 Live Demo

Run locally at: **http://localhost:3000**
Deployed at: https://greetings-card-eta.vercel.app/home

---

## 📋 Features

### Authentication
- 🔐 Google Login (simulated)
- 📧 Email / Sign-up flow
- 👤 Guest mode

### Home Page
- 24 templates across 6 categories (Birthday, Anniversary, Festivals, Congratulations, Thank You, Love)
- Live preview with user photo & name overlaid on every template card
- Search & category filter
- Free / Premium badge on each template

### Personalization & Editor
- Live card editor with real-time name & message editing
- Font style picker (4 options)
- User photo displayed as circular overlay on the card
- Download card as PNG (html2canvas)
- Native Web Share API (mobile) with fallback download

### Monetization
- Premium templates locked with 🔒 overlay
- Premium upsell modal with Monthly (₹99/mo) & Annual (₹499/yr) plans
- One-click upgrade unlocks all premium templates

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 15 (App Router) | Full-stack React framework |
| JavaScript (JS) | Language |
| CSS Modules | Scoped component styling |
| html2canvas | DOM → PNG capture for card download/share |
| Web Share API | Native mobile sharing |
| localStorage | Auth & profile persistence |
| Google Fonts | Inter + Playfair Display typography |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm 9+

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/wishify-greetings-app.git
cd wishify-greetings-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:3000
```

> No environment variables or API keys required — everything runs locally.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.js              # Login / Auth page
│   ├── page.module.css
│   ├── layout.js            # Root layout + metadata
│   ├── globals.css          # Global design system
│   ├── profile/
│   │   ├── page.js          # Profile setup (name + photo)
│   │   └── profile.module.css
│   ├── home/
│   │   ├── page.js          # Template browse & grid
│   │   └── home.module.css
│   └── editor/[id]/
│       ├── page.js          # Card editor with live overlay
│       └── editor.module.css
├── components/
│   ├── Navbar.js            # Top navigation
│   ├── CategoryFilter.js    # Category chip bar
│   ├── TemplateCard.js      # Template preview card
│   ├── PremiumModal.js      # Subscription upsell popup
│   └── ShareModal.js        # Share/download modal
├── context/
│   └── AppContext.js        # Global state (auth, subscription)
├── data/
│   └── templates.js         # 24 template definitions
└── utils/
    └── imageUtils.js        # html2canvas, compress, share helpers
```

---

## 🗺️ App Flow

```
/ (Login) → /profile (Setup) → /home (Browse) → /editor/[id] (Personalize & Share)
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 📄 License

MIT — Free to use for educational and personal projects.

---

Made by Kunal ❤️


