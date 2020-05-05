export default function (state = {}, action) {

    if(action.type === "receivedMessage"){

        const allMessages = state.allMessages ? [...state.allMessages, {firstname: action.message.firstname, lastname: action.message.lastname, messagedraft: action.message.messagedraft}] : [{firstname: action.message.firstname,lastname: action.message.lastname,messagedraft: action.message.messagedraft}];
        
        state = {
            ...state,
            allMessages
        };
    }

    if(action.type === "oldChatMessages"){
        const allMessages = action.data; 
        
        state = {
            ...state,
            allMessages
        };
    }
    
    if(action.type === "showUser"){
        const UserOnline = state.UserOnline ? [...state.UserOnline, action.data] : [action.data];

        state = {
            ...state,
            UserOnline
        };
    }

    if(action.type === "showVideo"){
        const UserVideo = state.UserVideo ? {...state.UserVideo, [action.data.id] : action.data.data} : {[action.data.id] : action.data.data};

        state = {
            ...state,
            UserVideo
        };
    }

    if(action.type === "stopMyVideo"){
        const videoVisible = action.data;

        state={
            ...state,
            videoVisible
        };
    }

    if(action.type === "notMyVideo"){ 
        delete state.UserVideo[action.data];
        const data = state.UserVideo.length >= 1 ? state.UserVideo : null; 

        state={
            ...state,
            UserVideo: data
        };
    }

    return state;
}