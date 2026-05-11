CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(10000) NOT NULL,
    email VARCHAR(255) NOT NULL,
    sns_link VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    PRIMARY KEY (id)
) engine = InnoDB;