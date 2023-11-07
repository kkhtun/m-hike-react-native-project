import * as React from "react";
import { Appbar, useTheme } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { STACK, TABS } from "../constants";

const AppBar = ({ navigation, route, options, back }) => {
    const theme = useTheme();
    const routeConstant =
        STACK[route.name || ""] || TABS[route.name || ""] || {};
    const title = getHeaderTitle(options, routeConstant.display || "");
    return (
        <Appbar.Header
            style={{
                backgroundColor: theme.colors.elevation.level2,
            }}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title={`MHike | ${title}`} />
            {routeConstant.key === STACK.hikeForm.key ||
            routeConstant.key === STACK.settingsHome.key ? (
                <></>
            ) : (
                <Appbar.Action
                    icon="plus"
                    onPress={() => {
                        navigation.navigate(STACK.hikeForm.key);
                    }}
                />
            )}
        </Appbar.Header>
    );
};

export default AppBar;
