

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion, addDoc, onSnapshot } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);



export async function signUpUser(email, password, firstName, lastName, phone) {

  if (password.length < 6) {
        alert('Password is too short');
        return;
  };

  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "user", user.uid), { 
    email,
    firstName,
    lastName,
    id: user.uid,
    phone,
    admin: false
   }); 
     
};

export async function signInUser(email, password) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
   
    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No such document!");
    }
   
  }
  catch(err) {
    console.log(err);
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
   
  } catch(err) {
    console.log(err);
  }
}

export async function getStudentsList() {
  try {
    let allStudents = [];
    const q = query(collection(db, "user"), where("admin", "==", false));
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allStudents.push(doc.data());
      });
      return allStudents;

  }
  catch(err) {
    console.log(err);
  }
}

export async function editTask(uid, header, text, video, attachedFile, fileName ) {
  try {
    const docRef = doc(db, "task", uid);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    
   
    data.tasks.map(e => {
      if (e.header == header) {
        e.text = text;
        e.video = video;
        e.attachedFile = attachedFile;
        e.fileName = fileName;
      }
    });
    
    await setDoc(doc(db, "task", uid), { 
      tasks: data.tasks
     }); 
    
  } catch(err) {
    console.log(err);
  }
 
 
}

export async function deleteTask(uid, taskName) {
  try {
    const docRef = doc(db, "task", uid);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    console.log('docsnap data', data);
    data.tasks = data.tasks.filter(e => e.header !== taskName );
    console.log('data afeter deletion', data);
    await setDoc(doc(db, "task", uid), { 
      tasks: data.tasks
     }); 
  } catch(err) {
    console.log(err)
  }
}

export async function addTaskToDb(uid, text, attachedFile, fileName, header, video) {
  if (!video) {
    video = false
  }
  if (!attachedFile) {
    attachedFile = false
  }
  if (!fileName) {
    fileName = false
  }
  try {
    //for all
    if (!uid) { 
      const querySnapshot = await getDocs(collection(db, "task"));
      querySnapshot.forEach((document) => {
        let newData = document.data();
        newData.tasks.push({text, header, attachedFile, fileName, video, status: 'toBeDone'});
        const docRef = doc(db, "task", document.id);
        
        setDoc(docRef, newData);
      });
      return;
    } else {
      const docRef = doc(db, "task", uid);
      const docSnap = await getDoc(docRef);
      if (  docSnap.exists() ) {
        await updateDoc(docRef, {
          tasks: arrayUnion({text, header, video, attachedFile, fileName, status: 'toBeDone'})
      });
      } else {
        await setDoc(doc(db, "task", uid), { 
          tasks: [{text, header, video, fileName, attachedFile, status: 'toBeDone'}]
         }); 
      }

    }
   
  } catch(err) {
    console.log(err);
  }
};



export async function getTasksList() {
  try {
    let allTasks = [];
    const q = query(collection(db, "task"));
    const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        allTasks.push([doc.id, doc.data()]);
      });
      
      return allTasks;
  } catch(err) {
    console.log(err);
  }
}

export async function addSolutionToDb(uid, header, solution, solutionFile, solutionFileName) {
  try {
    const docRef = doc(db, "task", uid);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    if (solutionFile) {
      data.tasks.map(e => {
        if (e.header == header) {
          e.solution = solution
          e.solutionFile = solutionFile
          e.solutionFileName = solutionFileName
        }})
    }
    else {
    data.tasks.map(e => {
      if (e.header == header) {
        e.solution = solution
      }
    });
    
    }
    await setDoc(doc(db, "task", uid), { 
      tasks: data.tasks
     }); 
    
  } catch(err) {
    console.log(err);
  }
}

export async function confirmTask(uid, header, status, rating, commentary) {
  try {

    const docRef = doc(db, "task", uid);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
   
    data.tasks.map(e => {
      if (e.header == header) {
        e.status = status;
        if (rating) {
        e.rating = rating;
        }
        if (commentary) {
        e.commentary = commentary;
        }
      }
    });
    console.log('inside confirm')
    console.log(uid, header, status, rating, commentary);
    await setDoc(doc(db, "task", uid), { 
      tasks: data.tasks
     }); 
    
  } catch(err) {
    console.log(err);
  }
}

export async function uploadFile(file) {
  try {
    let downloadUrl;
   
    
    if (file.length === 1) {
      console.log('file-name-firebase', file[0]['name']);

      const storageRef = ref(storage, `files/${file[0].name}`);
      await uploadBytes(storageRef, file[0]);

      await getDownloadURL(ref(storage, `files/${file[0].name}`)).then((url) => {
        downloadUrl = url;
      })
      return {downloadUrl, fileName: file[0].name};
    }
    else {
      let fileList = [];
      let fileNames = [];
      for (var i = 0; i < file.length; i++) {
        const thisfile = file[i];

        const storageRef = ref(storage, `files/${thisfile.name}`);

        await uploadBytes(storageRef, thisfile);

        await getDownloadURL(ref(storage, `files/${thisfile.name}`)).then((url) => {
          fileList.push(url);
          fileNames.push(thisfile.name)
        })
    }

    return {fileList, fileNames};
    }
  } catch(err) {
    console.log(err);
  }
}

export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch(err) {
    console.log(err);
  }
}

export async function sendMessageToDb(message, id, timeStamp, fullName) {
  try {
    await addDoc(collection(db, "message"), {
      message,
      id,
      timeStamp,
      fullName
    });

  } catch(err) {
    console.log(err);
  }
}


export async function getMessagesFromDb() {
  try {
    const q = query(collection(db, "message"));
    const querySnapshot = await getDocs(q);
    let messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    return messages;
  } catch(err) {
    console.log(err);
  }
}

export async function deleteFileFromDb(uid, taskHeader, fileName, fileLink) {
  try {


    const docRef = doc(db, "task", uid);
    const docSnap = await getDoc(docRef);
    let data = docSnap.data();
    console.log(data)

    data.tasks.map(e => {
      if (e.header === taskHeader) {
        e['attachedFile'] = e['attachedFile'].filter(el => el !== fileLink);
        e['fileName'] = e['fileName'].filter(el => el !== fileName);
      }
    });
    console.log(data);
    await setDoc(doc(db, "task", uid), { 
      tasks: data.tasks
     }); 

  } catch(err) {
    console.log(err)
  }
}