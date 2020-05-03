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