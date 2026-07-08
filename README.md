# ✦ InkWell — Personalized Article Writing Platform

> A beautifully designed MERN stack blog platform with dark/light mode, rich text editing, and a reader-first experience.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Setup Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
```

### 2. Install Dependencies

```bash
# From root folder
cd server && npm install
cd ../client && npm install
```

### 3. Run in Development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm start
```

App runs at: `http://localhost:3000`  
API runs at: `http://localhost:5000`

---

## 📁 Project Structure

```
inkwell/
├── server/                  # Express + MongoDB API
│   ├── models/
│   │   ├── User.js          # User schema (auth, profile)
│   │   └── Article.js       # Article schema (content, layout, tags)
│   ├── routes/
│   │   ├── auth.js          # Register, login, profile
│   │   ├── articles.js      # CRUD, likes, views, filters
│   │   └── upload.js        # Image upload (Multer)
│   ├── middleware/
│   │   └── auth.js          # JWT auth middleware
│   ├── uploads/             # Uploaded images stored here
│   └── index.js             # Server entry point
│
└── client/                  # React frontend
    └── src/
        ├── context/
        │   ├── AuthContext.js   # Auth state (login/logout/register)
        │   └── ThemeContext.js  # Dark/light mode
        ├── components/
        │   ├── Layout/
        │   │   ├── Navbar.js    # Sticky nav with theme toggle
        │   │   └── Footer.js
        │   ├── Cards/
        │   │   └── ArticleCard.js  # Animated article cards
        │   └── UI/
        │       └── ProtectedRoute.js
        ├── pages/
        │   ├── Home.js          # Landing + article grid
        │   ├── Write.js         # Rich text editor
        │   ├── ArticlePage.js   # Article reader
        │   ├── Dashboard.js     # Author dashboard
        │   ├── Profile.js       # Profile settings
        │   ├── Login.js
        │   └── Register.js
        └── styles/
            └── globals.css      # Design tokens + animations
```

---

## ✨ Features

### For Readers
- 🌙 **Dark / Light mode** — auto-detects system preference, persists across sessions
- 📖 **Reading progress bar** — thin accent-colored bar at top
- 🔍 **Search & filter** — by domain, tag, keywords
- ❤️ **Like articles** — with animated heart button
- 📱 **Fully responsive** — mobile-first design
- 🎨 **Soothing color palette** — warm ink tones, no eye strain

### For Writers
- ✍️ **Rich text editor** — bold, italic, headings, lists, blockquotes, code, links
- 🖼️ **Image uploads** — in article body and cover image
- 🎨 **Custom styling** — choose font family, font size, text color, accent color
- 📐 **Layout options** — Classic, Magazine, Minimal
- 🏷️ **Tagging & domains** — organize by category
- 💾 **Draft / Publish** — save drafts, publish when ready
- 👁️ **Live preview** — see exactly how readers will see your article
- 📊 **Dashboard** — views, likes, total articles at a glance

---

## 🌐 Deployment

### Option A: Deploy to Railway (Recommended — Free)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app), create a new project
3. Add a **MongoDB** plugin (or use Atlas)
4. Deploy server: set root to `/server`, start command `node index.js`
5. Set env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=your-frontend-url`
6. Deploy client: set root to `/client`, build command `npm run build`, publish directory `build`

### Option B: Deploy to Render (Free tier)

**Backend:**
1. New Web Service → connect GitHub repo
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Add env vars

**Frontend:**
1. New Static Site → connect GitHub repo
2. Root Directory: `client`
3. Build Command: `npm run build`
4. Publish Directory: `build`
5. Add env: `REACT_APP_API_URL=https://your-backend.onrender.com`

### Option C: VPS (DigitalOcean / Linode)

```bash
# On server
git clone your-repo
cd inkwell/server && npm install
cd ../client && npm install && npm run build

# Serve client build with nginx
# Run server with PM2
pm2 start server/index.js --name inkwell-api
```

---

## 💰 How to Monetize InkWell

Since this is your personalized platform, here are **real, proven revenue streams**:

### 1. 📧 Newsletter (Easiest Start)
- Add a "Subscribe" section using **ConvertKit** or **Beehiiv** (free tiers)
- Build an email list of loyal readers
- Sell your newsletter directly ($5–$15/month per subscriber)
- **Potential: $500–$5,000/month** with 500–1000 subscribers

### 2. 🤝 Sponsorships & Brand Deals
- Once you have consistent traffic (5k+ monthly readers), brands pay to be featured
- A single sponsored article in a niche (tech, finance, health) can earn **$200–$2,000**
- Add a "Work With Me" page linking to your email

### 3. 📚 Digital Products
- Write an **eBook** or **guide** and sell it directly from your site
- Link to Gumroad or Lemon Squeezy for payment
- Example: "The Developer's Guide to Side Projects" — sell for $19–$49
- **Potential: $1,000–$10,000** in a launch

### 4. 💼 Freelance & Consulting
- Your articles demonstrate expertise
- Add a "Hire Me" page → land writing, consulting, or dev clients
- Rates: $50–$300/hr for niche expertise

### 5. 💬 Paid Community / Membership
- Integrate **Stripe** + a simple paywall (Node.js middleware) for premium articles
- Readers pay $5–$15/month for exclusive content
- 100 members × $10 = **$1,000/month recurring**

### 6. 📢 AdSense / Carbon Ads
- Once traffic hits 10k+/month, apply to **Google AdSense** or **Carbon Ads** (tech niche)
- Non-intrusive sidebar/footer ads
- **$1–$5 per 1,000 views** (RPM varies by niche)

### 7. 🛠️ Affiliate Marketing
- Recommend tools, books, software you genuinely use
- Add affiliate links (Amazon, Notion, hosting providers)
- **Earn 3–30% commission** on every sale

---

## 🎨 Design System

| Token | Light | Dark |
|---|---|---|
| Background | `#faf8f5` | `#0f0e0d` |
| Card | `#ffffff` | `#1f1e1c` |
| Text Primary | `#1c1917` | `#f5f0e8` |
| Accent | `#7c3aed` | `#a78bfa` |
| Border | `rgba(28,25,23,0.08)` | `rgba(245,240,232,0.07)` |

**Font Stack:**
- Display: Playfair Display (headlines)
- Body: Inter (UI, navigation)
- Reading: Merriweather (article body)

---

## 🛡️ Security Notes

Before going to production:
1. Change `JWT_SECRET` to a long random string
2. Set `NODE_ENV=production`
3. Add rate limiting: `npm install express-rate-limit`
4. Use HTTPS (SSL via Let's Encrypt or platform-provided)
5. Set `CORS` to your exact frontend domain

---

## 📄 License

MIT — Free to use, customize, and deploy as your own.

---

*Built with ✦ for writers who care about their craft.*
