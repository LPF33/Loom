import * as io from 'socket.io-client';
import {chatMessage} from "./action";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect('http://localhost:8080');
    }
    
    socket.on(
        "chatMessage",
        message => store.dispatch(
            chatMessage(message)
        )
    );
};