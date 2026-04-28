-- テーブル設計
-- ユーザーの基本設定
CREATE TABLE users(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(20) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password varchar(255) NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- ルール
    UNIQUE KEY (user_id),
    UNIQUE KEY (email)
   
);
-- 記事
CREATE TABLE articles(
    article_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    article_title VARCHAR(255) NOT NULL,
    content TEXT not NULL,
    id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- ルール
    FOREIGN KEY (id) REFERENCES  users(id) ON DELETE CASCADE
);
-- SNS一覧
CREATE TABLE sns_types(
    sns_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    snsname VARCHAR(20),
    -- ルール
    UNIQUE KEY(snsname)
);
-- ユーザーのSNS
CREATE TABLE sns_links(
    sns_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id INT UNSIGNED NOT NULL,
    sns_type_id INT UNSIGNED NOT NULL,
    sns_url VARCHAR(255) NOT NULL,
    -- ルール
    UNIQUE KEY unique_user_sns (id, sns_type_id),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (sns_type_id) REFERENCES sns_types(sns_type_id)
);
-- タグ一覧
CREATE TABLE tag_types(
    tag_type_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tagname VARCHAR(20),
    -- ルール
    UNIQUE KEY(tagname)
);
-- 記事のタグ
CREATE TABLE article_tags(
    tag_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    article_id  INT UNSIGNED NOT NULL,
    tag_type_id INT UNSIGNED NOT NULL,
    -- ルール
    UNIQUE KEY unique_article_tag(article_id, tag_type_id),
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_type_id) REFERENCES tag_types(tag_type_id)
);
--記事の画像
CREATE TABLE article_images (
    image_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    article_id INT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_article_image
    FOREIGN KEY (article_id) REFERENCES articles (article_id)
    ON DELETE CASCADE
);



