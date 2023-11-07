import React, { useState, useEffect } from "react";
import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const CustomThemeContext = React.createContext({
    setIsDarkMode: () => {},
    isDarkMode: false,
    theme: MD3LightTheme,
});

const CustomThemeContextProvider = props => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [theme, setTheme] = useState(
        isDarkMode ? MD3DarkTheme : MD3LightTheme,
    );

    useEffect(() => {
        setTheme(isDarkMode ? MD3DarkTheme : MD3LightTheme);
    }, [isDarkMode]);

    return (
        <CustomThemeContext.Provider
            value={{
                theme,
                setIsDarkMode,
                isDarkMode,
            }}>
            {props.children}
        </CustomThemeContext.Provider>
    );
};

export { CustomThemeContextProvider };
export default CustomThemeContext;
