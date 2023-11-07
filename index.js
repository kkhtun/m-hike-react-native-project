/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { CustomThemeContextProvider } from "./src/context/theme.context";

function Main() {
    return (
        <CustomThemeContextProvider>
            <App />
        </CustomThemeContextProvider>
    );
}

AppRegistry.registerComponent(appName, () => Main);
