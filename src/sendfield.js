import {useState} from "react";
import { faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useSelector, useDispatch} from 'react-redux';
import {sendMessageToDb} from './firebase';


export default function SendField() {

    const currUser = useSelector(state => state.addremovecurruser);
    const [message, setMessage] = useState();
    const dispatch = useDispatch();

    const handleSendMessage = async(e) => {
        e.preventDefault();
        const timeStamp = new Date().toString();
        const uid = currUser.id;
        const fullName = `${currUser.firstName} ${currUser.lastName}`;
        await sendMessageToDb(message, uid, timeStamp, fullName);
        dispatch({type: 'UPDATE_CHAT'});
        setMessage('');
    }

    return (
        <form
            className="send-message-form"
            onSubmit={(e) => handleSendMessage(e)}
            >
            <input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Введите ваше сообщение"
              type="text" />
            <button type="submit" className="btn btn-success chat-btn">
                <div className='chat-btn-content'>
                    <FontAwesomeIcon className='chat-btn-icon' icon={faPaperPlane} />
                    <div className='chat-btn-text'>Отправить</div>
                </div>
                
                
                </button>
          </form>
    )
}