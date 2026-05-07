import '../reset.css';
import '../css/Layout.css';
import { Outlet } from "react-router-dom";
import Message from './Message.tsx';
import TitleIcon from '../img/TitleIcon.svg';

function Layout() {

    return (
        <div>
            <header>
                <h1>
                    <img src={TitleIcon} alt="Title Icon" className='title-icon'/>
                </h1>
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout;
