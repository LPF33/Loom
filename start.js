const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const csurf = require("csurf");

const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const database = require("./database");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, csrf-token");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(bodyParser.urlencoded({extended: false}));

const cookieSessionMiddleware = cookieSession({
    secret: "Loom, chat & paint!",
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "none",
    secure : false
});
app.use( cookieSessionMiddleware);

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.use(function(socket, next) {
    socket.request.connection.encrypted = false;    
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});

app.get("/randomCode", (request, response) => {
    const secretCode = cryptoRandomString({
        length: 8
    });

    response.json({
        secretCode
    });
});

app.post("/invitationChat", async (request, response) => {
    const {firstname, lastname, mainEmail, emails, link1} = request.body;

    if(!firstname || !lastname || !mainEmail || !emails[0]){
        response.json({
            success: false,
            empty: true
        });
    } else {   
        let check; 
        try {
            await ses.sendMeInviteMail(mainEmail,`${firstname} ${lastname}`,link1); 
            check = true;
        } catch(error){
            check = false;
            response.json({
                success: false,
                error: "Please check again your own email address!"
            });
        }
        if(check){
            try {
                for(let email of emails){
                    if(email){
                        await ses.sendInviteMail(email,`${firstname} ${lastname}`,link1);
                    }                
                }            
                response.json({
                    success: true
                });
            } catch(error){
                response.json({
                    success: false,
                    error: "Please check again your friends email addresses!"
                });
            } 
        }
        
    }
       
    
});

app.post("/invitationBattleship", async (request, response) => {
    const {firstname, mainEmail, friendEmail, link2} = request.body;

    if(!firstname || !mainEmail || !friendEmail){
        response.json({
            success: false,
            empty: true
        });
    } else {   
        let check; 
        try {
            await ses.sendMeBattleshipMail(mainEmail,firstname,link2); 
            check = true;
        } catch(error){
            check = false;
            response.json({
                success: false,
                error: "Please check again your own email address!"
            });
        }
        if(check){
            try { 
                await ses.sendBattleshipMail(friendEmail,firstname,link2);         
                response.json({
                    success: true
                });
            } catch(error){
                response.json({
                    success: false,
                    error: "Please check again your friends email address!"
                });
            } 
        }        
    }  
});

app.post("/startLoomChat", async(request, response) => { 
    const {firstname,lastname,room} = request.body;
    if(!firstname || !lastname){
        response.json({
            success: false,
            error: "Please insert your firstname and lastname"
        });
    } else {
        const userId = await database.insertChatUser(firstname,lastname,room);
        request.session.userId = userId.rows[0].id;
        request.session.room = room; 
        response.json({
            success: true
        });
    }
    
});

app.get("/getChatUser/:room", async(request, response) => {
    const {room} = request.params;
    const check = room === request.session.room; 
    if(!request.session.userId || !check){
        response.json({
            user: false
        });
    } else {
        const userId = request.session.userId;
        const userdata = await database.getUser(userId); 
        const chatMessages = await database.getChatMessages(room); 
        response.json({
            user: userdata.rows[0],
            data: chatMessages.rows
        });
    }
    
});

io.on("connection", async(socket) =>{    
    const userId = socket.request.session.userId;
    
    if(!socket.request.session.userId){
        console.log("User is not connected");
        return socket.disconnect(true);
    }

    socket.on("useronline", async(room) => { console.log(userId,room, "useronline");
        socket.join(room);
        const allUsers = await database.getChatUsers(room);
        io.to(room).emit("useronline", {user:allUsers.rows});
    });       

    socket.on("chatMessage", async (data) => {     
        const {room, messagedraft,firstname,lastname} = data; 
        await database.storeMesssages(room, messagedraft,firstname,lastname);
        io.to(data.room).emit("chatMessage",{ 
            messagedraft,
            firstname,
            lastname
        });
    });

    socket.on("showVideo", data => {         
        io.to(data.room).emit("showVideo",{
            data: data.data,
            id: userId
        });
    });

    socket.on("noVideo", room => {   
        io.to(room).emit("noVideo", userId );
    });

    socket.on("painting", data => { 
        socket.to(data.room).emit("painting", data);
    });

    socket.on("clear", room => {
        io.to(room).emit("clear");
    });

});

server.listen(process.env.PORT || 8080);