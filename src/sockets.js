import * as io from 'socket.io-client';
import {chatMessage, showUser, showVideo, notMyVideo} from "./action";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect('127.0.0.1:8080');
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

    socket.on(
        "showVideo",
        video => store.dispatch(
            showVideo(video)
        )
    );

    socket.on(
        "noVideo",
        data => store.dispatch(
            notMyVideo(data)
        )
    );

};