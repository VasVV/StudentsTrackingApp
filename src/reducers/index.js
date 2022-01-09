import { combineReducers } from 'redux';
import addremovecurruser from './addremovecurruser';
import updateChat from './updatechat';

export default combineReducers({
    addremovecurruser,
    updateChat
})