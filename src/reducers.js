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

        state = {
            ...state,
            UserOnline : action.data.user
        };
    }    

    if(action.type === "mute"){

        state = {
            ...state,
            audio: action.data
        };

    }

    if(action.type === "video"){

        state = {
            ...state,
            video: action.data
        };

    }

    return state;
}