import React, { useContext, useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Database, getHikes } from "../helpers/database";
import NotificationContext from "../context/snackbar.context";
import { ActivityIndicator, Text } from "react-native-paper";
import { hikeCardStyles } from "../theme/styles";
import { RefreshControl, TouchableOpacity } from "react-native-gesture-handler";
import { STACK } from "../constants";
import EmptyComponent from "../components/EmptyComponent";

function Hikes({ navigation }) {
    const [hikes, setHikes] = useState([]);
    const [count, setCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [lastSkip, setLastSkip] = useState(skip);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing] = useState(false);
    const notification = useContext(NotificationContext);

    const getPaginatedHikes = async ({ skip = 0 } = {}) => {
        setIsLoading(true);
        try {
            const database = await Database.getDatabase();
            const { data, count } = await getHikes(database, { skip });
            setIsLoading(false);
            return { count, data };
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
            setIsLoading(false);
        }
    };

    const getData = ({ skip }) => {
        return getPaginatedHikes({ skip })
            .then(({ data, count }) => {
                setCount(count);
                if (skip === 0) return setHikes(data);
                if (skip === lastSkip) return setLastSkip(skip);
                setLastSkip(skip);
                setHikes(hikes => [...hikes, ...data]);
                return;
            })
            .catch(e => {
                notification.error(e.message);
            });
    };

    useEffect(() => {
        getData({ skip });
    }, [skip]);

    const onPullDownToRefresh = e => {
        if (skip !== 0) {
            setSkip(0);
            setLastSkip(0);
            return;
        }
        getData({ skip });
    };

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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onPullDownToRefresh}
                    />
                }
                ListEmptyComponent={<EmptyComponent />}
                refreshing={true}
                onEndReachedThreshold={0}
                onEndReached={() => {
                    setSkip(skip => {
                        if (skip > count || count === 0) return skip;
                        const newSkip = skip + 10;
                        return newSkip;
                    });
                }}
                ListFooterComponent={ListEndLoader} // Loader when loading next page.
            />
        </View>
    );
}

export default Hikes;
