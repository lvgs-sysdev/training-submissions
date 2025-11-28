-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  user_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  icon_path VARCHAR(255) DEFAULT 'images/profile/default.png'
);

-- セッションテーブル
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 記事テーブル
CREATE TABLE IF NOT EXISTS articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  article_title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  genre VARCHAR(20) NOT NULL,
  thumbnail_path VARCHAR(255),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 2. イベント作成（期限切れのsessionの削除）

SET GLOBAL event_scheduler = ON;

CREATE EVENT cleanup_sessions
ON SCHEDULE EVERY 1 HOUR
DO
  DELETE FROM sessions
  WHERE created_at < (NOW() - INTERVAL 24 HOUR);

-- Users データの投入
INSERT INTO users (id, user_id, password, user_name, icon_path) VALUES
(1, 'test1', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 1', 'images/profile/author1.png'),
(2, 'test2', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 2', 'images/profile/author2.png'),
(3, 'test3', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 3', 'images/profile/author3.png'),
(4, 'test4', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 4', 'images/profile/author4.png'),
(5, 'test5', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 5', 'images/profile/author5.png'),
(6, 'test6', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 6', 'images/profile/author6.png'),
(7, 'test7', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User 7', 'images/profile/author7.png'),
(8, 'test8', '$2b$10$Mhxj/GaI1afFOreW/jHYBOQe539RE0AbLmlnvtgYxMBUyIAbTA3am', 'Test User8', 'images/profile/default.png'),
(9, 'test9', '$2b$10$5sMK/lycOPxZV21fdk7JhuqHBg8EoaA/Z0faQM26z0Bn3y3USNDJq', 'Test User9', 'images/profile/default.png'),
(10, 'test10', '$2b$10$HcaIlEvOhom.8HdkThjOIuIMqzDlvkzRM/8z27mO/KybzPBx6JobK', 'Test User10', 'images/profile/default.png'),
(11, 'test11', '$2b$10$QpyWe6itkZkf6h3dCT8Bduv3bAQ4cKmGpqXkkjaSjm1gO6Q8/FExK', 'Test User11', 'images/profile/default.png'),
(12, 'test12', '$2b$10$ou7QqjlGlBpDtGhbICs9J.KkHzL3MtwhyIihuEyfMOP2nq3kEWTcK', 'Test User12', 'images/profile/default.png'),
(13, 'test13', '$2b$10$Wo3Rvk6HawwB2bhnYUqjqu8Ed7K0eXya.quxUoqisQKW5Z.AYAALW', 'Test User13', 'images/profile/default.png')
ON DUPLICATE KEY UPDATE 
  user_id = VALUES(user_id), 
  password = VALUES(password), 
  user_name = VALUES(user_name), 
  icon_path = VALUES(icon_path);

-- Articles データの投入
INSERT INTO articles (id, article_title, genre, content, user_id, updated_at, thumbnail_path) VALUES
(1, 'The taste of Bang Embul\'s soto betawi', 'Culinary', 'Each region has its own specialty food.\nThat\'s truly one of the greatest pleasures of traveling, isn\'t it?\n\nJust the other day, I had the chance to visit Hokkaido, and of course, I indulged in the local delicacies.\nThe "Kaisen-don" (Seafood bowl) I had at a local market was simply exquisite, with flavors I\'d never experienced before.\n\nIn contrast, when I went to Fukuoka last month, it was all about "Motsunabe" (Offal hot pot).\nEating it fresh and piping hot, right where it\'s famous... that\'s an experience you can only get locally.\n\nI also recently tried "Sendai\'s Gyutan" (Beef tongue) from the Miyagi region, which I ordered online.\nWhile modern delivery makes it easy to enjoy flavors from afar, I still believe that nothing beats tasting it right where it\'s made, soaking in the local atmosphere.\n\nThis got me thinking, what defines a "specialty food"?\nIs it the local ingredients? The climate? The history and culture behind the dish?\nIt\'s probably a complex mix of all those things.\n\nI\'m planning my next trip to Kanazawa, and I\'m already researching what to eat!\nIf you have any recommendations, please let me know in the comments.', 'test1', '2025-11-27 14:46:54', 'images/articles/article-img1.png'),
(2, '週末リフレッシュ。箱根、新緑の芦ノ湖へ日帰り旅', 'Travel', '週末にふらっと、箱根まで日帰り旅行に行ってきました。\n目的は、彫刻の森美術館と、新緑の芦ノ湖です。\n\n都心からロマンスカーであっという間。この「非日常へのアクセスの良さ」が箱根の魅力ですね。\n美術館でアートに触れた後、湖畔のカフェで一息。\n\n水面に反射する木々の緑と、遠くに見える（今回は雲に隠れていましたが…）富士山のシルエット。\nただぼーっと景色を眺めているだけで、日頃の疲れが癒されていくのを感じました。\n\n特別なことをしなくても、場所を変えるだけでリフレッシュできる。\n旅の力を再確認した一日でした。', 'test2', '2024-10-22 08:15:00', 'images/articles/article-img2.png'),
(3, '水を一滴も使わない。野菜の旨味だけで作る「無水カレー」のススメ', 'Cooking', '最近、無水カレーにハマっています。 玉ねぎとトマトを大量に（本当に大量に）切って、鶏肉とキノコ類、あとは好きなスパイスを入れるだけ。\n\nポイントは、絶対に水を加えないこと。 野菜から出る水分だけで、濃厚で旨味が凝縮されたカレーが完成します。
最初は「本当に水分足りるの？」と不安になりますが、弱火で30分も煮込めば、野菜がとろとろに溶けて最高のソースになります。\n\n簡単なのに、すごく手の込んだ料理に見えるのも良いところ（笑）。 週末の作り置きに最適です。l', 'test3', '2025-11-21 18:20:16', 'images/articles/article-img3.png'),
(4, 'ベトナム・ホーチミン旅行記：現地の料理教室で生春巻きを作った話', 'Travel', '夏休みを利用して、ベトナムのホーチミンに行ってきました！
バイクの多さと街の熱気に圧倒されっぱなしの5日間。\n\n現地の料理教室に参加したのが一番の思い出です。\n市場でガイドさんと一緒に食材を選び、その場でフォーと生春巻きの作り方を習いました。\n\n新鮮なハーブの使い方や、ライスペーパーの扱い方など、本場のコツを直接学べて感動。\n自分で作った生春巻きは、格別な美味しさでした。\n旅先で「体験」するの、オススメです。', 'test4', '2024-08-11 22:00:00', 'images/articles/article-img4.png'),
(5, 'コーヒーの奥深さに触れる。清澄白河カフェ巡り', 'Cafe', '清澄白河でカフェ巡りをした日の記録。\n最近は「サードウェーブコーヒー」のお店が増えましたね。\n\n1軒目は、倉庫をリノベーションした有名店へ。\n浅煎りのエチオピアを注文。フルーティーな酸味が特徴的で、コーヒーの概念が変わる一杯でした。\n\n2軒目は、路地裏にある小さな焙煎所。\n店主さんとコーヒー豆について少しお話ししながら、深煎りのブレンドをテイクアウト。\n\n同じエリアでも、お店によって豆の個性や雰囲気が全く違うのが面白い。\n奥が深いです、コーヒーの世界。', 'test5', '2024-07-20 06:45:00', 'images/articles/article-img5.png'),
(6, 'ミニマリストの旅行術：バックパック1つで旅に出るためのパッキング', 'Travel', '来月の旅行に向けて、パッキングの準備を始めました。\n昔はあれもこれもと詰め込みすぎて、スーツケースがパンパンになるタイプでした。\n\nでも最近は「旅先で調達できるものは持っていかない」というマイルールを徹底しています。\n特に洋服は、着回しがきくシンプルなものを3日分だけ。\n\n荷物が少ないと、移動が本当に楽になります。\nフットワーク軽く動けることが、旅の満足度を上げると信じています。\n今回は、このバックパック一つで行ってきます！', 'test6', '2024-06-02 15:00:00', 'images/articles/article-img6.png'),
(7, '春の恵み。生の「たけのこ」をあく抜きから調理してみた', 'Cooking', '春になると、無性に「たけのこ」が食べたくなりませんか？\n今年は初めて、生のたけのこを買ってきて「あく抜き」から挑戦してみました。\n\n米ぬかと一緒に大きな鍋でコトコト煮ること1時間。\n手間はかかりますが、水煮とは比べ物にならないくらいの香りと食感！\n\n定番の「たけのこご飯」と「若竹煮」に。\n旬の食材を、旬の時期に、ちゃんと手間をかけて食べる。\nこれ以上の贅沢はないなと、噛み締めながら思いました。', 'test7', '2024-04-18 10:10:00', 'images/articles/article-img7.png')
ON DUPLICATE KEY UPDATE 
  article_title = VALUES(article_title), 
  genre = VALUES(genre), 
  content = VALUES(content), 
  user_id = VALUES(user_id), 
  updated_at = VALUES(updated_at), 
  thumbnail_path = VALUES(thumbnail_path);