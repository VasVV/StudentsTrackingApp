const updateChat = (state = 0, action) => {
    switch (action.type) {
        case 'UPDATE_CHAT':
            return state + 1;
        default:
            return state    
    }
}

export default updateChat;