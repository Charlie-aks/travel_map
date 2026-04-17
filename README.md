# The Coastal Edit: Phan Thiet Travel Map 🌊

A premium, interactive digital concierge for discovering and curating the best locations in Phan Thiet, Vietnam. Built with modern web technologies to deliver a buttery-smooth, enterprise-grade user experience.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-16+-black.svg?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.45-yellow.svg)

## 📖 Vision & Scope

The goal of this project is to create an aesthetically stunning, highly interactive mapping tool that goes beyond the standard Google Maps list. It focuses heavily on:
1. **Curated Experience**: Locations are community-driven but admin-moderated.
2. **Coastal Modern Design**: A unified design language consisting of deep ocean blues, vibrant accents, glassmorphism, and fluid animations.
3. **Engineering Excellence**: Utilizing state-of-the-art tooling (React 19, Server Actions, Drizzle ORM).

## ✨ Key Features

- **Interactive Map**: Built over React Leaflet with custom animated markers and route drawing capabilities.
- **Command Palette (`CMD+K`)**: Global quick-search for rapid navigation across the app—a standard in pro-level tools.
- **Moderation Queue CMS**: Dedicated Admin dashboard to review, approve, and analyze community contributions.
- **Live Analytics**: Visualized visitor and contribution data via Recharts. 

## 🏗️ Architecture

The app follows a modern full-stack Next.js architecture leveraging Server Actions for mutations and Server Components for data fetching.

```mermaid
graph TD
    Client[Client UI / React 19] -->|Server Actions| SA[Next.js Server Actions]
    Client -->|API Routes| API[Next.js App Router]
    
    SA --> Drizzle[Drizzle ORM]
    API --> Drizzle
    
    Drizzle --> DB[(PostgreSQL Database)]
    
    subgraph UI Layer
        Framer[Framer Motion]
        CMDK[Command Palette]
        Leaflet[React Leaflet]
    end
    
    Client -.-> UI Layer
```

## 🛠️ Tech Stack Justification

- **Next.js 16 (App Router)**: Provides optimal rendering strategies (RSC, SSR) out of the box, reducing client JS payload.
- **React 19**: Utilizing the bleeding edge of React for better concurrent rendering and action handling.
- **Drizzle ORM**: Type-safe database interactions with zero-dependency SQL generation. Supremely fast and developer-friendly.
- **Framer Motion**: Adds the crucial "premium feel" through physics-based animations (staggered lists, hover states).
- **Tailwind CSS v4 & Shadcn UI**: Extremely rapid styling with a highly customizable token-based design system.

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 20+ installed.

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (`.env.local`):
   ```env
   DATABASE_URL="postgresql://user:password@host:port/db"
   ```
4. Run database migrations:
   ```bash
   npx drizzle-kit push
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) and press `CMD/CTRL + K` to start exploring!

---
*Developed with a passion for clean code and beautiful interfaces.*
