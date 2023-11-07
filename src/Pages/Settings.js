import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Surface, Switch, Text } from "react-native-paper";
import { commonStyles, styleConstants } from "../theme/styles";
import CustomThemeContext from "../context/theme.context";

function Settings({}) {
    const { setIsDarkMode, isDarkMode } = React.useContext(CustomThemeContext);
    const onToggleSwitch = e => {
        setIsDarkMode(!!e);
    };
    return (
        <ScrollView style={commonStyles.appContainer}>
            <Surface
                elevation={2}
                style={{
                    ...commonStyles.formElement,
                    padding: styleConstants.spacing.medium,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                <Text style={{ fontSize: styleConstants.fontSize.medium }}>
                    Dark Mode
                </Text>
                <Switch onValueChange={onToggleSwitch} value={isDarkMode} />
            </Surface>
        </ScrollView>
    );
}

export default Settings;
