import '../reset.css';
import { useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { User } from 'lucide-react';
import { login } from '../api/api.js';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';

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
            <h2><User className='h2-icon' /> ログイン</h2>
            <hr />
            <AuthForm
                handle={handleLogin}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                buttonLabel="ログイン"
            />
        </div>
    );
}

export default Login;