import '../reset.css';
import '../css/Layout.css';
import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from './Message.tsx';
import { getUser, logout } from '../api/api.js';
import TitleIcon from '../img/TitleIcon.png';
import { useNotification } from '../context/NotificationContext.tsx';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

function Layout() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const closeMenu = () => {
        setIsOpen(false);
    };

    const fetchGetUser = async () => {
        const data = await getUser();
        setUsername(data.username);
        return data;
    }

    //ログアウト
    const fetchLogout = async () => {
        try {
            await logout();
            showNotification("success", "ログアウトしました");
            navigate("/");
        } catch (error: any) {
            showNotification("error", error.message);
        }
    };

    useEffect(() => {
        fetchGetUser();
    }, []);

    return (
        <div>
            <header>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={isOpen ? "menu-btn open-color" : "menu-btn"}
                >
                    ☰
                </button>
                <h1>
                    <img src={TitleIcon} alt="Title Icon" className='title-icon' />
                    <p className='username for-pc'>ようこそ，<span>{username}</span>さん</p>
                    <button onClick={fetchLogout} className='logout-btn for-pc'>
                        <LogOut />
                    </button>
                </h1>
                <div className="title-area">
                    <nav className={isOpen ? "open" : ""}>
                        <p className='username for-mb'>ようこそ，<span>{username}</span>さん</p>
                        
                        <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            ホーム
                        </NavLink>
                        <NavLink to="/refrigerator" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            冷蔵庫
                        </NavLink>
                        <NavLink to="/search" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            検索
                        </NavLink>
                        <NavLink to="/list_ing" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            材料
                        </NavLink>
                        <NavLink to="/list_dish" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            料理
                        </NavLink>
                        <NavLink to="/shopping" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            買い物リスト
                        </NavLink>
                        <button onClick={fetchLogout} className='logout-btn for-mb'>
                            <LogOut />
                        </button>
                    </nav>
                </div>
                {isOpen && <div className="overlay" onClick={closeMenu}></div>}
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
