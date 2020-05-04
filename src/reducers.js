export default function (state = {}, action) {

    if(action.type === "receivedMessage"){

        const allMessages = state.allMessages ? [...state.allMessages, action.message] : [action.message];

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
        const UserVideo = action.data;

        state = {
            ...state,
            UserVideo
        };
    }

    return state;
}