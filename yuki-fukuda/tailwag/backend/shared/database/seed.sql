-- 犬種の流し込み
INSERT IGNORE INTO breeds (name) VALUES 
('ゴールデンレトリバー'), ('柴犬'), ('トイプードル'), ('チワワ'), ('ポメラニアン'), ('フレンチブルドッグ');

-- テスト用ユーザー（パスワードはハッシュ化された適当な値を想定）
INSERT IGNORE INTO users (account_id, account_name, email, password, profile_content) VALUES 
('dog_lover', 'いぬすき', 'test1@example.com', '$2b$10$hashed_password_here', '犬種にこだわりはありません！全部好き！'),
('shiba_taro', '柴太郎', 'test2@example.com', '$2b$10$hashed_password_here', '柴犬一筋10年です。');
