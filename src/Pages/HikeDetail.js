import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { commonStyles, hikeCardStyles } from "../theme/styles";
import { Button, Card } from "react-native-paper";
import { Database, deleteHike, getHike } from "../helpers/database";
import { STACK } from "../constants";
import ConfirmDialogContext from "../context/dialog.context";
import NotificationContext from "../context/snackbar.context";
import HikeDetailCardContents from "../components/HikeDetailCardContents";

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
            return navigation.reset({
                index: 0,
                routes: [{ name: STACK.hikeList.key }],
            });
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
        }
    };

    if (!hike) return <></>;

    return (
        <ScrollView style={commonStyles.appContainer}>
            <Card style={hikeCardStyles.cardParent}>
                <HikeDetailCardContents hike={hike} />
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
