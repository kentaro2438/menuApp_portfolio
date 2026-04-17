import '../reset.css';
import './Layout.css';
import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

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
                    <Link to="/" onClick={closeMenu}>ホーム</Link>
                    <Link to="/search" onClick={closeMenu}>検索</Link>
                    <Link to="/list_ing" onClick={closeMenu}>材料</Link>
                    <Link to="/list_dish" onClick={closeMenu}>料理</Link>
                </nav>

                {isOpen && <div className="overlay" onClick={closeMenu}></div>}
            </header>

            <Outlet />
        </div>
    );
}

export default Layout;
