import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { confirmTask } from './firebase';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import {status} from './helpers';

export default function CheckTask({currTask, studentData, closeModal, getTasks}) {


    const [taskCommentary, setTaskCommentary] = useState('');
    const [taskRating, setTaskRating] = useState(0);

    
    const handleCheck = async e => {
        e.preventDefault();
        await confirmTask(studentData.id, currTask.header,'completed', taskRating, taskCommentary);
        getTasks();
    }

    return (
        <>
        <h2>Задание для студента {studentData.firstName} {studentData.lastName}</h2>
        <button type="button" class="btn btn-danger" onClick={closeModal}>Закрыть</button>
        <form onSubmit={(e) => handleCheck(e)}>
            <div className="form-group">
                <label>Название задания</label>
                <input type="text" readOnly className="form-control"  value={currTask.header}  />
            </div>

            <div className="form-group">
                <label>Статус выполнения</label>
                <input type="text" readOnly className="form-control"  value={status(currTask.status)} />
            </div>

            <div className="form-group">
                <label>Текст или ссылка на задание</label>
                <input readOnly type="text" className="form-control" value={currTask.text} />
            </div>
                {currTask.video &&
            <div className="form-group">
                <label>Видео</label>
                <LiteYouTubeEmbed 
                    id={currTask.video}
                />
            </div> }

            {currTask.attachedFile == 'false' ?
                <div className="form-group">
                <label>Файл</label>
                <input readOnly type="file" className="form-control"   />
            </div> : ''}

            {currTask.solution && <div className="form-group">
                <label>Решение</label>
                <input readOnly type="text" className="form-control" value={currTask.solution}  />
            </div>}

            <div className="form-group">
                <label>Комментарий преподавателя</label>
                <input type="text" className="form-control" onChange={(e) => setTaskCommentary(e.target.value)} value={currTask.commentary ? currTask.commentary : taskCommentary} />
            </div>

            <div className="form-group">
                <label>Оценка</label>
                <Rating onClick={(rate) => setTaskRating(rate)} ratingValue={currTask.rating ? currTask.rating : taskRating} allowHalfIcon={true}  />
            </div>

            <button type="submit" className="btn btn-success">Подтвердить выполнение задания</button>
        </form>
        </>
    )
}