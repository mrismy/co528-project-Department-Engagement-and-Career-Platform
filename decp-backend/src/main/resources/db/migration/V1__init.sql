CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE profiles (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id),
    profile_image_url VARCHAR(255),
    bio VARCHAR(1000),
    department VARCHAR(255),
    batch VARCHAR(255),
    graduation_year INTEGER,
    current_company VARCHAR(255),
    job_title VARCHAR(255),
    skills VARCHAR(1000),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255)
);

CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    content VARCHAR(3000),
    media_url VARCHAR(255),
    media_type VARCHAR(50),
    shared_post_id BIGINT REFERENCES posts(id)
);

CREATE TABLE post_likes (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT uk_post_likes_post_user UNIQUE (post_id, user_id)
);

CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    post_id BIGINT NOT NULL REFERENCES posts(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    content VARCHAR(1000) NOT NULL
);

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    posted_by BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    company VARCHAR(255),
    description VARCHAR(3000),
    location VARCHAR(255),
    type VARCHAR(255),
    deadline DATE
);

CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    applicant_id BIGINT NOT NULL REFERENCES users(id),
    resume_url VARCHAR(255),
    cover_letter VARCHAR(2000),
    status VARCHAR(50),
    CONSTRAINT uk_job_application UNIQUE (job_id, applicant_id)
);

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    description VARCHAR(3000),
    venue VARCHAR(255),
    event_date TIMESTAMP,
    event_type VARCHAR(255),
    banner_url VARCHAR(255)
);

CREATE TABLE event_rsvps (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    event_id BIGINT NOT NULL REFERENCES events(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    status VARCHAR(50),
    CONSTRAINT uk_event_rsvp UNIQUE (event_id, user_id)
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(255),
    message VARCHAR(1000),
    reference_id BIGINT,
    read_status BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE research_projects (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    description VARCHAR(3000),
    document_url VARCHAR(255),
    required_skills VARCHAR(1000)
);

CREATE TABLE research_members (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    project_id BIGINT NOT NULL REFERENCES research_projects(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(255),
    status VARCHAR(255),
    CONSTRAINT uk_research_member UNIQUE (project_id, user_id)
);

CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    type VARCHAR(50),
    title VARCHAR(255)
);

CREATE TABLE conversation_participants (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    CONSTRAINT uk_conversation_participant UNIQUE (conversation_id, user_id)
);

CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id),
    sender_id BIGINT NOT NULL REFERENCES users(id),
    content VARCHAR(3000) NOT NULL,
    read_status BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_research_project_created_by ON research_projects(created_by);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
