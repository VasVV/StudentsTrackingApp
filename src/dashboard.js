import { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { getStudentsList, addTaskToDb, getTasksList, confirmTask, uploadFile } from './firebase';
import Modal from 'react-modal';

import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { faExclamationTriangle, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { onAddTask } from './email';
import { Rating } from 'react-simple-star-rating'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

export default function Dashboard() {

    const [students, setStudents] = useState([]);

    const [currStudent, setCurrStudent] = useState({});
    const [currTaskHeader, setCurrTaskHeader] = useState('');
    const [currTaskText, setCurrTaskText] = useState('');
    const [currTaskVideo, setCurrTaskVideo] = useState('');
    const [currTaskFile, setCurrTaskFile] = useState('');
    const [currTaskSolution, setCurrTaskSolution] = useState('');
    const [currTaskStatus, setCurrTaskStatus] = useState('');

    const [tasks, setTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [taskFile, setTaskFile] = useState('');
    const [taskCommentary, setTaskCommentary] = useState('');
    const [taskRating, setTaskRating] = useState(0);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [secondModalIsOpen, setSecondIsOpen] = useState(false);
    const [taskHeader, setTaskHeader] = useState('');
    const [taskVideo, setTaskVideo] = useState('');
    const [taskStatus, setTaskStatus] = useState('');

    const [modalforAllIsOpen, setModalForAllIsOpen] = useState(false);

    const [currId, setCurrId] = useState('');

    function openModal() {
        setIsOpen(true);
    }


    function closeModal() {
        setIsOpen(false);
    }



    function openSecondModal(element, uid) {
        setCurrTaskHeader(element.header);
        setCurrTaskVideo(element.video);
        setCurrTaskText(element.text);
        setCurrTaskFile(element.attachedFile);
        setCurrTaskSolution(element.solution);
        setTaskRating(element.rating);
        setCurrTaskStatus(status(element.status));
        console.log('uid', uid)
        setCurrId(uid);
        setSecondIsOpen(true);
    }


    function closeSecondModal() {
        setSecondIsOpen(false);
    }

    const currUser = useSelector(state => state.addremovecurruser);

    const status = st => {
        switch(st) {
            case 'toBeDone':
                return "Нужно сделать";
            case 'checking':
                return "Задание на проверке";
            case 'completed':
                return "Готово и проверено";
        }
    }

    const getStudents = async() => {
        const studentsList = await getStudentsList();
        setStudents(studentsList)
    }

    const addTask = (e) => {
            setCurrId(e.id);
            setCurrStudent(e);
            openModal();
    }

    const handleTaskSubmit = async(e) => {
        e.preventDefault();
        let {downloadUrl, fileName} = await uploadFile(taskFile);
        console.log(downloadUrl);
        console.log('FILENAME', fileName);
        await addTaskToDb(currId, taskText, downloadUrl, fileName, taskHeader, taskVideo);
        
        await onAddTask(currStudent.email, currStudent.firstName, taskHeader);
        getTasks();
        setTaskHeader('');
        setTaskVideo('');
        setTaskText('');
        setTaskFile('');
    }

    const getTasks = async() => {
        const tasksList = await getTasksList();
        setTasks(tasksList);
    }

    const handleSetTaskVideo = (url) => {
        const re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        const id = re.exec(url)[1];
        setTaskVideo(id);
    }

    const handleCheck = async e => {
        e.preventDefault();
        //(uid, header, status, rating, commentary)
       await confirmTask(currId, currTaskHeader,'completed', taskRating, taskCommentary);
        getTasks();
        setTaskHeader('');
        setTaskVideo('');
        setTaskText('');
        setTaskFile('');
        setTaskCommentary('');
        setTaskRating(0);
    }

    const handleTaskSubmitForAll =  async (e) => {
        e.preventDefault();
        let {downloadUrl, fileName} = await uploadFile(taskFile);
    
        await addTaskToDb(currId, taskText, downloadUrl, fileName, taskHeader, taskVideo);
        
        await onAddTask(currStudent.email, currStudent.firstName, taskHeader);
        getTasks();
        setTaskHeader('');
        setTaskVideo('');
        setTaskText('');
        setTaskFile('');

        
    }

    useEffect(() => {
        getStudents();
        getTasks();
    }, [])


    return (
        <div className="dashboard">
            Здравствуйте, {currUser.firstName}
            
            <div className="container-teacher">
            <div className="btn-block-all">
                <button type="button" className="btn btn-success" onClick={ () => setModalForAllIsOpen(true) }>Добавить задание для всех</button>
                <Modal
                                                isOpen={modalforAllIsOpen}
                                                onRequestClose={() => setModalForAllIsOpen(false)}
                                                style={customStyles}
                                                contentLabel="Example Modal"
                                            >
                                                <h2 >Добавить задание для всего курса </h2>
                                                <button type="button" class="btn btn-danger" onClick={() => setModalForAllIsOpen(false)}>Закрыть</button>
                                                <form onSubmit={(e) => handleTaskSubmitForAll(e)}>

                                                <div className="form-group">
                                                        <label>Название задания</label>
                                                        <input required type="text" className="form-control" placeholder="Enter email" value={taskHeader} onChange={(e) => setTaskHeader(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Текст или ссылка на задание</label>
                                                        <input required type="text" className="form-control" placeholder="Enter email" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Видео</label>
                                                        <input type="text" className="form-control" placeholder="Enter email" onChange={(e) => handleSetTaskVideo(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Файл</label>
                                                        <input type="file" className="form-control" placeholder="Enter email" value={taskFile} onChange={(e) => setTaskFile(e.target.files[0])} />
                                                    </div>

                                                    <button type="submit" className="btn btn-primary btn-block" >Добавить задание</button>

                                                </form>
                                            </Modal>

                </div>
                <div className="row teacher-row">
                    {students.map(e => {

                        return (
                                    <div className="col-3 student-card">
                                        <div className="header">
                                            <h3>{e.lastName}</h3>
                                            <h3>{e.firstName}</h3>
                                            <p>{e.email}</p>
                                            <p>{e.phone}</p>
                                        </div>
                                        <div className="content">
                                            <ul>
                                                {tasks.map(el => {
                                                    if (el[0] == e.id ) {
                                                        return el[1]['tasks'].map(element => 
                                                        <>  
                                                          <li className='tasks-list' onClick={() => openSecondModal(element, e.id)}>
                                                          {element.status == 'toBeDone' ? <FontAwesomeIcon icon={faExclamationTriangle} /> : ''}
                                                          {element.status == 'checking' ? <FontAwesomeIcon icon={faSpinner} /> : ''}
                                                          {element.status == 'completed' ? <FontAwesomeIcon icon={faCheckCircle} /> : ''}
                                                             {element.header}
                                                             
                                                        </li>
                                                        <Modal
                                                        isOpen={secondModalIsOpen}
                                                        onRequestClose={closeSecondModal}
                                                        style={customStyles}
                                                        contentLabel="Example Modal"
                                                    >
                                                        <h2>Задание для студента {e.firstName} {e.lastName}</h2>
                                                        <button type="button" class="btn btn-danger" onClick={closeSecondModal}>Закрыть</button>
                                                        <form onSubmit={(e) => handleCheck(e)}>
                                                            
                                                            <div className="form-group">
                                                                <label>Название задания</label>
                                                                <input type="text" readOnly className="form-control"  value={currTaskHeader} onChange={(e) => setTaskHeader(e.target.value)} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Статус выполнения</label>
                                                                <input type="text" readOnly className="form-control"  value={currTaskStatus} onChange={(e) => setTaskHeader(e.target.value)} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Текст или ссылка на задание</label>
                                                                <input readOnly type="text" className="form-control" value={currTaskText} onChange={(e) => setTaskText(e.target.value)} />
                                                            </div>
                                                                {currTaskVideo == 'false' ?
                                                            <div className="form-group">
                                                                <label>Видео</label>
                                                                <LiteYouTubeEmbed 
                                                                    id={currTaskVideo}
                                                                />
                                                            </div> : ''}

                                                            {currTaskFile == 'false' ?
                                                                <div className="form-group">
                                                                <label>Файл</label>
                                                                <input readOnly type="file" className="form-control"  onChange={(e) => setTaskFile(e.target.files[0])} />
                                                            </div> : ''}

                                                            <div className="form-group">
                                                                <label>Решение</label>
                                                                <input readOnly type="text" className="form-control" value={currTaskSolution} onChange={(e) => setTaskFile(e.target.value)} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Комментарий преподавателя</label>
                                                                <input type="text" className="form-control" onChange={(e) => setTaskCommentary(e.target.value)} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Оценка</label>
                                                                <Rating onClick={(rate) => setTaskRating(rate)} ratingValue={taskRating} allowHalfIcon={true}  />
                                                            </div>

                                                            <button type="submit" className="btn btn-success">Подтвердить выполнение задания</button>
        
        
                                                        </form>
                                                    </Modal></>
                                                       )
                                                    }
                                                })}
                                                  
                                            </ul>
                                        </div>
                                        <div className="add_task">
                                            <button type="button" className="btn btn-success" onClick={ () => addTask(e) }>Добавить задание</button>
                                            <Modal
                                                isOpen={modalIsOpen}
                                                onRequestClose={closeModal}
                                                style={customStyles}
                                                contentLabel="Example Modal"
                                            >
                                                <h2 >Добавить задание для студента {currStudent?.firstName} {currStudent?.lastName} </h2>
                                                <button type="button" class="btn btn-danger" onClick={closeModal}>Закрыть</button>
                                                <form onSubmit={(e) => handleTaskSubmit(e)}>

                                                <div className="form-group">
                                                        <label>Название задания</label>
                                                        <input required type="text" className="form-control" placeholder="Введите название задания" value={taskHeader} onChange={(e) => setTaskHeader(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Текст или ссылка на задание</label>
                                                        <input type="text" className="form-control" placeholder="Введите текст задания или ссылку" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Видео</label>
                                                        <input type="text" className="form-control" placeholder="Введите ссылку на YouTube" onChange={(e) => handleSetTaskVideo(e.target.value)} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label>Файл</label>
                                                        <input type="file" className="form-control"  onChange={(e) => setTaskFile(e.target.files[0])} />
                                                    </div>

                                                    <button type="submit" className="btn btn-primary btn-block" >Добавить задание</button>

                                                </form>
                                            </Modal>
                                        </div>
                                    </div>      
                        )
                    })}
                </div>
                
            </div>
            
        </div>
    )
}