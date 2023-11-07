const { StyleSheet } = require("react-native");

export const commonStyles = StyleSheet.create({
    appContainer: {
        padding: 16,
    },
    formElement: {
        marginBottom: 32,
        height: 60,
    },
    fillHeight: {
        height: 60,
    },
});

export const styleConstants = {
    spacing: {
        extraSmall: 4,
        small: 8,
        medium: 16,
        large: 32,
    },
    fontSize: {
        small: 16,
        medium: 20,
        large: 26,
    },
    iconColor: "black",
};

export const hikeCardStyles = StyleSheet.create({
    cardParent: {
        padding: styleConstants.spacing.medium,
    },
    name: {
        fontSize: styleConstants.fontSize.large,
        marginBottom: styleConstants.spacing.extraSmall,
    },
    location: {
        fontSize: styleConstants.fontSize.medium,
        marginBottom: styleConstants.spacing.extraSmall,
    },
    date: {
        fontSize: styleConstants.fontSize.small,
        fontWeight: "300",
        fontStyle: "italic",
    },
    durationInHours: {
        fontSize: styleConstants.fontSize.small,
    },
    divider: {
        marginVertical: styleConstants.spacing.medium,
    },
    bodyDataView: {
        marginBottom: styleConstants.spacing.medium,
        display: "flex",
        flexDirection: "row",
    },
    bodyDataText: {
        fontSize: styleConstants.fontSize.medium,
        marginLeft: styleConstants.spacing.small,
    },
});
