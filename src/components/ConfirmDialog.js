import * as React from "react";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import ConfirmDialogContext from "../context/dialog.context";

const ConfirmDialog = () => {
    const confirmDialogContext = React.useContext(ConfirmDialogContext);

    const cancelDialog = () => {
        confirmDialogContext.clear();
    };

    const confirmDialog = () => {
        confirmDialogContext.clear();
        if (
            confirmDialogContext.callback &&
            confirmDialogContext.callback.callback
        )
            confirmDialogContext.callback.callback();
    };

    return (
        <Portal>
            <Dialog
                visible={!!confirmDialogContext.dialogText}
                onDismiss={cancelDialog}>
                <Dialog.Title>Confirm Action</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {confirmDialogContext.dialogText}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={cancelDialog}>Cancel</Button>
                    <Button onPress={confirmDialog}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ConfirmDialog;
