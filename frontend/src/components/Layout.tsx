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
                    <Link to="/">Home</Link>
                    <Link to="/search">Search</Link>
                    <Link to="/list_ing">Ingredients</Link>
                    <Link to="/list_dish">Dishes</Link>
                </nav>
            </header>
            <Outlet />
        </div>
    )
};

export default Layout;
