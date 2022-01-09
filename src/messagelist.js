import { useEffect, useState } from "react";
import {listenToMessagesFromDb, getMessagesFromDb} from './firebase';
import { useSelector } from "react-redux";
import { initializeApp } from 'firebase/app';

import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, addDoc, onSnapshot } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDQkgDDZUKedyBiW_BvzxSankCXF50SILk",
  authDomain: "studentstrackingapp.firebaseapp.com",
  projectId: "studentstrackingapp",
  storageBucket: "studentstrackingapp.appspot.com",
  messagingSenderId: "1073905633723",
  appId: "1:1073905633723:web:2b530736f2cdfb8ccfdc9e"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export default function MessageList() {

  const [allMessages, setAllMessages] = useState([]);

  const currUser = useSelector(state => state.addremovecurruser);
  const updateChat = useSelector(state => state.updateChat);


  const getAllMessages = async() => {
    const msg = await getMessagesFromDb();
    console.log('msg 1' , msg);
    setAllMessages(msg);
  };

  useEffect(async () => {
    await getAllMessages();
  },[]);

  useEffect(async () => {
    await getAllMessages();
  },[updateChat]);

  

    return (

      

     
        <ul className="message-list">                 
            {allMessages.sort((a,b) => new Date(a.timeStamp) - new Date(b.timeStamp)).map(message => {
              return (
               <li className={message.id != currUser.id  ? "message" : 'message-mine'} key={message.id}>
                 <div className="message-sender">
                   <p className='message-sender-info'>{message.fullName}</p>
                   <p className='message-sender-info'>{message.timeStamp}</p>
                 </div>
                 <div className={message.id != currUser.id ? "message-text" : ' message-text-mine'}>
                   {message['message']}
                 </div>
               </li>
             )
           })}
         </ul>
    )
}