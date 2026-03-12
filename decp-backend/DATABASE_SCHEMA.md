# DECP Backend Database Schema

The project uses PostgreSQL with Flyway migration `V1__init.sql`.

Main tables:
- users
- profiles
- posts, post_likes, comments
- jobs, job_applications
- events, event_rsvps
- research_projects, research_members
- conversations, conversation_participants, messages
- notifications

The schema is normalized for clear module boundaries while remaining simple enough for a student MVP.
