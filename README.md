# ✦ InkWell — Personalized Article Writing & Publishing Platform

> A beautifully designed, reader-first MERN stack blogging platform. Built with a modern Next.js 16 App Router frontend, a robust Express & MongoDB API server, and a fully customizable styling and typography system.

---

## 📖 Table of Contents

- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
  - [3. Running in Development](#3-running-in-development)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [✨ Key Features](#-key-features)
- [🔌 API Endpoints](#-api-endpoints)
- [🎨 Design System](#-design-system)
- [🛡️ Production Security Checklist](#️-production-security-checklist)
- [🌐 Deployment Guides](#-deployment-guides)
- [💰 Monetization Playbook](#-monetization-playbook)
- [📄 License](#-license)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: Local installation or a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database.

---

### 1. Backend Setup

First, configure your environment variables:
```bash
cd server
cp .env.example .env
```

Edit your `server/.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inkwell
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Install backend dependencies:
```bash
npm install
```

---

### 2. Frontend Setup

Move to the client folder and install dependencies:
```bash
cd ../client
npm install
```

---

### 3. Running in Development

Run both the backend and frontend in separate terminal windows:

**Terminal 1: Backend API Server**
```bash
cd server
npm run dev
```
*Runs at:* `http://localhost:5000`

**Terminal 2: Frontend App**
```bash
cd client
npm run dev
```
*Runs at:* `http://localhost:3000`

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI & Logic**: React 19, Lucide React (Icons), React Toastify (Notifications)
- **Animations**: Framer Motion
- **Rich Text Editor**: Quill / React Quill
- **Styling**: Vanilla CSS with modular stylesheets and custom design tokens

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS (Password hashing)
- **File Uploads**: Multer (Local disk storage)

---

## 📁 Project Structure

```
inkwell/
├── server/                  # Node.js + Express API Backend
│   ├── middleware/
│   │   └── auth.js          # JWT authentication checks
│   ├── models/
│   │   ├── User.js          # User profile and auth schema
│   │   └── Article.js       # Article fields, layout configuration, likes, views
│   ├── routes/
│   │   ├── auth.js          # Authentication, Profile and User endpoint routes
│   │   ├── articles.js      # Article CRUD, filters, and like endpoints
│   │   └── upload.js        # File uploading configuration
│   ├── uploads/             # Destination for uploaded images
│   ├── .env.example         # Template for environment settings
│   ├── index.js             # API entrypoint and database connection
│   └── package.json         # Backend dependencies
│
└── client/                  # Next.js App Router Frontend
    ├── public/              # Static files
    └── src/
        ├── app/             # Application pages
        │   ├── article/
        │   │   └── [slug]/  # Immersive article viewer (dynamic route)
        │   ├── dashboard/   # Content publisher metrics dashboard
        │   ├── login/       # Author login
        │   ├── profile/     # Settings & biography customizations
        │   ├── register/    # New author onboarding
        │   ├── write/       # Dynamic composition interface
        │   ├── layout.js    # Layout wrapper with Context providers
        │   ├── page.js      # Main reading stream landing
        │   └── globals.css  # Layout directives and page transitions
        ├── components/      # Shared components
        │   ├── Cards/
        │   │   └── ArticleCard.js  # Interactive article cards
        │   ├── Layout/
        │   │   ├── Footer.js
        │   │   └── Navbar.js       # Dynamic navigation header
        │   └── UI/
        │       └── ProtectedRoute.js # Interactive client-side router shield
        ├── context/         # React Context stores
        │   ├── AuthContext.js  # Global auth status
        │   └── ThemeContext.js # Global active theme store (Light/Dark)
        └── styles/          # Modular component stylesheet layers
            ├── ArticleCard.css
            ├── ArticlePage.css
            ├── Auth.css
            ├── Dashboard.css
            ├── Footer.css
            ├── Home.css
            ├── Navbar.css
            ├── Profile.css
            └── Write.css
```

---

## ✨ Key Features

### 📖 Reader Experience
*   **🌓 Adaptive Dark Mode**: Detects system preferences automatically and preserves choice across active sessions.
*   **⚡ Smart Reading Gauge**: Top-pinned scrolling progress line keeps readers oriented.
*   **🔍 Granular Filters**: Search index covering titles, summaries, specific domains, and tag groups.
*   **❤️ Micro-Animated Interactions**: Engaging like animations and transitions for responsive feedback.
*   **📱 Responsive Layouts**: Fluid design prioritizing readability on viewport scales from mobile to desktop.
*   **🎨 High-Readability Fonts**: Optimized typography featuring serif body fonts for comfortable long-form reading.

### ✍️ Publisher Toolbox
*   **📝 Powerful Composer**: Rich text formatting options: headings, bold/italic, lists, link attachments, blockquotes, and code elements.
*   **🖼️ Media Library Integration**: Cover image upload and body-inserted images powered by direct API uploads.
*   **🎨 Custom Stylers**: Custom options for font families, sizing, line-height, and primary accents.
*   **📐 Layout Presets**: Choose between **Classic**, **Magazine**, and **Minimal** page templates.
*   **🏷️ Structured Classification**: Categorize content with custom tags and root domains.
*   **👁️ True Live Preview**: Real-time styling view matches the exact final published result.
*   **📊 Analytics Dashboard**: Track total article reach, individual view counts, and total reader likes.

---

## 🔌 API Endpoints

### Authentication & Profile
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | ❌ | Create a new user account & return JWT |
| `POST` | `/api/auth/login` | ❌ | Authenticate credentials & return JWT |
| `GET` | `/api/auth/me` | 🔒 | Fetch logged-in user details |
| `PUT` | `/api/auth/profile` | 🔒 | Update name, biography, or user avatar |

### Articles
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/articles` | ❌ | Fetch all published articles (with search, domain, and tag filters) |
| `GET` | `/api/articles/my` | 🔒 | Fetch author's draft/published articles for Dashboard |
| `GET` | `/api/articles/:slug` | ❌ / 🔒 | Fetch single article by slug (Increment views count) |
| `POST` | `/api/articles` | 🔒 | Save a new draft or publish an article |
| `PUT` | `/api/articles/:id` | 🔒 | Update article metadata or body content (Author only) |
| `DELETE` | `/api/articles/:id` | 🔒 | Permanently remove an article (Author only) |
| `POST` | `/api/articles/:id/like` | 🔒 | Toggle user like status on an article |

### System & Media
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/health` | ❌ | API Server healthcheck and timestamp |
| `POST` | `/api/upload/image` | 🔒 | Upload single image attachment (Returns local link) |

---

## 🎨 Design System

Our interface utilizes a carefully selected warm, reader-focused palette:

| Token | CSS Variable | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :---: | :---: | :--- |
| **Background** | `--bg-primary` | `#faf8f5` | `#0f0e0d` | Screen canvas background |
| **Card** | `--bg-card` | `#ffffff` | `#1f1e1c` | Surface cards & headers |
| **Text Primary** | `--text-primary` | `#1c1917` | `#f5f0e8` | Reading & title typography |
| **Accent** | `--accent` | `#7c3aed` | `#a78bfa` | Links, progress, active items |
| **Border** | `--border-color` | `rgba(28,25,23,0.08)` | `rgba(245,240,232,0.07)` | Dividers and input boundaries |

### Typography Stack
*   **Headers & Titles**: `Playfair Display`, Georgia, serif (elegant, literary layout)
*   **User Interface**: `Inter`, system-ui, sans-serif (clean, high-readability controls)
*   **Article Reading Body**: `Merriweather`, Georgia, serif (optimized line heights for zero strain)

---

## 🛡️ Production Security Checklist

Ensure the following precautions are taken before deployment to a production host:
1.  **JWT Secret Security**: Replace `JWT_SECRET` in `.env` with a complex, cryptographically secure string.
2.  **Environment Settings**: Set `NODE_ENV=production` to restrict detailed stack traces.
3.  **Strict CORS Configuration**: Set backend `cors` origins to allow connections *only* from your active frontend domain.
4.  **Rate Limiter Implementation**: Add `express-rate-limit` middleware on critical routes (`/api/auth/*` and `/api/upload/*`).
5.  **SSL/TLS Security**: Configure production traffic to run exclusively over HTTPS.

---

## 🌐 Deployment Guides

### Deploying to Railway (Recommended)

1. Push your repository to GitHub.
2. Log into [Railway.app](https://railway.app) and select **New Project** → **Deploy from GitHub Repo**.
3. Create a **MongoDB Database** service instance inside the project.
4. **Backend Setup**:
   - Set the root directory configuration to `server`.
   - Set the startup run script to `node index.js`.
   - Setup environments variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=https://your-frontend-url.com`.
5. **Frontend Setup**:
   - Add another service connecting the same repo, set root directory to `client`.
   - Setup environments variables: `BACKEND_URL=https://your-backend-railway-url.app`.
   - Set build settings: command `npm run build`, start command `npm run start`.

---

### Deploying to Render

#### Backend Service
1. Create a **Web Service** on Render pointing to your GitHub repository.
2. Set Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `node index.js`
5. Configure your environmental variables (`MONGODB_URI`, `JWT_SECRET`, etc.).

#### Frontend Web Service
1. Create a **Web Service** (Node.js) on Render pointing to your GitHub repository.
2. Set Root Directory to `client`.
3. Build Command: `npm run build`
4. Start Command: `npm run start`
5. Add configuration environment variable: `BACKEND_URL=https://your-backend.onrender.com`.

---

## 💰 Monetization Playbook

Since InkWell is designed as an independent portal, you own your monetization streams entirely:

1.  **📧 Integrated Newsletter**: Embed a subscriber box to build a mailing list (e.g. ConvertKit, Beehiiv). A premium newsletter (charging $5–$15/mo) is a fast path to stable, recurring income.
2.  **🤝 Sponsorships**: Showcase sponsors within niche posts (tech, design, finances) once your reader traffic reaches 5,000+ monthly visits.
3.  **📚 Digital Products**: Link and upsell guides, ebooks, or templates directly from posts via platforms like Gumroad or Lemon Squeezy.
4.  **💼 Consulting Funnels**: Leverage highly-detailed technical posts to advertise your professional services or custom dev contracts.
5.  **💬 Paywall Subscriptions**: Lock premium articles behind a Stripe-integrated subscription middleware to monetize exclusive knowledge.
6.  **📢 Clean Ads**: Monetize views using high-quality developer-focused networks (e.g. Carbon Ads) that match the platform design.
7.  **🛠️ Affiliate Marketing**: Earn commission by linking tools, hosting, and books that you organically use and recommend.

---

## 📄 License

Distributed under the **MIT License**. Feel free to fork, customize, and monetize as your own platform.
