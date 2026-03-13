-- V2: Add push notification token storage
CREATE TABLE user_push_tokens (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    platform VARCHAR(50)
);

CREATE INDEX idx_user_push_tokens_user_id ON user_push_tokens(user_id);
