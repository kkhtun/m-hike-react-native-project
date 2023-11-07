import React from "react";
import { Text } from "react-native-paper";
import { View } from "react-native";
import { styleConstants } from "../theme/styles";

export default function EmptyComponent() {
    return (
        <View
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: styleConstants.spacing.large,
            }}>
            <Text style={{ fontSize: styleConstants.fontSize.small }}>
                The list is empty
            </Text>
        </View>
    );
}
