SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 犬種の流し込み
INSERT IGNORE INTO breeds (name) VALUES 
('トイプードル'), ('チワワ'), ('柴犬'), ('ミニチュアダックスフンド'), 
('ポメラニアン'), ('ミニチュアシュナウザー'), ('ヨークシャーテリア'), 
('シー・ズー'), ('フレンチブルドッグ'), ('マルチーズ'), 
('ゴールデンレトリバー'), ('ラブラドールレトリバー'), ('パグ'), 
('パピヨン'), ('イタリアングレーハウンド'), ('ジャックラッセルテリア'), 
('コーギー'), ('ビーグル'), ('ボーダーコリー'), ('シベリアンハスキー'), 
('秋田犬'), ('サモエド'), ('ビションフリーゼ'),('その他');

-- テスト用ユーザー（パスワードはハッシュ化された適当な値を想定）
INSERT IGNORE INTO users (account_id, account_name, email, password, profile_content) VALUES 
('dog_lover', 'いぬすき', 'test1@example.com', '$2b$10$hashed_password_here', '犬種にこだわりはありません！全部好き！'),
('shiba_taro', '柴太郎', 'test2@example.com', '$2b$10$hashed_password_here', '柴犬一筋10年です。');
