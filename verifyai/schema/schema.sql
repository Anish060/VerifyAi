CREATE TABLE users (
    user_id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(255)  DEFAULT NULL,
    passwordd VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);
INSERT INTO users ( username, passwordd) VALUES
( 'Anish@gmail.com', '123'),
('Suresh@gmail.com', '1234');
CREATE TABLE verificationrecords (
    record_id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11) NOT NULL,
    file_name VARCHAR(255)  NOT NULL,
    upload_date DATE NOT NULL,
    status VARCHAR(50)  NOT NULL,
    ai_score INT(11) NOT NULL,
    human_score INT(11) DEFAULT NULL,
    deepfake_score INT(11) DEFAULT NULL,
    analysis_details TEXT  DEFAULT NULL,
    summary VARCHAR(500)  DEFAULT NULL,
    detailedExplanation TEXT  DEFAULT NULL,
    metadataScore INT(11) DEFAULT NULL,
    linguisticScore INT(11) DEFAULT NULL,
    pixelInconsistencyScore INT(11) DEFAULT NULL,
    sourceTokens TEXT DEFAULT NULL,
    PRIMARY KEY (record_id),
    KEY user_id (user_id) -- This is a common practice for foreign keys or frequently searched columns
);
