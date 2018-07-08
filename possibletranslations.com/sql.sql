
DROP TABLE if exists account_holder;


CREATE TABLE flask_db.words (
  word_id BIGINT AUTO_INCREMENT,
  word VARCHAR(5000) NULL,
  lang_1 VARCHAR(2) NULL,
  lang_2 VARCHAR(2) NULL,
  lang_3 VARCHAR(2) NULL,
  translation_1 VARCHAR(5000) NULL,
  translation_2 VARCHAR(5000) NULL,
  translation_3 VARCHAR(5000) NULL,
  PRIMARY KEY (word_id));
