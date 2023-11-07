import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { commonStyles, hikeCardStyles, styleConstants } from "../theme/styles";
import { Button, Card, Divider, Text, useTheme } from "react-native-paper";
import { Database, deleteHike, getHike } from "../helpers/database";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { STACK } from "../constants";
import ConfirmDialogContext from "../context/dialog.context";
import NotificationContext from "../context/snackbar.context";

function BodyDataField({ muiIconName, text }) {
    const theme = useTheme();
    return (
        <View style={hikeCardStyles.bodyDataView}>
            <MaterialCommunityIcons
                name={muiIconName}
                size={styleConstants.spacing.large}
                color={theme.colors.primary}
            />
            <Text style={hikeCardStyles.bodyDataText}>{text || ""}</Text>
        </View>
    );
}

function HikeDetail({ route, navigation }) {
    const { hikeId } = route?.params || {};
    const [hike, setHike] = useState({});
    const confirmDialogContext = useContext(ConfirmDialogContext);
    const notification = useContext(NotificationContext);

    const getHikeDetail = async ({ hikeId }) => {
        try {
            const database = await Database.getDatabase();
            const data = await getHike(database, { hikeId });
            setHike(data);
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
        }
    };

    useEffect(() => {
        navigation.addListener("focus", () => {
            getHikeDetail({ hikeId });
        });
    }, [hikeId, navigation]);

    const deleteHikeCallback = async ({ hikeId }) => {
        try {
            const database = await Database.getDatabase();
            const deletedCount = await deleteHike(database, { hikeId });
            if (deletedCount !== 1)
                throw new Error("Something went wrong during deletion");
            notification.success("Hike deleted Successfully");
            navigation.navigate(STACK.hikeList.key, { refresh: true });
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
        }
    };

    if (!hike) return <></>;

    return (
        <ScrollView style={commonStyles.appContainer}>
            <Card style={hikeCardStyles.cardParent}>
                <Card.Content>
                    <View>
                        <Text style={hikeCardStyles.name}>{hike.name}</Text>
                        <Text style={hikeCardStyles.location}>
                            {hike.location}
                        </Text>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            <Text style={hikeCardStyles.date}>{hike.date}</Text>
                            <Text style={hikeCardStyles.durationInHours}>
                                {hike.durationInHours}h
                            </Text>
                        </View>
                    </View>
                    <Divider style={hikeCardStyles.divider} />
                    <View>
                        <BodyDataField
                            muiIconName="car-brake-parking"
                            text={
                                hike.isParkingAvailable
                                    ? "Parking Available"
                                    : "No Parking Available"
                            }
                        />
                        <BodyDataField
                            muiIconName="clock-time-five-outline"
                            text={hike.durationInHours + " hours"}
                        />
                        <BodyDataField
                            muiIconName="arrow-right-thin"
                            text={hike.distance + " " + hike.distanceUnit}
                        />
                        <BodyDataField
                            muiIconName="chart-areaspline-variant"
                            text={hike.difficultyLevel + " / 10"}
                        />
                        <BodyDataField
                            muiIconName="card-text-outline"
                            text={hike.description || "-"}
                        />
                        <BodyDataField
                            muiIconName="star-outline"
                            text={hike.rating + " / 5"}
                        />
                    </View>
                    <Divider style={hikeCardStyles.divider} />
                </Card.Content>
                <Card.Actions>
                    <Button
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
                    </Button>
                    <Button
                        onPress={e =>
                            navigation.navigate(STACK.hikeForm.key, { hikeId })
                        }>
                        Edit
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}

export default HikeDetail;
