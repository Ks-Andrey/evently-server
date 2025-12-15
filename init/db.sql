CREATE USER evently_user WITH PASSWORD 'evently_123_';
CREATE USER evently_admin WITH PASSWORD 'evently_admin_123_';
CREATE USER evently_dev WITH PASSWORD 'evently_dev_123_';

CREATE DATABASE evently OWNER evently_admin;

-- dev
ALTER USER evently_dev WITH SUPERUSER CREATEDB;

-- admin
GRANT ALL PRIVILEGES ON SCHEMA public TO evently_admin;

-- Подключаемся к базе evently и настраиваем права для user
\c evently

GRANT CONNECT ON DATABASE evently TO evently_user;

GRANT USAGE ON SCHEMA public TO evently_user;

-- Примечание: Права на таблицы будут установлены после создания таблиц через Prisma миграции
-- Эти права будут применены автоматически благодаря ALTER DEFAULT PRIVILEGES

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO evently_user;
