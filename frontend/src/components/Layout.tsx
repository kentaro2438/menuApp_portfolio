import '../reset.css';
import './Layout.css';
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

function Layout() {
    return (
        <div>
            <header>
                <h1>MealMate</h1>
                <nav>
                    <Link to="/">ホーム</Link>
                    <Link to="/search">検索</Link>
                    <Link to="/list_ing">材料</Link>
                    <Link to="/list_dish">料理</Link>
                </nav>
            </header>
            <Outlet />
        </div>
    )
};

export default Layout;
