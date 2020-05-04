export function chatMessage(message){
    return {
        type: "receivedMessage",
        message : message
    };
}

export function showUser(user){
    return {
        type: "showUser",
        data: user
    }
}
