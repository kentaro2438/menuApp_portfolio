//css
import '../reset.css';
//react
import { useState } from 'react';
//api
import { login } from '../api/api.js';
//components
import AuthForm from '../components/AuthForm.tsx';
//context
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';
//icons
import { User } from 'lucide-react';

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    
    const handleLogin = async (e: any) => {
        e.preventDefault();
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        if (!trimmedUsername) {
            showNotification("error", "ユーザー名を入力してください");
            return;
        }
        if (!trimmedPassword) {
            showNotification("error", "パスワードを入力してください");
            return;
        }
        try {
            await login(trimmedUsername, trimmedPassword);
            showNotification("success", "ログインしました");
            setUsername("");
            setPassword("");
            navigate("/home"); 
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    };

    return (
        <div className="main login-page">
            <h2><User className='h2-icon' />ログイン</h2>
            <hr />
            <AuthForm
                formTitle="ログイン"
                handle={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                lucideIcon={<User className='icon-in-btn' />}
                buttonLabel="ログイン"
            />
        </div>
    );
}

export default Login;