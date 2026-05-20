CREATE USER app_user WITH PASSWORD '@1oGinYQEad';

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(30) UNIQUE NOT NULL,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE ROLE users_readwrite;
GRANT CONNECT ON DATABASE masterdb TO users_readwrite;
GRANT USAGE ON SCHEMA public TO users_readwrite;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO users_readwrite;
GRANT SELECT, INSERT ON TABLE users TO users_readwrite;

GRANT users_readwrite TO app_user;

