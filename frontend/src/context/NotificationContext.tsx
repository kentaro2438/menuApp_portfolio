import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type NotificationContextType = {
    notification: { type: string; message: string };
    showNotification: (type: string, message: string) => void;
};

type NotificationProviderProps = {
    children: ReactNode;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationはNotificationProviderの内部で使用する必要があります");
    }
    return context;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const [notification, setNotification] = useState({ type: '', message: '' });
    const showNotification = (type: string, message: string) => {
        setNotification({ type, message });
    }
    useEffect(() => {
        if (notification.message) {
            const timer = setTimeout(() => {
                setNotification({ type: '', message: '' });
            }, 3000)
            return () => clearTimeout(timer);
        }
    }, [notification]);

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export { NotificationProvider, useNotification };

