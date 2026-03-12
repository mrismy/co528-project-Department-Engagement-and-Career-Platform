# DECP Mobile Client

React Native / Expo mobile app for the DECP mini project.

## Included screens
- Login / Register
- Feed
- Jobs & applications
- Events & RSVP
- Research collaboration
- Messaging
- Notifications
- Profile
- Admin analytics

## Setup
1. Install Node.js and Expo CLI requirements.
2. Copy `.env.example` to `.env` and update the backend URL.
3. Run:
   - `npm install`
   - `npm start`

## Backend URL notes
- Android emulator: `http://10.0.2.2:8080`
- iOS simulator: `http://localhost:8080`
- Real device: use your PC IP, for example `http://192.168.1.10:8080`

## Expected backend endpoints
- `/api/auth/*`
- `/api/users/*`
- `/api/posts/*`
- `/api/jobs/*`
- `/api/events/*`
- `/api/research-projects/*`
- `/api/conversations/*`
- `/api/notifications/*`
- `/api/admin/analytics/overview`

## Notes
This is a complete mobile MVP client aligned with the backend and web client structure. Media upload, push notifications, and real-time sockets can be added as the next enhancement phase.
