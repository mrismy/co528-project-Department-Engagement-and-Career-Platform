# 🎓 DECP – Department Engagement & Career Platform

> A full-stack social and career platform connecting students, alumni, and administrators in a university department community.

[![Backend](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![Web](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![Mobile](https://img.shields.io/badge/Expo-SDK%2054-black?logo=expo)](https://expo.dev)
[![DB](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## ✨ Features

| Module | Capabilities |
|---|---|
| 🔐 **Authentication** | Register & login, JWT tokens, role-based access (Student / Alumni / Admin) |
| 📰 **Social Feed** | Create posts, upload images/videos, like, comment, delete own posts |
| 💼 **Jobs & Internships** | Alumni post opportunities, students apply with cover letter |
| 📅 **Events** | Create department events, RSVP (Yes / No / Maybe), live attendance count |
| 🔬 **Research** | Create collaboration projects, share documents, invite / join members |
| 💬 **Messaging** | Direct messages, group conversations, real-time WebSocket (STOMP) |
| 🔔 **Notifications** | In-app notifications + Expo push notifications on mobile |
| 📊 **Admin Dashboard** | Analytics overview, top posts, user deactivation, post moderation |
| 🖼 **Media Upload** | Image/video upload to server, served via `/api/media/{filename}` |

---

## 🏗 Architecture

```
decp/
├── decp-backend/          # Spring Boot 3.3 REST API (Java 17)
├── decp-web-client/       # React 18 + Vite + TypeScript
└── decp-mobile-client/    # React Native + Expo SDK 54
```

Three independently runnable clients share one backend REST API secured with JWT.

---

## 🚀 Prerequisites

| Tool | Version |
|---|---|
| Java JDK | 17+ |
| Apache Maven | 3.9+ |
| Node.js | 18+ |
| Docker Desktop | Latest (for PostgreSQL) |
| Expo Go (on phone) | Latest |

---

## ⚙️ Local Setup

### 1 - Start the Database

```bash
cd decp-backend
docker compose up -d
```

This starts a **PostgreSQL 16** container on `localhost:5432`.  
Flyway will auto-run all migrations (`V1__init.sql`, `V2__add_push_tokens.sql`) on first boot.

---

### 2 - Run the Backend API

```bash
cd decp-backend
mvn spring-boot:run
```

> API running at **http://localhost:8080**  
> Swagger UI: **http://localhost:8080/swagger-ui/index.html**

**Required environment variables** (already set in `application.yml` defaults for local dev):

| Variable | Default |
|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/decp_db` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `postgres` |
| `JWT_SECRET` | `my-super-secret-jwt-key-1234567890ab` |
| `JWT_EXPIRATION` | `86400000` (24 h) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` |

---

### 3 - Run the Web Client

```bash
cd decp-web-client
npm install
npm run dev
```

> Open **http://localhost:5173**

---

### 4 - Run the Mobile Client (Expo Go)

```bash
cd decp-mobile-client
npm install
```

**Find your machine's LAN IP:**
```bash
# Windows
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter, e.g. 192.168.1.42
```

Create / edit `decp-mobile-client/.env`:
```env
# Android Emulator
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8080

# iOS Simulator
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080

# Physical device (replace with your actual LAN IP)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.42:8080
```

Then start Expo:
```bash
npx expo start
```

Scan the QR code with **Expo Go** on your Android or iOS device.

---

### 5 - Run Tests

```bash
cd decp-backend
mvn test
```

---

## 👤 Default Admin Account

```
Email:    admin@decp.com
Password: password
```

---

## 🌐 Free Cloud Deployment (Recommended)

| Component | Service | Free Tier |
|---|---|---|
| Spring Boot backend | [Render.com](https://render.com) | 512 MB RAM |
| PostgreSQL database | [Neon.tech](https://neon.tech) | 0.5 GB |
| File storage | [Cloudflare R2](https://r2.cloudflare.com) | 10 GB |
| React web client | [Vercel](https://vercel.com) | Unlimited |
| Mobile APK | [Expo EAS Build](https://expo.dev/eas) | Free preview |

### Deploy backend to Render
```bash
# Render Build Command:
mvn clean package -DskipTests

# Render Start Command:
java -jar target/*.jar
```

Set these environment variables in the Render dashboard:
```
DB_URL             = jdbc:postgresql://<neon-host>/neondb?sslmode=require
DB_USERNAME        = <neon-user>
DB_PASSWORD        = <neon-password>
JWT_SECRET         = <32-char-secret>
CORS_ALLOWED_ORIGINS = https://<your-vercel-app>.vercel.app
```

### Deploy web client to Vercel
```bash
cd decp-web-client
# Create production env file
echo "VITE_API_BASE_URL=https://<your-render-app>.onrender.com" > .env.production
npx vercel --prod
```

### Build mobile APK
```bash
# Update .env with production backend URL
EXPO_PUBLIC_API_BASE_URL=https://<your-render-app>.onrender.com

# Build APK
eas build --platform android --profile preview
```

---

## 📁 Full Project Structure

```
decp/
├── decp-backend/
│   ├── src/main/java/com/decp/
│   │   ├── auth/              # JWT authentication & registration
│   │   ├── feed/              # Posts, likes, comments
│   │   ├── job/               # Jobs board & applications
│   │   ├── event/             # Events & RSVP
│   │   ├── research/          # Research projects & collaboration
│   │   ├── message/           # DM, group chat, WebSocket
│   │   ├── notification/      # In-app + Expo push notifications
│   │   ├── media/             # File upload & serve
│   │   ├── analytics/         # Admin analytics endpoints
│   │   ├── user/              # Profiles & push tokens
│   │   ├── security/          # JWT filter & Spring Security config
│   │   ├── enums/             # Role enum
│   │   └── common/            # BaseEntity, exceptions, SecurityUtils
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/      # V1__init.sql  V2__add_push_tokens.sql
│   └── docker-compose.yml
│
├── decp-web-client/
│   └── src/
│       ├── api/               # Axios API modules (auth, posts, jobs, ...)
│       ├── pages/             # Feed, Jobs, Events, Research, Messages, Profile, Admin
│       ├── components/        # PageHeader, StatCard, ErrorBanner, ...
│       ├── store/             # AuthContext (JWT + localStorage)
│       └── types.ts           # Shared TypeScript interfaces
│
├── decp-mobile-client/
│   └── src/
│       ├── api/               # Axios API modules + push token API
│       ├── screens/           # Feed, Jobs, Events, Research, Messages, Profile
│       ├── components/        # PostCard, Screen, UI primitives
│       ├── contexts/          # AuthContext (AsyncStorage)
│       └── navigation/        # Root stack + bottom tab navigator
│
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.3, Java 17, Spring Security, JPA, Flyway, JWT (jjwt 0.12) |
| Web | React 18, Vite 5, TypeScript, Axios, React Router |
| Mobile | React Native 0.76, Expo SDK 54, React Navigation, Axios |
| Database | PostgreSQL 16 |
| Realtime | STOMP over WebSocket (messaging) |
| Push | Expo Push Notification API |
| Container | Docker + Docker Compose |

---

## 📄 License

MIT © 2026 DECP Project Team — CO528 Applied Software Architecture
