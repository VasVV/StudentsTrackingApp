
import { useState } from "react";
import { resetPassword } from './firebase';

export default function PasswordReset() {

    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const sendResetEmail = async() => {
        try {
            await resetPassword(email)
            } catch(err) {
            setMessage("Проверьте правильность ввода адреса электронной почты")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendResetEmail();
    }

        return (
            <div className="auth-wrapper">
        <div className="auth-inner">
            <form onSubmit={(e) => handleSubmit(e)}>
                <h3>Сброс пароля</h3>

                <div className="form-group">
                    <label>E-mail</label>
                    <input type="email" className="form-control" placeholder="Введите свой адрес электронной почты" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary btn-block w-100 btn-confirm">Сбросить пароль</button>
                
            </form>
            </div>
            </div>
        );
};
