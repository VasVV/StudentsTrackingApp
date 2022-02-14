import { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import { confirmTask, editTask, uploadFile, deleteFileFromDb } from './firebase';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import {status} from './helpers';

export default function CheckTask({currTask, studentData, closeModal, getTasks}) {


    const [taskCommentary, setTaskCommentary] = useState('');
    const [taskRating, setTaskRating] = useState(0);
    const [taskText, setTaskText] = useState(currTask.text);
    const [taskFile, setTaskFile] = useState(currTask.attachedFile);
    const [taskFileName, setTaskFileName] = useState(currTask.fileName)
    const [taskVideo, setTaskVideo] = useState(currTask.video);
    const [fileChanged, setFileChanged] = useState(false);
    const [edit, setEdit] = useState(false);

    const deleteFile = async (fileName, fileLink) => {
        await deleteFileFromDb(studentData.id, currTask.header, fileName, fileLink);
        let newTaskFile = taskFile.filter(e => e!== fileLink);
        setTaskFile(newTaskFile);
        let newTaskFileName = taskFileName.filter(e => e!== fileLink)
        setTaskFileName(newTaskFileName);
    }
    
    const handleCheck = async e => {
        e.preventDefault();
        await confirmTask(studentData.id, currTask.header,'completed', taskRating, taskCommentary);
        getTasks();
    }

    const handleFileChange = e => {
        setFileChanged(true);
        setTaskFile(e.target.files[0])
    }

    const handleEdit = async e => {
        if (edit === false) {
            setEdit(true);
        }
        else {
        //uid, header, text, video, attachedFile, fileName
            if (fileChanged) {
                    let {downloadUrl, fileName} = await uploadFile(taskFile);
                    await editTask(studentData.id, currTask.header, taskText,  taskVideo, downloadUrl, fileName, );
                } else {
                    await editTask(studentData.id, currTask.header, taskText, taskVideo, taskFile, taskFileName);
                }
                setEdit(false);
            }
            getTasks()
    }   

   

    return (
        <>
        <h2>Задание для студента {studentData.firstName} {studentData.lastName}</h2>
        <button 
            type="button" 
            className={edit ? "btn btn-primary" : 'btn btn-secondary'} 
            onClick={() => handleEdit(true)}>
                                {!edit ? 'Изменить задание' : 'Подтвердить изменения'}
                        </button>
        <button type="button" className="btn btn-danger" onClick={closeModal}>Закрыть</button>
        
            <div className="form-group">
                <div>
                    <div>
                        <label>Название задания</label>
                        <input type="text" readOnly className="form-control"  value={currTask.header}  />
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>

            <div className="form-group">
                <label>Статус выполнения</label>
                <input type="text" readOnly className="form-control"  value={status(currTask.status)} />
            </div>

            <div className="form-group">
                <label>Текст или ссылка на задание</label>
                <input readOnly={edit ? false : true} type="text" className="form-control" value={taskText} onChange={(e) => setTaskText(e.target.value)} />
            </div>
           
            <div className="form-group">
            {(edit && !currTask.video) &&<label>Видео</label>}
            {currTask.video &&<label>Видео</label>}
               { edit && <input type="text" className="form-control" value={taskVideo} onChange={(e) => setTaskVideo(e.target.value)} />}
                {currTask.video && <LiteYouTubeEmbed 
                    id={currTask.video}
                />}
            </div> 

            
                <div className="form-group">
                {currTask.attachedFile && <label>Файл</label>}
                {(edit && !currTask.attachedFile)  && <label>Файл</label>}
                {!Array.isArray(currTask.attachedFile) ? <p className="form-control" >
                    <a target="blank" href={currTask.attachedFile}>
                        {currTask.fileName || 'файл'}</a></p>
                        :
                        currTask.attachedFile.map((e,i) => {
                            return (
                                <p className="form-control" >
                                    
                                        <div className="file-edit">
                                        <a target="blank" href={e}> {currTask.fileName[i] || 'файл'}   </a>
                                            {(edit && <button className="btn btn-danger" onClick={() => deleteFile(currTask.fileName[i], e)}>Удалить</button>)}
                                        </div>
                                  
                                </p>
                            )
                        })
                        }
                {edit &&<input type="file" className="form-control" onChange={(e) => handleFileChange(e)}  />}
            </div>

            {currTask.solution && 
            <>
                <div className="form-group">
                    <label>Решение</label>
                    <input readOnly type="text" className="form-control" value={currTask.solution}  />
                </div>

                <div className="form-group">
                    <label>Комментарий преподавателя</label>
                    <input type="text" className="form-control" onChange={(e) => setTaskCommentary(e.target.value)} value={currTask.commentary ? currTask.commentary : taskCommentary} />
                </div>

                <div className="form-group">
                    <label>Оценка</label>
                    <Rating onClick={(rate) => setTaskRating(rate)} ratingValue={currTask.rating ? currTask.rating : taskRating} allowHalfIcon={true}  />
                </div>

                {!Array.isArray(currTask.solutionFile) ? <p className="form-control" >
                    <a target="blank" href={currTask.solutionFile}>
                        {currTask.solutionFileName || 'файл'}</a></p>
                        :
                        currTask.solutionFile.map((e,i) => {
                            return (
                                <p className="form-control" >
                                    
                                        <div className="file-edit">
                                        <a target="blank" href={e}> {currTask.solutionFileName[i] || 'файл'}   </a>
                                        </div>
                                  
                                </p>
                            )
                        })
                        }
            

            <button className="btn btn-success" onClick={(e) => handleCheck(e)}>Подтвердить выполнение задания</button>
            </>
            }
        
        </>
    )
}