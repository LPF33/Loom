export function chatMessage(message){
    return {
        type: "receivedMessage",
        message : message
    };
}

export function oldChatMessages(data){
    return {
        type: "oldChatMessages",
        data : data
    };
}

export function showUser(user){
    return {
        type: "showUser",
        data: user
    };
}

export function audio(data){
    return {
        type: "mute",
        data: data
    };
}

export function video(data){
    return {
        type: "video",
        data: data
    };
}


