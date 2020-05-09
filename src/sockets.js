import * as io from 'socket.io-client';
import {chatMessage, showUser} from "./action";

export let socket;

export const init = store => {
    if (!socket) {
        const serverUrl = window.location.href.startsWith("https://loomchat.herokuapp.com") ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:8080";
        socket = io.connect(serverUrl);
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