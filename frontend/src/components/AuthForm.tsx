import '../reset.css'
import { Link } from 'react-router-dom';

type AuthFormProps = {
    formTitle: string;
    handle: (e: React.FormEvent<HTMLFormElement>) => void;
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    lucideIcon: React.ReactNode;
    buttonLabel: string;
};

function AuthForm({ formTitle, handle, username, setUsername, password, setPassword, lucideIcon, buttonLabel }: AuthFormProps) {
    return (
        <form action="" className='form-card' onSubmit={handle}>
            <h3>{formTitle}</h3>
            <div>
                <label>ユーザー名<br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ユーザー名を入力" /></label>
            </div>
            <div>
                <label>パスワード<br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワードを入力" /></label>
            </div>
            <button type="submit" className="btn">{lucideIcon}{buttonLabel}</button>
            {formTitle === "ログイン" ? (
                <p>アカウントをお持ちでない方は<Link to="/signup">こちら</Link></p>
            ) : (
                <p>すでにアカウントをお持ちの方は<Link to="/">こちら</Link></p>
            )}
        </form>
    )
}

export default AuthForm;