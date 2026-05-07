import '../reset.css';
import '../css/Layout.css';
import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import Message from './Message.tsx';
import { House, RefrigeratorIcon, SearchIcon, Apple, CookingPot, ShoppingCart } from 'lucide-react';
import { getUser } from '../api/api.js';
import TitleIcon from '../img/TitleIcon.svg';

function Layout() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");

    const closeMenu = () => {
        setIsOpen(false);
    };

    const fetchGetUser = async () => {
        const data = await getUser();
        setUsername(data.username);
        return data;
    }

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
                    <img src={TitleIcon} alt="Title Icon" className='title-icon'/>
                </h1>
                <div className="title-area">
                    <nav className={isOpen ? "open" : ""}>
                        <NavLink to="/home" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <House className='nav-icon' /> ホーム
                        </NavLink>
                        <NavLink to="/refrigerator" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <RefrigeratorIcon className='nav-icon' /> 冷蔵庫
                        </NavLink>
                        <NavLink to="/search" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <SearchIcon className='nav-icon' /> 検索
                        </NavLink>
                        <NavLink to="/list_ing" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <Apple className='nav-icon' /> 材料
                        </NavLink>
                        <NavLink to="/list_dish" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <CookingPot className='nav-icon' /> 料理
                        </NavLink>
                        <NavLink to="/shopping" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
                            <ShoppingCart className='nav-icon' /> 買い物リスト
                        </NavLink>
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
