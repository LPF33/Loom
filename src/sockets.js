import * as io from 'socket.io-client';
import {chatMessage, showUser} from "./action";

export let socket;

export const init = store => {
    if (!socket) {
        let server = 'https://loomchat.herokuapp.com';
        //let server = "http://127.0.0.1:8080";
        socket = io.connect(server);
    }
    
    socket.on(
        "chatMessage",
        message => store.dispatch(
            chatMessage(message)
        )
    );

    socket.on(
        "useronline",
        user => store.dispatch(
            showUser(user)
        )
    );

};