export default function (state = {}, action) {

    if(action.type == "receivedMessage"){

        const newData = state.allMessages ? [...state.allMessages, action.message] : [action.message];

        state = {
            ...state,
            allMessages: newData
        };
    }

    return state;
}