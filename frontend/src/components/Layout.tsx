import '../reset.css';
import './Layout.css';
import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import Message from './Message.tsx';

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
                </nav>
                {isOpen && <div className="overlay" onClick={closeMenu}></div>}
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
