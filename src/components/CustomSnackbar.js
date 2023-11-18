import React from "react";
import { useContext } from "react";
import NotificationContext from "../context/snackbar.context";
import { Snackbar, Portal, Icon } from "react-native-paper";

const CustomSnackbar = () => {
    const notificationCtx = useContext(NotificationContext);

    const onDismissSnackBar = () => {
        notificationCtx.clear();
    };

    return (
        <Portal>
            <Snackbar
                visible={!!notificationCtx.notification}
                onDismiss={onDismissSnackBar}
                duration={5000}
                action={{
                    label: "Close",
                    onPress: () => {
                        onDismissSnackBar();
                    },
                }}>
                {notificationCtx.notificationText}
            </Snackbar>
        </Portal>
    );
};

export default CustomSnackbar;
