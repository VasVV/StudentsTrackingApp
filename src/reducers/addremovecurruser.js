const addremovecurruser = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_CURR_USER':
            return action.payload;
        case 'REMOVE_CURR_USER':
            return {};
        default:
            return state    
    }
}

export default addremovecurruser;