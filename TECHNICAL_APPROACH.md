# Technical Approach Document

**Project:** Wishify — Custom Greetings & Wishes App  
**Author:** Internship Candidate  
**Date:** May 2026  
**Stack:** Next.js 15, JavaScript, CSS Modules, html2canvas

---

## 1. Problem-Solving Approach

### 1.1 Image Overlay Logic

The core challenge was overlaying a user's profile photo and name onto a background template and exporting the result as a single shareable image — entirely in the browser without a backend.

**Implementation steps:**

1. **CSS-based Composition** — Each template card is a `<div>` with a CSS gradient background. The user's photo and name are absolutely-positioned children layered on top using `z-index`. This gives an instant live preview as the user edits.

2. **html2canvas Capture** — When the user clicks Share/Download, the library `html2canvas` traverses the DOM of the card preview element and renders it onto an HTML5 `<canvas>`, pixel by pixel. The canvas is then converted to a `Blob` via `canvas.toBlob()`.

3. **Download / Web Share API** — On desktop the Blob is converted to an object URL and triggered as a file download. On mobile, `navigator.share({ files: [blob] })` invokes the native OS share sheet, enabling direct sharing to WhatsApp, Instagram, etc.

4. **Image Compression** — Profile photos uploaded by the user are resized to max 300×300 px using a temporary canvas (`compressImage()`) before being stored as base64 in localStorage. This keeps storage usage below 5 MB.

**Key code locations:**
- `src/utils/imageUtils.js` — `captureElement`, `downloadCard`, `shareCard`, `compressImage`
- `src/app/editor/[id]/page.js` — the capturable `<div ref={cardRef}>` and share/download handlers

---

## 2. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 15 (App Router) | File-based routing, SSR/CSR flexibility, fast builds |
| Language | JavaScript (ES2022) | Wide adoption, no compilation overhead |
| Styling | CSS Modules + custom properties | Scoped styles, zero runtime, full design control |
| Image capture | html2canvas 1.4.1 | Renders styled DOM to canvas for PNG export |
| Sharing | Web Share API (browser native) | No third-party SDK needed for mobile share sheet |
| State | React Context API + localStorage | Lightweight, no extra dependency |
| Fonts | Google Fonts (Inter, Playfair Display) | Premium typography, loaded via CSS @import |

---

## 3. Architecture Decisions

### 3.1 No Backend Required
All auth state, user profile, and subscription status are stored in `localStorage`. This keeps the project self-contained and deployable as a static site. For production, this would be replaced with Firebase Auth + Firestore.

### 3.2 Template System
Templates are plain JavaScript objects in `src/data/templates.js`. Each template defines:
- `gradient` — CSS background gradient
- `pattern` — secondary CSS pattern overlay
- `photoPosition` — where the user photo appears (`top-center`, `top-left`, `top-right`)
- `textAlign` — text layout direction
- `isPremium` — gating flag

This data-driven approach means adding a new template requires only one object — no new components or CSS.

### 3.3 Dynamic Import for html2canvas
`html2canvas` uses browser-only APIs (`window`, `document`). It is imported dynamically inside the `captureElement()` async function to prevent SSR errors in Next.js.

```js
const html2canvas = (await import('html2canvas')).default;
```

### 3.4 Premium Gating
The `isPremium` flag on the `AppContext` determines whether a user can access premium templates. Clicking a locked template opens `PremiumModal`. After upgrade, `subscription = 'premium'` is saved to localStorage and the same templates become accessible immediately.

---

## 4. Challenges & Solutions

| Challenge | Solution |
|-----------|---------|
| html2canvas not rendering CSS gradients | Ensured inline `style` props on the card div so html2canvas picks them up correctly |
| CORS issues with external images | Using base64 data URLs for user photos (via FileReader + canvas compression) eliminates all CORS issues |
| localStorage 5 MB limit for photos | Compressing uploaded images to max 300×300 px JPEG at 0.82 quality before storing |
| Web Share API not available on desktop | Graceful fallback: detects `navigator.canShare` availability and falls back to PNG download |
| Next.js SSR + localStorage | Wrapped localStorage reads inside `useEffect` so they only run client-side |
| `useSearchParams` needing Suspense | Wrapped the component using `useSearchParams` inside a `<Suspense>` boundary as required by Next.js App Router |
| **Customization Scalability** | Used CSS Variables (`--msg-font-size`, etc.) passed to the card canvas to allow real-time UI updates without re-rendering complex logic |

---

## 5. Premium Features Implementation

### 5.1 Advanced Personalization
Premium users can now go beyond simple text editing:
- **Theme Colors**: Choose from a curated grid of 11 premium gradients and solid colors.
- **Typography Controls**: Adjust message font size (12px to 18px) and font weight (Regular to Black).
- **Decorative Overlays**: Toggle "Sparkles" or "Confetti" layers that use CSS radial-gradients and mix-blend-modes for a high-end feel.

### 5.2 Watermark Removal
The "Made with Wishify" watermark is conditionally rendered based on `isPremium` state, providing immediate value to upgraded users.

### 5.3 Feature Gating
All premium controls use a `handlePremiumAction` wrapper. If a free user clicks a premium feature, the `PremiumModal` is automatically triggered, creating a natural conversion funnel.

---

## 6. Future Improvements & Scalability
... (rest of the file)

### 5.1 Authentication
- Integrate **Firebase Auth** for real Google / Email login
- Add **OAuth tokens** and **session management**

### 5.2 Template Storage
- Move templates to a **CMS** (Contentful / Sanity) or **Firestore** so designers can add new templates without code deployments
- Store template background as actual high-res images in **Firebase Storage / Cloudinary**

### 5.3 Card Generation
- Move image compositing to a **serverless function** (Node.js + canvas / Puppeteer) for consistent output across devices
- Generate cards server-side as PNG on demand and return a CDN URL

### 5.4 Sharing
- Generate a **shareable URL** (e.g. `wishify.app/card/abc123`) where anyone can view the card in a browser — enabling link-based sharing for platforms that don't support native file sharing

### 5.5 Monetization
- Integrate **Razorpay / Stripe** for real payment processing
- Add **subscription webhooks** to update Firestore in real time

### 5.6 Performance
- Lazy-load template cards with **Intersection Observer**
- Use **Next.js Image** component with remote URLs once templates are in a CDN
- Add **service worker** for offline support (PWA)

---

## 6. App Flow Diagram

```
User visits /
    │
    ├─ Already logged in? → /home
    └─ Not logged in?
         ├─ Google Login (simulated)
         ├─ Email/Password
         └─ Guest
              │
              ▼
         /profile  (enter name, upload photo)
              │
              ▼
         /home  (browse 24 templates, filter by category)
              │
         ┌────┴────────┐
         │ Free card   │ Premium card
         │             │    → PremiumModal
         ▼             │    → Upgrade → unlock
    /editor/[id]  ◄────┘
         │
         ├─ Edit name / message / font
         ├─ Live card preview updates in real time
         └─ Share button
              │
              ├─ ShareModal → WhatsApp / Instagram / Email / Telegram
              └─ Download PNG  (html2canvas)
```
