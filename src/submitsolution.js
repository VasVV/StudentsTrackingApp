import {useState} from 'react';
import { Rating } from 'react-simple-star-rating'
import { getTasksList, addSolutionToDb, confirmTask } from './firebase';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { status } from './helpers';

export default function SubmitSolution({currTask, currUser, closeSecondModal, loadTasks}) {

    const [solution, setSolution] = useState('');

    const handleSubmitSolution = async e => {
        e.preventDefault();
        await addSolutionToDb(currUser.id, currTask.header, solution);
        await confirmTask(currUser.id, currTask.header, 'checking');
        loadTasks();
    }

  return (
<>
    <h2>Задание для студента {currUser.firstName} {currUser.lastName}</h2>
    <button type="button" class="btn btn-danger" onClick={closeSecondModal}>Закрыть</button>
    <form onSubmit={(e) => handleSubmitSolution(e)}>
      <div className="form-group">
        <label>Название задания</label>
        <input
          readOnly
          type="text"
          className="form-control"
          placeholder="Enter email"
          value={currTask.header}
        />
      </div>

      <div className="form-group">
        <label>Статус выполнения</label>
        <input
          type="text"
          readOnly
          className="form-control"
          placeholder="Enter email"
          value={status(currTask.status)}
        />
      </div>

      <div className="form-group">
        <label>Текст или ссылка на задание</label>
        <input
          readOnly
          type="text"
          className="form-control"
          placeholder="Enter email"
          value={currTask.text}
        />
      </div>

      {currTask.video ? (
        <div className="form-group">
          <label>Видео</label>
          <LiteYouTubeEmbed id={currTask.video} />
        </div>
      ) : (
        ""
      )}
      {currTask.fileName && (
        <div className="form-group">
          <label>Файл</label>
          <a href={currTask.attachedFile} className="form-control">
            Скачать {currTask.fileName}
          </a>
        </div>
      )}

      <div className="form-group">
        <label>Решение</label>
        <input
          type="text"
          className="form-control"
          placeholder="Введите решение"
          readOnly={currTask.status === 'toBeDone' ? false : true}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>
      {currTask.status == "completed" ? (
        <>
          <div className="form-group">
            <label>Комментарий преподавателя</label>
            <input
              readOnly
              type="text"
              className="form-control"
              value={currTask.commentary}
            />
          </div>

          <div className="form-group">
            <label>Оценка</label>
            <Rating
              ratingValue={currTask.rating}
              allowHalfIcon={true}
              readonly={true}
            />
          </div>
        </>
      ) : (
        ""
      )}
    { currTask.status === 'toBeDone' &&
      <button type="submit" className="btn btn-primary btn-block">
        Отправить решение на проверку
      </button>}
    </form>
</>
  );
}
