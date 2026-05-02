type AuthFormProps = {
    handle: (e: React.FormEvent<HTMLFormElement>) => void;
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    buttonLabel: string;
};

function AuthForm({ handle, username, setUsername, password, setPassword, buttonLabel }: AuthFormProps) {
    return (
        <form action="" className='form-card' onSubmit={handle}>
            <div>
                <label htmlFor="">ユーザー名<br />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ユーザー名" /></label>
            </div>
            <div>
                <label htmlFor="">パスワード<br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="パスワード" /></label>
            </div>
            <button type="submit">{buttonLabel}</button>
        </form>
    )
}

export default AuthForm;