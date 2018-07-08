DROP TABLE if exists words;

CREATE TABLE words (
    word_id BIGINT AUTO_INCREMENT,
    word VARCHAR(5000) NOT NULL,
    lang_1 VARCHAR(2) NOT NULL,
    lang_2 VARCHAR(2),
    lang_3 VARCHAR(2),
    translation_1 VARCHAR(5000) NOT NULL,
    translation_2 VARCHAR(5000),
    translation_3 VARCHAR(5000),
    PRIMARY KEY (word_id)
  );
