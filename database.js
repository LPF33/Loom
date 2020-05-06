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

exports.storeWhiteboard = (room, painting) => {
    return db.query(`INSERT INTO whiteboard (room, painting) VALUES ($1,$2)
                        ON CONFLICT (room)
                            DO UPDATE
                                SET painting = $2;`,
    [room, painting]);
};

exports.getWhiteboard = room => {
    return db.query('SELECT painting, width, height FROM whiteboard WHERE room = $1;',
        [room]);
};

exports.clearWhiteboard = room => {
    return db.query('DELETE FROM whiteboard WHERE room = $1;',
        [room]);
};

exports.saveSize = (room, width, height) => {
    return db.query(`INSERT INTO whiteboard (room, width, height) VALUES ($1,$2,$3)
                        ON CONFLICT (room)
                            DO UPDATE 
                                SET width = $2,
                                    height = $3 RETURNING painting;`,
    [room, width, height]);
};

exports.storeMesssages = (room, messagedraft,firstname,lastname) => {
    return db.query('INSERT INTO messages (room, messagedraft,firstname,lastname) VALUES ($1,$2,$3,$4);',
        [room, messagedraft,firstname,lastname]);
};

exports.getChatMessages = room => {
    return db.query('SELECT * FROM messages WHERE room=$1;',
        [''+room+'']);
};

exports.deleteUser = userId => {
    return db.query('DELETE FROM loomchat WHERE id=$1;',
        [userId]);
};