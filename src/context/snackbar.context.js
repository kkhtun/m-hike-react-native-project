import React, { useState } from "react";

const STATES = {
    SUCCESS: "success",
    ERROR: "error",
};

const NotificationContext = React.createContext({
    notification: null,
    notificationText: null,
    success: () => {},
    error: () => {},
});

const NotificationProvider = props => {
    const [notification, setNotification] = useState(null);
    const [notificationText, setNotificationText] = useState(null);
    const success = text => {
        setNotificationText(text);
        setNotification(STATES.SUCCESS);
    };
    const error = text => {
        setNotificationText(text);
        setNotification(STATES.ERROR);
    };
    const clear = () => {
        setNotificationText(null);
        setNotification(null);
    };
    return (
        <NotificationContext.Provider
            value={{
                success,
                error,
                clear,
                notification,
                notificationText,
            }}>
            {props.children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider };
export default NotificationContext;
