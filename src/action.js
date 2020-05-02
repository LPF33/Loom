export function chatMessage(message){
    return {
        type: "receivedMessage",
        message : message
    };
}
