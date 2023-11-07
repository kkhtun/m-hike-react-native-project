import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Database, getHikes } from "../helpers/database";
import NotificationContext from "../context/snackbar.context";
import { ActivityIndicator, Text } from "react-native-paper";
import { hikeCardStyles } from "../theme/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STACK } from "../constants";

function Hikes({ navigation, route }) {
    const { refresh = false } = route?.params || {};

    const [hikes, setHikes] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [lastSkip, setLastSkip] = useState(skip);
    const [isLoading, setIsLoading] = useState(false);
    const notification = useContext(NotificationContext);

    const getPaginatedHikes = async ({ skip = 0 } = {}) => {
        setIsLoading(true);
        try {
            const database = await Database.getDatabase();
            const { data, count } = await getHikes(database, { skip });

            // Fake Data
            // const count = 50;
            // const data = [];
            // for (let i = 0; i < 10 && skip < count; i++) {
            //     const fakeId = i + skip;
            //     data.push({ _id: fakeId, name: `Test ${fakeId}` });
            // }
            setIsLoading(false);
            return { count, data };
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (refresh) {
            setSkip(0);
            setLastSkip(0);
        }
    }, [refresh]);

    useEffect(() => {
        getPaginatedHikes({ skip }).then(({ data, count }) => {
            setCount(count);
            if (skip === 0) return setHikes(data);
            if (skip === lastSkip) return setLastSkip(skip);
            return setHikes(hikes => [...hikes, ...data]);
        });
    }, [skip]);

    const ListEndLoader = () => {
        if (isLoading) {
            return <ActivityIndicator size={"large"} />;
        }
    };

    const renderItem = ({ item }) => {
        const { name, _id, location, date, durationInHours } = item;
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate(STACK.hikeDetail.key, { hikeId: _id })
                }>
                <View
                    style={{
                        ...hikeCardStyles.cardParent,
                    }}>
                    <Text
                        style={{
                            ...hikeCardStyles.name,
                        }}>
                        {name}
                    </Text>
                    <Text
                        style={{
                            ...hikeCardStyles.location,
                        }}>
                        {location}
                    </Text>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                        <Text
                            style={{
                                ...hikeCardStyles.date,
                            }}>
                            {date}
                        </Text>
                        <Text
                            style={{
                                ...hikeCardStyles.durationInHours,
                            }}>
                            {durationInHours}h
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                data={hikes}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                removeClippedSubviews
                onEndReached={() => {
                    setSkip(skip => {
                        const newSkip = skip + 10;
                        if (newSkip > count) return skip;
                        return newSkip;
                    });
                }}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
        </View>
    );
}

export default Hikes;
