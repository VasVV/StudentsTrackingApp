import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getStudentsList,
  getTasksList,
} from "./firebase";
import Modal from "react-modal";
import AddSingleTask from "./addsingletask";
import CheckTask from "./checktask";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useHistory} from 'react-router-dom';
import {
  faExclamationTriangle,
  faSpinner,
  faCheckCircle,
  faEnvelope,
  faPhone
} from "@fortawesome/free-solid-svg-icons";



const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: '50vw',
    maxHeight: '80vh',
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function Dashboard() {
    const history = useHistory();
    const currUser = useSelector((state) => state.addremovecurruser);
    if (!currUser.admin) {
        history.push('/sign-in');
    }


  const [students, setStudents] = useState([]);

  const [currStudent, setCurrStudent] = useState({});

  const [tasks, setTasks] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [secondModalIsOpen, setSecondIsOpen] = useState(false);
  const [taskUploaded, setTaskUploaded] = useState(false);

  const [currId, setCurrId] = useState("");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setCurrId("");
    setCurrStudent("");
    setIsOpen(false);
  }

  const [currTask, setCurrTask] = useState({});
  const [studentData, setStudentData] = useState({});

  const openSecondModal = (element, student) => {
    setCurrTask(element);
    setStudentData(student);
    setCurrId(student.id);
    setSecondIsOpen(true);
  };

  function closeSecondModal() {
    setSecondIsOpen(false);
  }

 

  const getStudents = async () => {
    const studentsList = await getStudentsList();
    setStudents(studentsList);
  };

  const addTask = (e) => {
    setCurrId(e.id);
    setCurrStudent(e);
    openModal();
  };

  useEffect(() => {
    if (taskUploaded) {
      setTimeout(() => {
        setTaskUploaded(false);
      }, 2000);
    }
  }, [taskUploaded]);

  const getTasks = async () => {
    const tasksList = await getTasksList();
    setTasks(tasksList);
  };

  useEffect(() => {
    getStudents();
    getTasks();
  }, []);

  return (
    <div className="dashboard">
      Здравствуйте, {currUser.firstName}
      <div className="container-teacher">
        <div className="btn-block-all">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => openModal()}
          >
            Добавить задание для всех
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <AddSingleTask
              closeModal={closeModal}
              getTasks={() => getTasks()}
              forAll={false}
            />
          </Modal>
        </div>
        <div className="row teacher-row">
          {students.map((e) => {
            return (
              <div className="col-sm student-card">
                <div className="header">
                  <h3>{e.lastName}</h3>
                  <h4>{e.firstName}</h4>
                  <p className="info">
                     <FontAwesomeIcon icon={faEnvelope} />    
                    <a className="email" href={`mailto:${e.email}`}>{e.email}</a>
                  </p>
                  <p className="info"> 
                      <FontAwesomeIcon icon={faPhone} />
                      <span className="phone">{e.phone}</span>
                  </p>
                </div>
                <div className="content">
                <div className="add_task">
                  <button
                    type="button"
                    className="btn btn-success btn-addtask"
                    onClick={() => addTask(e)}
                  >
                    Добавить задание
                  </button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <AddSingleTask
                      firstName={currStudent?.firstName}
                      lastName={currStudent?.lastName}
                      email={currStudent?.email}
                      currId={currId}
                      closeModal={closeModal}
                      getTasks={() => getTasks()}
                      forAll={false}
                    />
                  </Modal>
                </div>
                  <ul>
                    {tasks.map((el) => {
                      if (el[0] == e.id) {
                        return el[1]["tasks"].map((element) => (
                          <>
                            <li
                              className="tasks-list"
                              onClick={() => openSecondModal(element, e)}
                            >
                              {element.status == "toBeDone" && <FontAwesomeIcon icon={faExclamationTriangle} />}
                              
                              {element.status == "checking" && <FontAwesomeIcon icon={faSpinner} />}

                              {element.status == "completed" && <FontAwesomeIcon icon={faCheckCircle} />}

                              <span onClick={() => setSecondIsOpen(true)}>
                                {element.header}
                              </span>
                            </li>
                          </>
                        ));
                      }
                    })}
                  </ul>
                  <Modal
                    isOpen={secondModalIsOpen}
                    onRequestClose={closeSecondModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <CheckTask
                      currTask={currTask}
                      studentData={studentData}
                      closeModal={closeSecondModal}
                      getTasks={() => getTasks()}
                      taskHeader={currTask.header}
                    />
                  </Modal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
