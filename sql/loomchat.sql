DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS sockets;
DROP TABLE IF EXISTS loomchat;

CREATE TABLE loomchat (
    id SERIAL PRIMARY KEY,
    room VARCHAR NOT NULL,
    firstname VARCHAR(200) NOT NULL,
    lastname VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sockets (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES loomchat(id) NOT NULL,
    socket_id VARCHAR NOT NULL,
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

