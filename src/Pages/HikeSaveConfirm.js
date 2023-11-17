import React, { useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { commonStyles, hikeCardStyles } from "../theme/styles";
import { Button, Card } from "react-native-paper";
import { Database, saveHike } from "../helpers/database";
import { STACK } from "../constants";
import NotificationContext from "../context/snackbar.context";
import HikeDetailCardContents from "../components/HikeDetailCardContents";

function HikeSaveConfirm({ route, navigation }) {
    const { hike } = route?.params || {};
    const notification = useContext(NotificationContext);

    const onConfirmSaveHike = async () => {
        try {
            const database = await Database.getDatabase();
            const result = await saveHike(database, hike);
            const operation = result[0];
            if (operation.rowsAffected > 0) {
                notification.success("Hike saved successfully");
                return navigation.reset({
                    index: 0,
                    routes: [{ name: STACK.hikeList.key }],
                });
            }
            throw new Error("Something went wrong during saving hike");
        } catch (error) {
            notification.error(error.message);
            console.log(error.message);
        }
    };

    if (!hike) return <></>;

    return (
        <ScrollView style={commonStyles.appContainer}>
            <Card style={hikeCardStyles.cardParent}>
                <HikeDetailCardContents hike={hike} />
                <Card.Actions>
                    <Button mode="text" onPress={e => navigation.goBack()}>
                        Back
                    </Button>
                    <Button onPress={e => onConfirmSaveHike()}>Confirm</Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
}

export default HikeSaveConfirm;
