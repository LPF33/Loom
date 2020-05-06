import * as io from 'socket.io-client';
import {chatMessage, showUser, showVideo, notMyVideo} from "./action";

export let socket;

export const init = store => {
    if (!socket) {
        let server = process.env.PORT ? 'https://loomchat.herokuapp.com' : "http://127.0.0.1:8080";
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