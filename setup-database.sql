-- Gestion des Astreintes - Database Setup Script
-- Run this in MySQL Workbench or phpMyAdmin

-- Create Database
CREATE DATABASE IF NOT EXISTS gestion_astreintes 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Use the database
USE gestion_astreintes;

-- Create User (Optional - if you want a dedicated user)
CREATE USER IF NOT EXISTS 'gestion_user'@'localhost' IDENTIFIED BY 'gestion_password';
GRANT ALL PRIVILEGES ON gestion_astreintes.* TO 'gestion_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SELECT 'Database created successfully!' as Status;
SHOW DATABASES LIKE 'gestion%';
