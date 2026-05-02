import '../reset.css';
import './Layout.css';
import { Outlet } from "react-router-dom";
import Message from './Message.tsx';
import { UtensilsCrossed } from 'lucide-react';

function Layout() {

    return (
        <div>
            <header>
                <h1><UtensilsCrossed className='h1-icon' /> MealMate<span>毎日の食事を，もっとかしこく</span></h1>
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;