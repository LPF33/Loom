const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const csurf = require("csurf");
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));

const cookieSessionMiddleware = cookieSession({
    secret: "Loom, chat & paint!",
    maxAge: 1000 * 60 * 60 * 24
});
app.use( cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

io.on("connection", function(socket){        
    console.log(socket.id);

    socket.on("chatMessage", data => {       
        
        io.sockets.emit("chatMessage",{
            data
        });
    });
});

server.listen(process.env.PORT || 8080);