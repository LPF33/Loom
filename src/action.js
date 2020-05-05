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

export function showVideo(video){
    return {
        type: "showVideo",
        data: video
    };
}

export function stopMyVideo(videoVisible){
    return{
        type: "stopMyVideo",
        data: videoVisible
    };
}

export function notMyVideo(data){
    return{
        type: "notMyVideo",
        data: data
    };
}

