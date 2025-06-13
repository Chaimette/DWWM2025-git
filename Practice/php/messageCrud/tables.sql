CREATE DATABASE IF NOT EXISTS blog_messages;
USE blog_messages;

-- Privileges table
CREATE TABLE IF NOT EXISTS privilege (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    id_privilege INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_privilege) REFERENCES privilege(id)
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    id_category INT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_category) REFERENCES category(id)
);

-- Insert privileges
INSERT INTO privilege (name) VALUES ('USER'), ('ADMIN');

-- Insert categories
INSERT INTO category (name) VALUES ('Daily Life'), ('Tips and Hacks'), ('Spamming'), ('AITA');

-- Insert users (password is "password" hashed)
INSERT INTO users (username, email, password, id_privilege) VALUES
    ('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1),
    ('MichaelScott', 'michael.scott@dundermifflin.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2),
    ('SandorClegane', 'test2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1);

-- Insert messages
INSERT INTO messages (user_id, id_category, title, content) VALUES
    (1, 1, 'Bienvenue', 'Ceci est mon premier message sur ce blog!'),
    (1, 2, 'More content', 'Voici un autre message avec plus de contenu, mais pas vraiment car je ne suis pas inspirée.'),
    (1, 2, 'I\'m a French soldier', 'Your mother was a hamster, and your father smelt of elderberries!'),
    (2, 4, 'Fuck my brother', 'Calm down Cersei, I just mean I hate him'),
    (2, 3, 'Fighting tips', 'Someone give me tips to beat one beast of a woman, cause the cunt beat my ass like it was nothin\'');