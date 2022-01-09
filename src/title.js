import {useDispatch} from 'react-redux';


export default function Title() {
    const dispatch = useDispatch();

    return (
        <div className="title-div">
        <p className="title">Чат</p>
        <button className="btn btn-success" onClick={() => dispatch({type: 'UPDATE_CHAT'})}>Обновить чат</button>
        </div>
    )
}