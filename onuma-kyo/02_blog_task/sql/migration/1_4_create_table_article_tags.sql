CREATE TABLE article_tags(
    id INT NOT NULL AUTO_INCREMENT,
    tag_id INT NOT NULL,
    article_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (tag_id) REFERENCES tags(id),
    FOREIGN KEY (article_id) REFERENCES articles(id) 
) engine = InnoDB;