CREATE TABLE users(
    id bigint(20) NOT NULL AUTO_INCREMENT,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    picture_url varchar(255),
    about varchar(255),
    sub varchar(255),
    is_record_history tinyint(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
);