const express = require('express');
const helmet = require('helmet');
const app = express();
const compression = require('compression');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const csurf = require("csurf");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const database = require("./database.js");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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
/*
app.use(csurf());

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
    next();
});*/

io.on("connection", function(socket){        
    console.log(socket.id);

    socket.on("chatMessage", data => {       
        
        io.sockets.emit("chatMessage",{
            data
        });
    });
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
        response.json({
            success: true
        });
    }
    
});

app.get("/getChatUser", async(request, response) => {
    const userId = request.session.userId;
    const userdata = await database.getUser(userId); console.log(userId,userdata);
    response.json({
        user: userdata.rows[0]
    });
});

server.listen(process.env.PORT || 8080);