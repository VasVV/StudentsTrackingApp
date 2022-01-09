import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import {confirmTask, signUpUser} from './firebase';
import { onSignUp } from './email';
import { useHistory, Link } from 'react-router-dom';

export default function SignUp() {

    const dispatch = useDispatch();

    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState(false);

    

    const register = async() => {
        try {
            await signUpUser(email, password, firstName, lastName, phone);
            dispatch({type: 'ADD_CURR_USER', payload:
                 {
                     email,
                     password,
                     firstName,
                     lastName,
                     admin: false
                } 
                    });
            await onSignUp(email, password, firstName)
            setMessage(true);
                // history.push('/Dashboard');
        } catch(err) {
            setMessage("Error while creating user")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        register();
    }

        return (
            <div className="auth-wrapper">
            <div className="auth-inner">
            <form onSubmit={(e) => handleSubmit(e)}>
                <h3>Регистрация нового ученика</h3>
                {message ? <div className="alert alert-success" role="alert">
                    Вы успешно зарегистрировались
                </div> : ''}

                <div className="form-group">
                    <label>Имя</label>
                    <input type="text" className="form-control" placeholder="Введите свое имя" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Фамилия</label>
                    <input type="text" className="form-control" placeholder="Введите свою фамилию" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Номер телефона</label>
                    <input type="text" className="form-control" placeholder="Введите свой номер телефона" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" className="form-control" placeholder="Введите свой адрес электронной почты" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Пароль</label>
                    <input type="password" className="form-control" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="btn btn-primary w-100 btn-confirm">Зарегистрироваться</button>
                <p className="forgot-password text-right">
                    Уже зарегистрировались? <Link to={"/sign-in"}>Войдите здесь</Link>
                </p>
            </form>
            </div>
            </div>
        );
}

