-- 既存のテーブルがある場合は削除
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS artists;
DROP TABLE IF EXISTS users;

-- 文字コード設定（日本語や絵文字対応のため）
SET NAMES utf8mb4;

-- 1. Users テーブル
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pic_path VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Artists テーブル
CREATE TABLE artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_id VARCHAR(50) NOT NULL,
    artist_name VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tracks テーブル
CREATE TABLE tracks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_id VARCHAR(50) NOT NULL,
    artist_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Posts テーブル
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT,
    track_id INT NOT NULL,
    show_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Likes テーブル
CREATE TABLE likes (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- データの投入

-- --------------------------------------------------------
-- 1. Users テーブル (依存なし)
-- --------------------------------------------------------
INSERT INTO users (id, user_name, email, password, pic_path, created_at, updated_at) VALUES
(1, 'TestUser', 'test@example.com', '$2b$10$Sv7CXHOWSKuA3CPYywupL.EmnNBZ2dEYjdHVytt5RjwOJ5QHpW5BK', NULL, '2025-12-03 12:16:34', '2025-12-25 12:22:40'),
(13, 'TestUser3', 'test3@example.com', '$2b$10$Sv7CXHOWSKuA3CPYywupL.EmnNBZ2dEYjdHVytt5RjwOJ5QHpW5BK', '/uploads/b8ffce03-b32e-4f1e-94ff-ab2841d7835e.jpg', '2025-12-18 17:55:46', '2025-12-18 17:55:46'),
(15, 'TestUser2', 'test2@example.com', '$2b$10$XMkkg12ecp9HFlj0ixpmy.gPjMWINxX7NEfdNLUETMHH5tQfiJY4G', '/uploads/5aa23c82-807d-4f7f-97b9-286b4cc0d608.png', '2025-12-26 19:13:23', '2025-12-26 19:13:23'),
(16, 'TestUserTestUserTestUserTestUs', 'test4@example.com', '$2b$10$f8wny9XfBmTVb2PA8Nszg.RQkpfeBohCzj9IN4yQD84rr2ONlRVKm', '/uploads/3c8a76ab-ce6e-49c9-aaed-a536de3c0114.png', '2025-12-26 19:19:32', '2025-12-26 19:19:32');

-- --------------------------------------------------------
-- 2. Artists テーブル (依存なし)
-- --------------------------------------------------------
INSERT INTO artists (id, spotify_id, artist_name, created_at) VALUES
(2, '4Z8W4fKeB5YxbusRsdQVPb', 'Radiohead', '2025-12-05 18:48:13'),
(4, '2DaxqgrOhkeH0fpeiQq2f4', 'Oasis', '2025-12-05 20:20:07'),
(5, '7MhMgCo0Bl0Kukl93PZbYS', 'Blur', '2025-12-05 20:21:51'),
(6, '5kjGRHClVacSyllOUqU1S0', 'SPITZ', '2025-12-05 20:43:06'),
(8, '0WPY9nnBy01s5QOt4o4oQX', 'Ride', '2025-12-09 15:51:07'),
(9, '3iyF2P8al32bYI6e3YF56K', 'Homecomings', '2025-12-12 20:09:03'),
(10, '19RZk1SGPSL1DChYdDQYl1', 'Laura day romance', '2025-12-15 17:14:00'),
(11, '0hSFeqPehe7FtCNWuQ6Bsy', 'BUMP OF CHICKEN', '2025-12-15 17:14:51'),
(12, '3PP6ghmOlDl2jaKaH0avUN', 'Black Country, New Road', '2025-12-24 12:22:48'),
(13, '7p2S6p9yYGhJTtbTQFnsYZ', 'Galileo Galilei', '2025-12-24 12:35:02'),
(14, '6S8w5rLsEwjN21jQeRES0n', 'Hitsujibungaku', '2025-12-26 19:14:23'),
(15, '0epOFNiUfyON9EYx7Tpr6V', 'The Strokes', '2025-12-26 19:15:31'),
(16, '0YrtvWJMgSdVrk3SfNjTbx', 'Death Cab for Cutie', '2025-12-26 19:20:38');

-- --------------------------------------------------------
-- 3. Tracks テーブル (Artistsに依存)
-- --------------------------------------------------------
INSERT INTO tracks (id, spotify_id, title, created_at, artist_id) VALUES
(3, '73CKjW3vsUXRpy3NnX4H7F', 'Fake Plastic Trees', '2025-12-05 19:56:26', 2),
(4, '2kx1ibQmztyF7acpxjY4Qf', 'Champagne Supernova - Remastered', '2025-12-05 20:20:07', 4),
(5, '7FSzJQV6thyoQptFCUTV9c', 'Parklife - 2012 Remaster', '2025-12-05 20:21:51', 5),
(6, '0sVnyL71jTOuMt9TZ59bws', 'ロビンソン', '2025-12-05 20:43:06', 6),
(8, '3P2aSkjcbUYbcYr13EFE8n', '空も飛べるはず', '2025-12-05 20:44:57', 6),
(9, '6LgJvl0Xdtc73RJ1mmpotq', 'Paranoid Android', '2025-12-08 13:17:22', 2),
(10, '37JISltgxizbDAyNEEqkTY', 'Planet Telex', '2025-12-08 17:17:42', 2),
(11, '4xkcGfpM9RwB4IiQ7yx2dB', '2 + 2 = 5', '2025-12-08 17:25:33', 2),
(12, '1pvFjb271biKERTR0BdBxk', 'Live Forever - Remastered', '2025-12-08 19:02:02', 4),
(13, '58AWfmYbSeMywgJtXkey7Q', 'Vapour Trail - 2001 Remaster', '2025-12-09 15:51:07', 8),
(14, '3pd4Qxuu12CipI2v6Yi6EH', 'angel near you', '2025-12-12 20:09:03', 9),
(15, '6MCPPNORhWEPZ9O9ui4sW3', 'ランニング・イン・ザ・ダーク | running in the dark', '2025-12-15 17:14:00', 10),
(16, '3cQWusqyt053W56L3XBiIs', 'sailing day', '2025-12-15 17:14:51', 11),
(17, '56Vk4WrIrTr3Jg7hReNZVb', 'Happy Birthday', '2025-12-24 12:22:48', 12),
(18, '0tckZ6TW8nl3xCGHXSPHiu', '星を落とす', '2025-12-24 12:35:02', 13),
(19, '10nyNJ6zNy2YVYLrcwLccB', 'No Surprises', '2025-12-24 16:59:11', 2),
(20, '7quF116OAxlN2cvcjNit5Z', 'doll', '2025-12-26 19:14:23', 14),
(21, '5ruzrDWcT0vuJIOMW7gMnW', 'The Adults Are Talking', '2025-12-26 19:15:31', 15),
(22, '4nPNsnv4QEiIzihzCU5zHH', 'The New Year', '2025-12-26 19:20:38', 16);

-- --------------------------------------------------------
-- 4. Posts テーブル (Users, Tracksに依存)
-- --------------------------------------------------------
INSERT INTO posts (id, user_id, content, show_date, created_at, track_id) VALUES
(4, 1, 'testtesttesttest', '2025-12-03', '2025-12-05 18:10:03', 15),
(6, 1, 'TestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTestTest', '2025-12-02', '2025-12-05 19:56:26', 3),
(7, 1, 'Oasisのライブに行きました。', '2025-10-25', '2025-12-05 20:20:07', 4),
(8, 1, 'Blurのライブに行きました。', '2023-08-26', '2025-12-05 20:21:51', 5),
(11, 1, 'TestTestTestTestTestTestTestTestTestTest', '2025-12-08', '2025-12-05 20:44:57', 8),
(13, 1, 'Radioheadのライブに行きました', '2025-12-02', '2025-12-08 13:17:22', 9),
(14, 1, 'Radioheadのライブに行きました', '2025-12-02', '2025-12-08 17:17:42', 10),
(15, 1, 'Radioheadのライブに行きました', '2025-11-26', '2025-12-08 17:25:33', 11),
(16, 1, 'Oasisのライブに行きました。', '2025-12-01', '2025-12-08 19:02:02', 12),
(17, 1, 'Rideのライブに行きました', '2025-12-01', '2025-12-08 19:03:57', 13),
(18, 1, 'Radioheadのライブに行きました', '2025-12-03', '2025-12-09 12:54:33', 10),
(19, 1, 'Radioheadのライブに行きました。', '2025-12-11', '2025-12-12 17:21:41', 9),
(20, 1, 'test testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest testtest test', '2025-12-10', '2025-12-12 20:09:03', 14),
(21, 1, 'ROPPONGI EX THEATERで観てきました。', '2025-12-10', '2025-12-24 12:22:48', 17),
(22, 13, 'Zepp DiverCityで観てきました', '2025-11-26', '2025-12-24 12:35:02', 18),
(23, 1, 'oasis', '2025-12-24', '2025-12-24 16:55:32', 12),
(24, 1, 'Radiohead', '2025-12-24', '2025-12-24 16:59:11', 19),
(25, 15, '羊文学のライブに行きました。', '2025-12-25', '2025-12-26 19:14:23', 20),
(26, 15, 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest', '2025-12-09', '2025-12-26 19:15:31', 21),
(27, 16, 'テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト', '2026-01-01', '2025-12-26 19:20:38', 22);

-- --------------------------------------------------------
-- 5. Likes テーブル (Users, Postsに依存)
-- --------------------------------------------------------
INSERT INTO likes (user_id, post_id, created_at) VALUES
(1, 4, '2025-12-24 16:55:02'),
(1, 6, '2025-12-24 16:58:48'),
(1, 19, '2025-12-12 20:07:23'),
(1, 20, '2025-12-24 11:18:24'),
(1, 22, '2025-12-24 12:36:00'),
(13, 6, '2025-12-25 20:42:58'),
(13, 18, '2025-12-24 12:35:29'),
(13, 19, '2025-12-24 12:19:48'),
(13, 20, '2025-12-24 11:25:27'),
(13, 21, '2025-12-24 12:35:09'),
(13, 22, '2025-12-24 12:35:13'),
(15, 19, '2025-12-26 19:14:35'),
(15, 20, '2025-12-26 19:14:32'),
(15, 22, '2025-12-26 19:14:29'),
(15, 24, '2025-12-26 19:14:27'),
(15, 25, '2025-12-26 19:14:46'),
(16, 4, '2025-12-26 19:22:11'),
(16, 6, '2025-12-26 19:22:12'),
(16, 8, '2025-12-26 19:21:23'),
(16, 14, '2025-12-26 19:21:21'),
(16, 20, '2025-12-26 19:21:18'),
(16, 26, '2025-12-26 19:21:16'),
(16, 27, '2025-12-26 19:21:11');
