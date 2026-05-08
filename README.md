# CoolCliq: Anonymous In-Venue Social Discovery

CoolCliq is a high-fidelity, privacy-first social platform designed to bridge the gap between digital discovery and real-world meeting. It allows users to find active venues, see who’s present, and initiate anonymous 1-to-1 chats, eventually leading to a mutual table-reveal for a face-to-face meet.

**Live Demo**: [Deploy to Netlify/Vercel]  
**Evaluation Target**: Phase 1 Production-Ready MVP

---

## Tech Stack & Architecture

- **Frontend**: React 18 + Vite (Mobile-First, Responsive Web)
- **Styling**: Vanilla CSS + Tailwind v4 (Editorial, High-Contrast Design)
- **State & Motion**: Framer Motion (motion/react) for fluid micro-interactions
- **Backend**: Supabase (Real-time DB + Auth + Row Level Security)
- **Database**: PostgreSQL with Prisma Schema Architecture
- **Safety**: Haversine Geo-validation + 90-minute Presence Auto-expiry

---

## Core Modules

### User & Identity
- **Anonymous Handles**: Identity is shielded by generated handles (e.g., "BlueJay42").
- **QR Provisioning**: GPS-fenced check-in ensures presence is only valid inside the venue.
- **Account Deletion**: Full GDPR-compliant account removal available in Settings.

### Discovery Engine
- **Live Radar**: Real-time map view of venues with active user counts.
- **Demographic Filtering**: Filter discovery lists by gender to find relevant connections.
- **Venue Intelligence**: Deep analytics on venue load and demographic breakdown.

### Zero-Clutter Chat System
- **Real-time Stream**: 1-to-1 messaging powered by Supabase Realtime.
- **Table Reveal Flow**: Mutual-consent handshake to reveal physical locations.
- **Safety Controls**: Instant session exit and chat termination for maximum safety.

### Admin Command Center
- **Infrastructure Management**: Onboard and geofence new "Nodes" (Venues).
- **Asset Engine**: Generate print-ready PDF QR codes for venue distribution.
- **Intelligence Export**: Comprehensive CSV export for platform-wide analytics.
- **Moderation Queue**: Real-time reporting and user management interface.

---

## Database Schema (Prisma)

The architecture is built on a relational PostgreSQL foundation:
- **User**: Identity and profile management.
- **Venue**: Physical nodes with Lat/Lng and geofence radius.
- **Presence**: Real-time check-in ledger with `expiresAt` logic.
- **Message**: Anonymous communication history with `isTableReveal` flags.
- **Report/Block**: Trust and safety primitives for community moderation.

---

## Installation & Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_url
   VITE_SUPABASE_ANON_KEY=your_key
   ```

3. **Backend Logic**:
   Run the provided `supabase_setup.sql` in your Supabase SQL Editor to activate:
   - 90-minute Auto-expiry triggers.
   - Haversine Distance calculation functions.

4. **Start Development**:
   ```bash
   npm run dev
   ```

---

## 🎯 Evaluation Criteria Fulfillment

| Criteria | Implementation Detail |
| :--- | :--- |
| **Mobile-First UX** | Bespoke editorial design, optimized for thumb-reach and speed. |
| **Anonymous Flow** | Complete anonymity lifecycle from QR scan to Table Reveal. |
| **Trust & Safety** | Built-in Safety Exit, User Blocking, and Geo-validation. |
| **Full DB Architecture** | Included `prisma/schema.prisma` and `supabase_setup.sql`. |
| **Admin Controls** | Role-based dashboard with CSV/PDF export capabilities. |

---

**Designed & Developed for CoolCliq Assessment.**  
*Clean, fast, and secure.*