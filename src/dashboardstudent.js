import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { getTasksList, addSolutionToDb, confirmTask } from './firebase';
import Modal from 'react-modal';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Rating } from 'react-simple-star-rating'
import SubmitSolution from './submitsolution';

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
    const [currTask, setCurrTask] = useState({});
    const [cumulativeRating, setCumulativeRating] = useState(0);

    function openSecondModal(element) {
        setCurrTask(element);
        setSecondIsOpen(true);
    }


    function closeSecondModal() {
        setSecondIsOpen(false);
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

    useEffect(() => {
        loadTasks();
    }, [])
    return (
        <div className="dashboard">
            <div className="container-student">
            <div className="student-card-single">
            Здравствуйте, {currUser.firstName}
            <div>
                Ваша средняя оценка: {<Rating ratingValue={cumulativeRating} allowHalfIcon={true} readonly={true} />}
            </div>
            
            <div className="tasks-list">
                <ul>
                    {
                         tasks?.map((e,i) => {
                         return (
                             <>
                                <li className='tasks-list' onClick={() => openSecondModal(e)} key={i}>
                                    {e.status == 'toBeDone' ? <FontAwesomeIcon icon={faExclamationTriangle} /> : ''}
                                    {e.status == 'checking' ? <FontAwesomeIcon icon={faSpinner} /> : ''}
                                    {e.status == 'completed' ? <FontAwesomeIcon icon={faCheckCircle} /> : ''}
                                    {<span onClick={() =>openSecondModal(e)}>{e.header}</span>}
                                    {e.rating ? <Rating ratingValue={e.rating} allowHalfIcon={true} readonly={true} /> : '' }
                                </li>
                                

                             </>
                         
                         )}
                         )
                    }
                </ul>
                <Modal
                                                        isOpen={secondModalIsOpen}
                                                        onRequestClose={closeSecondModal}
                                                        style={customStyles}
                                                        contentLabel="Example Modal"
                                                    >
                                                        <SubmitSolution
                                                            currUser = {currUser}
                                                            currTask={currTask}
                                                            closeSecondModal={closeSecondModal}
                                                            loadTasks={() => loadTasks()}
                                                        />
                                                        
                                                    </Modal>
            </div>
            </div>
            </div>
        </div>


    )
}