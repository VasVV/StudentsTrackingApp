import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { getTasksList, addSolutionToDb, confirmTask } from './firebase';
import Modal from 'react-modal';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating } from 'react-simple-star-rating'


import { faExclamationTriangle, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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

export default function DashboardStudent() {

    const [tasks, setTasks] = useState([]);
    const [secondModalIsOpen, setSecondIsOpen] = useState(false);
    const [currTaskHeader, setCurrTaskHeader] = useState('');
    const [currTaskText, setCurrTaskText] = useState('');
    const [currTaskVideo, setCurrTaskVideo] = useState('');
    const [currTaskFile, setCurrTaskFile] = useState('');
    const [currTaskStatus, setCurrTaskStatus] = useState('');
    const [currTaskFileName, setCurrTaskFileName] = useState('');
    const [currTaskRating, setCurrTaskRating] = useState(0);
    const [currTaskCommentary, setCurrTaskCommentary] = useState('');
    const [solution, setSolution] = useState('');
    const [cumulativeRating, setCumulativeRating] = useState(0);

    function openSecondModal(element) {
        setCurrTaskHeader(element.header);
        setCurrTaskVideo(element.video);
        setCurrTaskText(element.text);
        setCurrTaskFile(element.attachedFile);
        setCurrTaskStatus(status(element.status));
        setCurrTaskFileName(element.fileName);
        setCurrTaskCommentary(element.commentary);
        setCurrTaskRating(element.rating)
        setSecondIsOpen(true);
    }


    function closeSecondModal() {
        setCurrTaskHeader('');
        setCurrTaskVideo('');
        setCurrTaskText('');
        setCurrTaskFile('');
        setCurrTaskStatus('');
        setCurrTaskFileName('');
        setCurrTaskCommentary('');
        setCurrTaskRating(0)
        setSecondIsOpen(false);
    }

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

    const currUser = useSelector(state => state.addremovecurruser);

    const roundRating = tasks => {
        let rate = 0;
        let numRate = 0;
        tasks.forEach(e => {
            if (e.rating) {
                rate+=e.rating;
                numRate++;
            }
        })
        let fin = Math.ceil( (rate / numRate) / 10) * 10;
        return fin;
    }

    const loadTasks = async() => {
        let allTasks = await getTasksList();
        let selectedTasks = allTasks.filter(el => el[0] == currUser.id);
        setCumulativeRating(roundRating(selectedTasks[0][1]['tasks']));
        setTasks(selectedTasks[0][1]['tasks']);
    }

    const handleSubmitSolution = async e => {
        e.preventDefault();
        await addSolutionToDb(currUser.id, currTaskHeader, solution);
        console.log(currTaskHeader);
        await confirmTask(currUser.id, currTaskHeader, 'checking');
        loadTasks();
    }

    useEffect(() => {
        loadTasks();
    }, [])
    return (
        <div className="dashboard">
            <div className="container-student">
            <div className="student-card">
            Здравствуйте, {currUser.firstName}
            <div>
                Ваша средняя оценка: {<Rating ratingValue={cumulativeRating} allowHalfIcon={true} readonly={true} />}
            </div>
            
            <div className="tasks-list">
                <ul>
                    {
                         tasks?.map(e => {
                         return (
                             <>
                                <li className='tasks-list' onClick={() => openSecondModal(e)}>
                                    {e.status == 'toBeDone' ? <FontAwesomeIcon icon={faExclamationTriangle} /> : ''}
                                    {e.status == 'checking' ? <FontAwesomeIcon icon={faSpinner} /> : ''}
                                    {e.status == 'completed' ? <FontAwesomeIcon icon={faCheckCircle} /> : ''}
                                    {e.header}
                                    {e.rating ? <Rating ratingValue={e.rating} allowHalfIcon={true} readonly={true} /> : '' }
                                </li>
                                <Modal
                                                        isOpen={secondModalIsOpen}
                                                        onRequestClose={closeSecondModal}
                                                        style={customStyles}
                                                        contentLabel="Example Modal"
                                                    >
                                                        <h2>Задание для студента {e.firstName} {e.lastName}</h2>
                                                        <button type="button" class="btn btn-danger" onClick={closeSecondModal}>Закрыть</button>
                                                        <form onSubmit={(e) => handleSubmitSolution(e)}>
                                                            
                                                            <div className="form-group">
                                                                <label>Название задания</label>
                                                                <input readOnly type="text"  className="form-control" placeholder="Enter email" value={currTaskHeader}  />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Статус выполнения</label>
                                                                <input type="text" readOnly className="form-control" placeholder="Enter email" value={currTaskStatus}  />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Текст или ссылка на задание</label>
                                                                <input readOnly  type="text" className="form-control" placeholder="Enter email" value={currTaskText}  />
                                                            </div>

                                                            {currTaskVideo.length > 0 ?
                                                            <div className="form-group">
                                                                <label>Видео</label>
                                                                <LiteYouTubeEmbed 
                                                                    id={currTaskVideo}
                                                                />
                                                            </div> : ''}
        
                                                            <div className="form-group">
                                                                <label>Файл</label>
                                                                <a href={currTaskFile} className="form-control">Скачать {currTaskFileName}</a>
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Решение</label>
                                                                <input  type="text" className="form-control" placeholder="Введите решение" value={solution} onChange={(e) => setSolution(e.target.value)} />
                                                            </div>
                                                            { currTaskStatus == 'Готово и проверено' ?
                                                            <>
                                                            <div className="form-group">
                                                                <label>Комментарий преподавателя</label>
                                                                <input readOnly type="text" className="form-control" value={currTaskCommentary} />
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Оценка</label>
                                                                <Rating ratingValue={currTaskRating} allowHalfIcon={true} readonly={true} />
                                                            </div>
                                                            </>
                                                            : ''}

                                                            <button type="submit" className="btn btn-primary btn-block" >Отправить решение на проверку</button>
        
                                                        </form>
                                                    </Modal>

                             </>
                         
                         )}
                         )
                    }
                </ul>
            </div>
            </div>
            </div>
        </div>


    )
}