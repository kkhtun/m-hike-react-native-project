import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Surface, Switch, Text, useTheme } from "react-native-paper";
import { commonStyles, styleConstants } from "../theme/styles";
import CustomThemeContext from "../context/theme.context";
import { Database, clearAllHikes } from "../helpers/database";
import NotificationContext from "../context/snackbar.context";
import ConfirmDialogContext from "../context/dialog.context";
import { TABS } from "../constants";

function Settings({ navigation }) {
    const { setIsDarkMode, isDarkMode } = React.useContext(CustomThemeContext);
    const confirmDialogContext = React.useContext(ConfirmDialogContext);
    const notification = React.useContext(NotificationContext);

    const onToggleSwitch = e => {
        setIsDarkMode(!!e);
    };

    const deleteAllHikesCallback = async () => {
        try {
            const database = await Database.getDatabase();
            await clearAllHikes(database);
            notification.success("Hikes cleared successfully");
            return navigation.reset({
                index: 0,
                routes: [{ name: TABS.settings.key }],
            });
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
        }
    };

    return (
        <ScrollView style={commonStyles.appContainer}>
            <Surface
                elevation={2}
                style={{
                    padding: styleConstants.spacing.medium,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: styleConstants.spacing.medium,
                }}>
                <Text style={{ fontSize: styleConstants.fontSize.medium }}>
                    Dark Mode
                </Text>
                <Switch onValueChange={onToggleSwitch} value={isDarkMode} />
            </Surface>

            <Surface
                elevation={2}
                style={{
                    padding: styleConstants.spacing.medium,
                }}>
                <Button
                    icon="trash-can-outline"
                    mode="outlined"
                    textColor={useTheme().colors.error}
                    contentStyle={{
                        flexDirection: "row-reverse",
                    }}
                    onPress={e =>
                        confirmDialogContext.open(
                            "Are you sure you want to clear all hikes in the database?",
                            async () => {
                                await deleteAllHikesCallback();
                            },
                        )
                    }>
                    <Text style={{ fontSize: styleConstants.fontSize.small }}>
                        Remove All Hikes
                    </Text>
                </Button>
            </Surface>

            {/* <Button
                mode="text"
                onPress={e =>
                    confirmDialogContext.open(
                        "Are you sure you want to delete this hike?",
                        async () => {
                            await deleteHikeCallback({
                                hikeId: hike._id,
                            });
                            navigation.navigate(STACK.hikeList.key);
                        },
                    )
                }>
                Delete
            </Button> */}
        </ScrollView>
    );
}

export default Settings;
