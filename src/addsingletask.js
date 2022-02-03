import { useState } from 'react';
import { Oval } from 'react-loader-spinner';
import { addTaskToDb, uploadFile } from './firebase';
import { onAddTask } from './email';

export default function AddSingleTask({firstName, lastName, currId, email, closeModal, getTasks, forAll}) {

    const [taskText, setTaskText] = useState('');
    const [taskFile, setTaskFile] = useState('');
    const [taskHeader, setTaskHeader] = useState('');
    const [taskVideo, setTaskVideo] = useState('');
    const [taskUploading, setTaskUploading] = useState(null);
    const [taskUploaded, setTaskUploaded] = useState(false);

    const handleTaskSubmitForAll =  async (e) => {
        e.preventDefault();
        setTaskUploading(true);
        if (taskFile) {
        let {downloadUrl, fileName} = await uploadFile(taskFile);
    
            await addTaskToDb(false, taskText, downloadUrl, fileName, taskHeader, taskVideo);
        } else {
            let downloadUrl = false;
            let fileName = false;
            await addTaskToDb(false, taskText, downloadUrl, fileName, taskHeader, taskVideo);
        }
        
       //TODO: Рассылка писем всем
        setTaskUploading(false);
        setTaskUploaded(true);
        getTasks();
        setTaskHeader('');
        setTaskVideo('');
        setTaskText('');
        setTaskFile('');  
    } 

    const handleTaskSubmit = async(e) => {
        e.preventDefault();
        setTaskUploading(true);
        if (taskFile) {
            
        let {downloadUrl, fileName} = await uploadFile(taskFile);
            console.log(downloadUrl);
            console.log('FILENAME', fileName);
            await addTaskToDb(currId, taskText, downloadUrl, fileName, taskHeader, taskVideo);
            
        }
        else {
            let downloadUrl = false;
            let fileName = false;
            await addTaskToDb(currId, taskText, downloadUrl, fileName, taskHeader, taskVideo);
        }
        await onAddTask(email, firstName, taskHeader);
        setTaskUploading(false);
        setTaskUploaded(true);
        getTasks();
        setTaskHeader('');
        setTaskVideo('');
        setTaskText('');
        setTaskFile('');
    }

    const handleSetTaskVideo = (url) => {
        const re = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
        const id = re.exec(url)[1];
        setTaskVideo(id);
    }

    return (
        <>
            <h2 > Добавить задание для {firstName ? ` студента ${firstName} ${lastName}` : `всего курса`} </h2>
            <button type="button" class="btn btn-danger" onClick={closeModal}>Закрыть</button>
            {taskUploaded && <div class="alert alert-success" role="alert">
                                    
                                    Задание добавлено успешно!
                                    </div>}
            <form onSubmit={(e) => !forAll ? handleTaskSubmit(e) : handleTaskSubmitForAll(e)}>

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

                <button type="submit" className="btn btn-primary btn-block btn-loading" > 
                    {taskUploading && <Oval height={20} width={20} />}
                    <div>{!taskUploading ? 'Добавить задание' : ` Задание добавляется...`}</div>
                </button>

            </form>
        </>
    )
}