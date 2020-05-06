DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS whiteboard;
DROP TABLE IF EXISTS loomchat;

CREATE TABLE loomchat (
    id SERIAL PRIMARY KEY,
    room VARCHAR NOT NULL,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE whiteboard (
    id SERIAL PRIMARY KEY,
    room VARCHAR NOT NULL UNIQUE,
    painting TEXT,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Create TABLE messages (
    id SERIAL PRIMARY KEY,
    room VARCHAR NOT NULL,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    messagedraft VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

