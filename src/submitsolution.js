import {useState, useEffect} from 'react';
import { Rating } from 'react-simple-star-rating'
import { getTasksList, addSolutionToDb, confirmTask, uploadFile } from './firebase';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import { status } from './helpers';
import {Recorder} from 'react-voice-recorder'
import 'react-voice-recorder/dist/index.css';
import { useRecordWebcam, CAMERA_STATUS } from 'react-record-webcam';
import { Oval } from 'react-loader-spinner';

export default function SubmitSolution({currTask, currUser, closeSecondModal, loadTasks}) {
  const recordWebcam = useRecordWebcam();

    const [solution, setSolution] = useState('');
    const [solutionFile, setSolutionFile] = useState(null);
    const [disableAfterAudio, setDisableAfterAudio] = useState(false);
    const [solutionUploading, setSolutionUploading] = useState(null);
    const [solutionUploaded, setSolutionUploaded] = useState(false);
    const [audioDetails, setAudioDetails] = useState({
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: null,
        m: null,
        s: null,
      }
      });

      useEffect(() => {
        setSolution(currTask.solution)
      }, [])

      const saveFile = async () => {
        const blob = await recordWebcam.getRecording();
        const name = Math.random().toString().substr(2, 8); 
        let newRecording = new File([blob], name, { type: 'audio/mp3' });
        let dt = new DataTransfer();
        dt.items.add(newRecording);
        let file_list = dt.files;
        setSolutionFile(file_list);
      };

    const handleAudioStop = (data) => {
      console.log(data)
      setAudioDetails({ audioDetails: data });
    }
    const handleAudioUpload = (file) => {
      if (file) {
        console.log(file);
        const name = Math.random().toString().substr(2, 8); 
        let newRecording = new File([file], name, { type: 'audio/mp3' });
        let dt = new DataTransfer();
        dt.items.add(newRecording);
        let file_list = dt.files;
        setSolutionFile(file_list);
        setDisableAfterAudio(true)
      }
      }
    const handleReset = () => {
      const reset = {
        url: null,
        blob: null,
        chunks: null,
        duration: {
        h: null,
        m: null,
        s: null,
        }
      }
      setAudioDetails({ audioDetails: reset });
      }


    const handleSubmitSolution = async e => {
        e.preventDefault();
        setSolutionUploading(true)

        if (solutionFile) {
          if (solutionFile.length  === 1) {
            let {downloadUrl, fileName} = await uploadFile(solutionFile);
            console.log('should be one', downloadUrl,fileName);
            await addSolutionToDb(currUser.id, currTask.header, solution, downloadUrl, fileName);
        } else {
            let {fileList, fileNames} = await uploadFile(solutionFile);
            console.log('why mult', solutionFile);
            await addSolutionToDb(currUser.id, currTask.header, solution, fileList, fileNames);
          }
        }
        else {
        await addSolutionToDb(currUser.id, currTask.header, solution);
        }
        await confirmTask(currUser.id, currTask.header, 'checking');
        loadTasks();
        setSolutionUploading(false)
        setSolutionUploaded(true);
    }

  return (
<>
    <h2>Задание для студента {currUser.firstName} {currUser.lastName}</h2>
    <button type="button" className="btn btn-danger" onClick={closeSecondModal}>Закрыть</button>
    {solutionUploaded && <div className="alert alert-success" role="alert">
                                    
                                    Решение отправлено!
                                    </div>}
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
      
     { currTask.fileName && <>
        {!Array.isArray(currTask.fileName) ? (
          <div className="form-group">
            <label>Файл</label>
            <a href={currTask.attachedFile} className="form-control">
              Скачать {currTask.fileName}
            </a>
          </div>
        ): currTask.attachedFile.map((e,i) => {
          return (
              <p className="form-control" >
              <a target="blank" href={e}>
                  {currTask.fileName[i] || 'файл'}</a></p>
          )
      })
      }
    </>}
      <div className="form-group">
        <label>Решение</label>
        <input
          type="text"
          className="form-control"
          placeholder="Введите решение"
          readOnly={currTask.status === 'toBeDone' ? false : true}
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          required
        />
      </div>
      {currTask.status === 'toBeDone' && <div className="form-group">
        <label>Приложить файл решения</label>
        <input
          type="file"
          className="form-control"
          placeholder="Введите решение"
          readOnly={currTask.status === 'toBeDone' ? false : true}
          onChange={(e) => setSolutionFile(e.target.files)}
          multiple
          disabled={disableAfterAudio}
        />
      </div>}

      {(currTask.solutionFile && currTask.status !== 'toBeDone') && <div className="form-group">
      <label>Файл(ы) решения</label>
        {!Array.isArray(currTask.solutionFile) ? (
        <>
         
            <a href={currTask.solutionFile} className="form-control">
              Скачать {currTask.solutionFileName}
            </a>
        </>
      ): currTask.solutionFile.map((e,i) => {
        return (
            <p className="form-control" >
            <a target="blank" href={e}>
                {currTask.solutionFileName[i] || 'файл'}</a></p>
        )
    })}
      </div>}
      
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
        {solutionUploading && <Oval height={20} width={20} />} {!solutionUploading ? 'Отправить решение на проверку' : 'Решение отправляется...'}
      </button>}
    </form>
    {currTask.status === 'toBeDone' && <div className="audio-video">
      <div className="form-group">
          <label>Приложить аудиозапись</label>
          <ol>
          <li> Нажимаем кнопку записи (красную с микрофоном) </li>
          <li> После окончания записи нажимаем на красную кнопку с квадратом </li>
          <li> Нажимаем на кнопку Upload </li>
          </ol>
          <Recorder
            record={true}
            title={"Новая запись"}
            audioURL={audioDetails.url}
            showUIAudio
            handleAudioStop={data => handleAudioStop(data)}
            handleAudioUpload={data =>handleAudioUpload(data)}
            handleRest={() => handleReset()}
            mimeTypeToUseWhenRecording={'audio/webm'}
            />
        </div>
        <div className="form-group">
        <label>Приложить видеозапись</label>
          <ol>
            <li>Нажимаем кнопку старт, разрешаем доступ к камере</li>
            <li>Когда появляется видео, нажимаем "Начать запись"</li>
            <li>После записи нажимаем "Остановить запись"</li>
            <li>Нажимаем на кнопку "Загрузить видео"</li>
          </ol>
        <p>Camera status: {recordWebcam.status}</p>
        <button onClick={recordWebcam.open}>СТАРТ</button>
        <button onClick={recordWebcam.start}>Начать запись</button>
        <button onClick={recordWebcam.stop}>Остановить запись</button>
        <button onClick={recordWebcam.retake}>Записать видео заново</button>
        <button onClick={saveFile}>Загрузить видео</button>
        <video ref={recordWebcam.webcamRef} autoPlay muted />
        <video ref={recordWebcam.previewRef} autoPlay muted loop />
      </div>
    </div>}
</>
  );
}
