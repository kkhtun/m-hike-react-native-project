import React, { useState } from "react";

const ConfirmDialogContext = React.createContext({
    dialogText: null,
    callback: {},
    open: () => {},
    clear: () => {},
});

const ConfirmDialogProvider = props => {
    const [dialogText, setDialogText] = useState(null);
    const [callback, setCallback] = useState({});

    const open = (text, callback = () => {}) => {
        setDialogText(text);
        setCallback({ callback });
    };

    const clear = () => {
        setDialogText("");
        setCallback({});
    };

    return (
        <ConfirmDialogContext.Provider
            value={{
                open,
                clear,
                callback,
                dialogText,
            }}>
            {props.children}
        </ConfirmDialogContext.Provider>
    );
};

export { ConfirmDialogProvider };
export default ConfirmDialogContext;
