CREATE USER evently_user WITH PASSWORD 'evently_123_';
CREATE USER evently_admin WITH PASSWORD 'evently_admin_123_';
CREATE USER evently_dev WITH PASSWORD 'evently_dev_123_';

CREATE DATABASE evently OWNER evently_admin;


-- dev
ALTER USER evently_dev WITH SUPERUSER CREATEDB;

-- admin
GRANT ALL PRIVILEGES ON SCHEMA public TO evently_admin;

-- user 
\c evently evently_admin

GRANT CONNECT ON DATABASE evently TO evently_user;

GRANT USAGE ON SCHEMA public TO evently_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO evently_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO evently_user;
