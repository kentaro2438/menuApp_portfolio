import '../reset.css';
import { useState } from 'react';
import AuthForm from '../components/AuthForm.tsx';
import { UserPlus } from 'lucide-react';
import { signUp } from '../api/api.js';
import { useNotification } from '../context/NotificationContext.tsx';

function SignUp() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { showNotification } = useNotification();


    const handleSignUp = async (e: any) => {
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
            await signUp(trimmedUsername, trimmedPassword);
            showNotification("success", "サインアップしました");
            setUsername("");
            setPassword("");
        } catch (error: any) {
            showNotification("error", error.message);
            return;
        }
    };


    return (
        <div className="main signup-page">
            <h2><UserPlus className='h2-icon' /> サインアップ</h2>
            <hr />
            <AuthForm
                handle={handleSignUp}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                buttonLabel="サインアップ"
            />
        </div>
    );
}

export default SignUp;