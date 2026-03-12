# DECP Web Client

React + Vite frontend for the **Department Engagement & Career Platform (DECP)**.

## Features covered
- Authentication: login, register, current user
- Profile view and update
- Feed posts with likes and comments
- Jobs and job applications
- Events and RSVP
- Research projects and join requests
- Messaging and conversations
- Notifications
- Admin actions and analytics dashboard

## Stack
- React
- TypeScript
- React Router
- Axios
- Plain CSS

## Setup
1. Copy `.env.example` to `.env`
2. Set your backend URL:
   - `VITE_API_BASE_URL=http://localhost:8080`
3. Install dependencies:
   - `npm install`
4. Run:
   - `npm run dev`

## Notes
- This client is aligned to the Spring Boot backend endpoints from the completed backend package.
- Since the backend currently uses URL fields for media and resume uploads, this frontend uses text inputs for file/media URLs instead of direct upload widgets.
- Admin actions are available only for users with the `ADMIN` role.

## Main routes
- `/login`
- `/register`
- `/`
- `/profile`
- `/jobs`
- `/events`
- `/research`
- `/messages`
- `/notifications`
- `/admin`
