import '../reset.css';
import { Outlet } from "react-router-dom";
import Message from './Message.tsx';
import TitleIcon from '../img/TitleIcon.svg';
import TitleIconForMb from '../img/TitleIcon_for_mb.svg';

function Layout2() {

    return (
        <div>
            <header>
                <h1>
                    <img src={TitleIcon} alt="Title Icon" className='title-icon'/>
                    <img src={TitleIconForMb} alt="Title Icon for Mobile" className='title-icon-for-mb' />
                </h1>
            </header>
            <Outlet />
            <Message />
        </div>
    );
}

export default Layout2;
