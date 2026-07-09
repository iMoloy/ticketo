<div align="center">

  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:1a0a2e,100:2d1b69&height=180&section=header&text=Ticketo&fontSize=52&fontColor=ffffff&fontAlignY=38&desc=Premium%20Event%20Ticket%20Booking%20%26%20Management%20Platform&descAlignY=58&descSize=15&descColor=c084fc&animation=fadeIn" width="100%" alt="Ticketo banner" />

  [![Live App](https://img.shields.io/badge/🌐%20Live%20App-ticketo.vercel.app-a855f7?style=for-the-badge&logo=vercel&logoColor=white)](https://ticketo-app.vercel.app)
  [![GitHub](https://img.shields.io/badge/GitHub-iMoloy%2Fticketo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/iMoloy/ticketo)

</div>

---

## 📖 Overview

**Ticketo** is a premium, full-stack event ticket booking and management platform. Integrated with a live **MongoDB** database, **Better Auth** session authentication, and **Stripe** payments (with automatic sandbox fallback). Role-based dashboards for Attendees, Organizers, and Admins make it a complete end-to-end events platform.

> **Live at** → [https://ticketo-app.vercel.app](https://ticketo-app.vercel.app)

---

## 🛠️ Technologies Used

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | `16.2.7` | React framework (App Router) |
| [React](https://react.dev/) | `19.2.4` | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | `^4` | Utility-first styling |
| [HeroUI](https://heroui.com/) | `^3.1.0` | Premium component library |
| [Better Auth](https://www.better-auth.com/) | `^1.6.14` | Session authentication |
| [MongoDB](https://www.mongodb.com/) | `^7.2.0` | Database |
| [Stripe](https://stripe.com/) | `^22.3.0` | Payment processing |
| [Recharts](https://recharts.org/) | `^3.9.1` | Dashboard analytics charts |
| [React Icons](https://react-icons.github.io/) | `^5.6.0` | Icon library |
| [React Toastify](https://fkhadra.github.io/react-toastify/) | `^11.1.0` | Toast notifications |
| [Google Fonts — Outfit](https://fonts.google.com/specimen/Outfit) | — | Typography |

---

## ✨ Core Features

### 🎟️ Event Browsing & Booking
- **Browse Events** — Full event catalog with filters and search
- **Event Details** — Descriptions, seat availability, and a live Booking Widget
- **Stripe Checkout** — Secure payment for ticket booking
- **Sandbox Fallback** — If Stripe keys are missing, automatically redirects to a simulated sandbox payment page (`/simulated-payment`) for full testing

### 🔒 Authentication & Roles
- **Better Auth** — Session-based auth with email/password and Google OAuth
- **Three Roles** — Attendee, Organizer, Admin — each with private dashboards

### 📊 Dashboards
- **Attendee Dashboard** — Active tickets and transaction details
- **Organizer Dashboard** — Event management, Add Event form, Organization profile settings
- **Admin Dashboard** — Global transaction tables, user controls, event moderation, and statistics

### 🎨 Design System (Glassmorphism)
- **Outfit** font for clean, modern typography
- Transparent dark backdrops with glass borders (`.glass`, `.glass-card`)
- Micro-scaling hover effects, gradient transitions, and fade-in keyframes
- Custom dark-mode scrollbars

---

## 📦 Dependencies

### Production

| Package | Version | Purpose |
|---|---|---|
| `next` | `16.2.7` | Framework |
| `react` / `react-dom` | `19.2.4` | UI |
| `better-auth` | `^1.6.14` | Auth |
| `mongodb` | `^7.2.0` | Database |
| `stripe` | `^22.3.0` | Payments |
| `@heroui/react` | `^3.1.0` | Component library |
| `recharts` | `^3.9.1` | Charts |
| `react-icons` | `^5.6.0` | Icons |
| `react-toastify` | `^11.1.0` | Notifications |
| `kysely` | `^0.28.17` | SQL query builder (auth adapter) |

### Development

| Package | Purpose |
|---|---|
| `tailwindcss` `^4` | Styling |
| `eslint`, `eslint-config-next` | Linting |

---

## 🚀 Run Locally

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB Atlas** URI
- **Stripe** keys (optional — sandbox fallback available without them)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/iMoloy/ticketo.git
   cd ticketo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create `.env.local`:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ticketo
   DB_NAME=ticketo
   BETTER_AUTH_SECRET=your-custom-secret-key
   NEXT_PUBLIC_USE_REAL_AUTH=true

   # Optional — omit to use simulated sandbox checkout
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 📍 Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Homepage — hero, stats, featured events, testimonials |
| `/events` | Public | Browse all events with filters |
| `/events/[id]` | Public | Event detail and booking widget |
| `/login`, `/register` | Public | Auth pages |
| `/payment-success` | Public | Stripe success landing |
| `/simulated-payment` | Public | Sandbox checkout (no Stripe keys) |
| `/dashboard/attendee` | Private | Tickets and transactions |
| `/dashboard/organizer` | Private | Manage events, add event, profile |
| `/dashboard/admin` | Private | Global stats, user control, moderation |

---

## 🔗 Resources

- 🌐 **Live App** → [https://ticketo-app.vercel.app](https://ticketo-app.vercel.app)
- 🐙 **GitHub** → [github.com/iMoloy/ticketo](https://github.com/iMoloy/ticketo)
- 💼 **Author** → [linkedin.com/in/iMoloy](https://linkedin.com/in/iMoloy)

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:2d1b69,50:1a0a2e,100:0d1117&height=100&section=footer&animation=fadeIn" width="100%" alt="Footer" />
  <sub>Made with ❤️ by <strong>Moloy Krishna Paul</strong></sub>
</div>
