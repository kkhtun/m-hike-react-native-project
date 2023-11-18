import React, { useEffect, useCallback } from "react";
import Hikes from "./Pages/Hikes";
import Settings from "./Pages/Settings";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppBar from "./components/AppBar";
import HikeForm from "./Pages/HikeForm";
import { STACK, TABS } from "./constants";
import { Database, syncTableHikes, dropDatabase } from "./helpers/database";
import HikeDetail from "./Pages/HikeDetail";
import { useTheme } from "react-native-paper";
import HikeSaveConfirm from "./Pages/HikeSaveConfirm";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function HikesStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={STACK.hikeList.key}
            screenOptions={{
                header: props => <AppBar {...props} />,
            }}>
            <Stack.Screen name={STACK.hikeList.key} component={Hikes} />
            <Stack.Screen name={STACK.hikeForm.key} component={HikeForm} />
            <Stack.Screen name={STACK.hikeDetail.key} component={HikeDetail} />
            <Stack.Screen
                name={STACK.hikeSaveConfirm.key}
                component={HikeSaveConfirm}
            />
        </Stack.Navigator>
    );
}

function SettingsStackNavigator() {
    return (
        <Stack.Navigator
            initialRouteName={STACK.settingsHome.key}
            screenOptions={{
                header: props => <AppBar {...props} />,
            }}>
            <Stack.Screen name={STACK.settingsHome.key} component={Settings} />
        </Stack.Navigator>
    );
}

function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName={TABS.hikes.key}
            screenOptions={({ route }) => {
                return {
                    header: props => <AppBar {...props} />,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let rn = route.name;

                        if (rn === TABS.hikes.key) {
                            iconName = "hiking";
                        } else if (rn === TABS.settings.key) {
                            iconName = "application-settings";
                        }
                        return (
                            <MaterialCommunityIcons
                                name={iconName}
                                size={32}
                                color={color}
                            />
                        );
                    },
                };
            }}>
            <Tab.Screen name={TABS.hikes.key} component={HikesStackNavigator} />
            <Tab.Screen
                name={TABS.settings.key}
                component={SettingsStackNavigator}
            />
        </Tab.Navigator>
    );
}

function Router({}) {
    const initializeDatabase = useCallback(async () => {
        try {
            const database = await Database.getDatabase();
            await syncTableHikes(database);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        initializeDatabase();
    }, [initializeDatabase]);

    return (
        <NavigationContainer theme={useTheme()}>
            <TabNavigator />
        </NavigationContainer>
    );
}

export default Router;
