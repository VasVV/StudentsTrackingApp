
import { useState } from "react";
import { signInUser } from './firebase';
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";


export default function Login() {

    const dispatch = useDispatch();
    const history = useHistory();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const signIn = async() => {
        try {
            console.log('fired')
           const user = await signInUser(email, password);
           console.log('admin')
           console.log(user);

            dispatch({type: 'ADD_CURR_USER', payload:
                 {
                     email: user.email,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     admin: user.admin,
                     id: user.id
                } 
                    });
            if (user.admin) {
                history.push('/Dashboard');
                    }
            else {
                history.push('/dashboard-student');
            }
        } catch(err) {
            setMessage("Error while signin")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn();
    }

        return (
            <div className="auth-wrapper">
        <div className="auth-inner">
            <form onSubmit={(e) => handleSubmit(e)}>
                <h3>Войти</h3>

                <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" className="form-control" placeholder="Введите свой адрес электронной почты" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Пароль</label>
                    <input type="password" className="form-control" placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button type="submit" className="btn btn-primary btn-block w-100 btn-confirm">Войти</button>
                <p className="forgot-password text-right">
                     <Link to={'/password-reset'}> Забыли пароль? </Link>
                </p>
            </form>
            </div>
            </div>
        );
};
