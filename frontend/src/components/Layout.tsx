import '../reset.css';
import './Layout.css';
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Message from './Message.tsx';
import { UtensilsCrossed, House, RefrigeratorIcon, SearchIcon, Apple, CookingPot } from 'lucide-react';

function Layout() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div>
            <header>
                <button
                    className="menu-btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    ☰
                </button>
                <h1>MealMate</h1>
                <nav className={isOpen ? "open" : ""}>
                    <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "active" : ""}>
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
                </nav>
                {isOpen && <div className="overlay" onClick={closeMenu}></div>}
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
