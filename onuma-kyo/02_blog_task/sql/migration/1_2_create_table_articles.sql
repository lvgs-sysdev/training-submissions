CREATE TABLE articles(
    id INT NOT NULL AUTO_INCREMENT,
    article_title VARCHAR(255) NOT NULL,
    content VARCHAR(10000) NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) 
) engine = InnoDB;