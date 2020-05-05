var spicedPg = require("spiced-pg");
var dbUrl = process.env.DATABASE_URL || "postgres:lars:lars@localhost:5432/loom";
var db = spicedPg(dbUrl);

exports.insertChatUser = (firstname,lastname,room) => {
    return db.query('INSERT INTO loomchat (firstname, lastname, room) VALUES ($1,$2,$3) RETURNING id;',
        [firstname,lastname,room]);
};

exports.getUser = id => {
    return db.query('SELECT * FROM loomchat WHERE id=$1;',
        [id]);
};

exports.getChatUsers = room => {
    return db.query('SELECT * FROM loomchat WHERE room = $1;',
        [''+room+'']);
};

exports.storeSocketId = (userId, socketId) => {
    return db.query('INSERT INTO sockets (user_id, socket_id) VALUES ($1,$2);',
        [userId, socketId]);
};

exports.storeMesssages = (room, messagedraft,firstname,lastname) => {
    return db.query('INSERT INTO messages (room, messagedraft,firstname,lastname) VALUES ($1,$2,$3,$4);',
        [room, messagedraft,firstname,lastname]);
};

exports.getChatMessages = room => {
    return db.query('SELECT * FROM messages WHERE room=$1;',
        [''+room+'']);
};