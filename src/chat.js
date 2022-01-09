import Title from './title';
import MessageList from './messagelist';
import SendField from './sendfield';


export default function Chat() {
    return (
        <div className="chat">
            <Title />
            <MessageList />
            <SendField />
        </div>
    )
}