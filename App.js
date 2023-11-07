import React, { useContext } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Router from "./src/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { NotificationProvider } from "./src/context/snackbar.context";
import CustomSnackbar from "./src/components/CustomSnackbar";
import { ConfirmDialogProvider } from "./src/context/dialog.context";
import ConfirmDialog from "./src/components/ConfirmDialog";
import CustomThemeContext from "./src/context/theme.context";
function App() {
    const { theme } = useContext(CustomThemeContext);

    return (
        <SafeAreaProvider>
            <PaperProvider theme={theme}>
                <ConfirmDialogProvider>
                    <NotificationProvider>
                        <CustomSnackbar />
                        <ConfirmDialog />
                        <Router />
                    </NotificationProvider>
                </ConfirmDialogProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

export default App;
