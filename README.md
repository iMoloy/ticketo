# Ticketo 🎟️ — Premium Event Ticket Booking & Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![BetterAuth](https://img.shields.io/badge/BetterAuth-Mocked-red?style=for-the-badge&logo=auth0)](https://better-auth.com/)

A premium, full-stack event ticket booking and management platform. Currently configured in **sandbox/mock mode** for frontend design and testing, allowing all dashboards and payment pages to be fully navigable without database crashes.

---

## 📋 Project Requirements & Specifications

The complete working document and feature requirements for this project can be accessed here:
👉 **[Google Doc Project Requirements](https://docs.google.com/document/d/1BHW20BQy6gArwIcOpgWjYrqbcJ4rm-tgvXgFJ1pO0CQ/edit?usp=sharing)**

---

## 🚀 Getting Started

Follow these steps to set up and run the client application locally:

### 1. Installation
Clone the repository and install the project dependencies:
```bash
npm install
```

### 2. Run the Development Server
Start the local server in development mode:
```bash
npm run dev
```

### 3. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 🛠️ Sandbox & Mock Mode
To allow seamless local design development, the backend Auth and Database modules have been mocked:
- **Mock Authentication**: Auth client & server configurations (`src/lib/auth.js` and `src/lib/auth-client.js`) return safe fallback properties, allowing sign-in states to run dynamically without active MongoDB instances.
- **Client Routes**: All primary attendee, organizer, and administrator routes compile statically.

---

## 🎯 Navigable Routes & Dashboards

- 🏠 **Home Page (`/`)**: Main landing page with a hero banner, statistics, featured event list, testimonials, and organizer guides.
- 🎟️ **Browse Events (`/events`)**: Lists all cards with filters.
- 🏷️ **Event Details (`/events/[id]`)**: Showcases single event descriptions and the Booking Widget.
- 💳 **Success Redirect (`/payment-success`)**: Stripe success landing view wrapped in Suspense.
- 🔒 **Auth Pages (`/login` & `/register`)**: Responsive forms centered inside viewports.
- 📊 **Attendee Dashboard (`/dashboard/attendee`)**: Shows active tickets and transaction details.
- 💼 **Organizer Dashboard (`/dashboard/organizer`)**: Holds the Manage Events dashboard, Add Event form, and Organization profile settings.
- 👑 **Admin Dashboard (`/dashboard/admin`)**: Shows global transaction tables, global statistics, user controls, and event moderations.

---

## ✨ Design System (Premium Glassmorphism)

- **Typography**: Fitted with the Google Font **Outfit** for clean typography.
- **Visual Texture**: Transparent dark backdrops with thin glass border colors (`.glass`, `.glass-card`).
- **Interactive Animations**: Micro-scaling, gradient transitions, and fade-in keyframes.
- **Dark Mode Scrollbars**: Integrated custom sleek track and thumb details.

---

## 📄 License

This project is created for educational and portfolio purposes.
