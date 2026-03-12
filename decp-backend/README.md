# DECP Backend Complete MVP

This is the completed backend MVP for the CO528 mini project.

## Included modules
- Authentication and JWT security
- User/profile management
- Posts, likes, comments
- Jobs and applications
- Events and RSVP
- Research collaboration
- Messaging
- Notifications
- Admin moderation
- Analytics overview

## Run locally
1. Start PostgreSQL (or use `docker-compose up -d`).
2. Create database `decp_db` if needed.
3. Set environment variables if you want custom values:
   - `DB_URL`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`
   - `CORS_ALLOWED_ORIGINS`
4. Run the Spring Boot app.

## API docs
After starting the app, open:
- `/swagger-ui/index.html`

## Default notes
- Flyway initializes the schema.
- JPA validates the schema at startup.
- `/api/auth/register` and `/api/auth/login` are public.
- `/api/auth/me` returns the current logged-in user.

## Suggested next step
Use this backend for the React web client and React Native mobile client.
