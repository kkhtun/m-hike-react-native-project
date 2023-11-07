import React from "react";
import { View } from "react-native";
import { hikeCardStyles, styleConstants } from "../theme/styles";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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

export default function HikeDetailCardContents({ hike = {} }) {
    return (
        <Card.Content>
            <View>
                <Text style={hikeCardStyles.name}>{hike.name}</Text>
                <Text style={hikeCardStyles.location}>{hike.location}</Text>
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
    );
}
