import { useNotification } from "../context/NotificationContext";

function Message() {
    const { notification } = useNotification();

    if (!notification.message) return null;

    return (
        <div className={`message ${notification.type}`}>{notification.message}</div>
    )
};

export default Message;
