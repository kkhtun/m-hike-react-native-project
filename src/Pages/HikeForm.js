import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
    TextInput,
    Surface,
    Button,
    Checkbox,
    Text,
    SegmentedButtons,
    useTheme,
} from "react-native-paper";
import { Database, getHike, saveHike, updateHike } from "../helpers/database";
import { commonStyles, styleConstants } from "../theme/styles";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import {
    convertToInteger,
    convertToFloat,
    formatDate,
} from "../helpers/common.helpers";
import Slider from "@react-native-community/slider";
import NotificationContext from "../context/snackbar.context";
import CustomHelperText from "../components/CustomHelperText";
import { STACK } from "../constants";
import DropDown from "react-native-paper-dropdown";

const fakeData = {
    name: "Hike One",
    location: "Test Hike Location One",
    date: "2023-03-01",
    isParkingAvailable: true,
    durationInHours: 3,
    difficultyLevel: 4,
    description: undefined,
    rating: 3.5,
    distance: 8.5,
    distanceUnit: "km",
};

const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({
    label: i.toString(),
    value: i,
}));

function HikeForm({ route, navigation }) {
    const { hikeId } = route?.params || {};
    const notification = useContext(NotificationContext);
    const [showDropDown, setShowDropDown] = useState(false);

    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState(moment());
    const [isParkingAvailable, setIsParkingAvailable] = useState(false);
    const [durationInHours, setDurationInHours] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState(5);
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState(2.5);
    const [distance, setDistance] = useState("");
    const [distanceUnit, setDistanceUnit] = useState("km");

    const [errors, setErrors] = useState({});

    const showDatePicker = mode => {
        DateTimePickerAndroid.open({
            value: date.clone().toDate(),
            onChange: (e, selectedDate) => {
                const currentDate = selectedDate;
                setDate(moment(currentDate));
            },
            mode: mode,
            is24Hour: false,
        });
    };

    const validateAndSaveHike = async () => {
        setErrors({});
        const error = {};
        if (!name) error["name"] = "Name is required";
        if (!location) error["location"] = "Location is required";
        if (!date) error["date"] = "Date is required";
        if (isParkingAvailable == null)
            error["isParkingAvailable"] = "Parking availability is required";
        if (!durationInHours)
            error["durationInHours"] = "Duration length is required";
        if (!difficultyLevel)
            error["difficultyLevel"] = "Difficulty is required";
        if (!rating) error["rating"] = "Rating is required";
        if (!distance) error["distance"] = "Distance is required";
        if (!distanceUnit) error["distanceUnit"] = "Distance unit is required";
        if (Object.keys(error).length > 0) return setErrors(error);

        const data = {};
        if (!(date instanceof moment)) error["date"] = "Date is invalid";
        if (!(data["durationInHours"] = convertToFloat(durationInHours))) {
            error["durationInHours"] = "Duration length is invalid";
        }
        if (
            !(data["difficultyLevel"] = convertToInteger(difficultyLevel._id))
        ) {
            error["difficultyLevel"] = "Difficulty is invalid";
        }
        if (!(data["rating"] = convertToFloat(rating))) {
            error["rating"] = "Rating is invalid";
        }
        if (!(data["distance"] = convertToFloat(distance))) {
            error["distance"] = "Distance is invalid";
        }
        if (!["km", "mile"].includes((data["distanceUnit"] = distanceUnit))) {
            error["distanceUnit"] = "Distance unit is invalid";
        }
        if (Object.keys(error).length > 0) return setErrors(error);

        try {
            const payload = {
                name,
                location,
                date: date.format("YYYY-MM-DD"),
                isParkingAvailable,
                description: !description ? null : description,
                ...data,
            };
            const database = await Database.getDatabase();
            const result = hikeId
                ? await updateHike(database, { hikeId, ...payload })
                : await saveHike(database, payload);
            const operation = result[0];
            if (operation.rowsAffected > 0) {
                notification.success("Hike saved Successfully");
                hikeId
                    ? navigation.navigate(STACK.hikeDetail.key, {
                          hikeId,
                      })
                    : navigation.navigate(STACK.hikeList.key, {
                          refresh: true,
                      });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getHikeDetail = async ({ hikeId }) => {
        try {
            const database = await Database.getDatabase();
            const data = await getHike(database, { hikeId });
            setName(data.name);
            setLocation(data.location);
            setDate(moment(data.date));
            setIsParkingAvailable(data.isParkingAvailable);
            setDurationInHours(data.durationInHours.toString());
            setDifficultyLevel(data.difficultyLevel);
            setDescription(data.description || "");
            setRating(data.rating);
            setDistance(data.distance.toString());
            setDistanceUnit(data.distanceUnit);
        } catch (error) {
            console.error(error.message);
            notification.error(error.message);
        }
    };

    useEffect(() => {
        if (hikeId) getHikeDetail({ hikeId });
    }, [hikeId]);

    return (
        <ScrollView style={commonStyles.appContainer}>
            <Surface elevation={2} style={commonStyles.formElement}>
                <TextInput
                    label="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="name" />
            </Surface>

            <Surface elevation={2} style={commonStyles.formElement}>
                <TextInput
                    label="Location"
                    value={location}
                    onChangeText={text => setLocation(text)}
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="location" />
            </Surface>

            <Surface
                elevation={2}
                style={{
                    ...commonStyles.formElement,
                    ...commonStyles.datePickerFormElement,
                }}>
                <TextInput
                    label="Date"
                    value={formatDate(date)}
                    onChangeText={text => setDate(date)}
                    editable={false}
                    selectTextOnFocus={false}
                    right={
                        <TextInput.Icon
                            icon="calendar"
                            size={24}
                            onPress={() => showDatePicker("date")}
                        />
                    }
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="date" />
            </Surface>

            <Surface elevation={2} style={commonStyles.formElement}>
                <Checkbox.Item
                    status={isParkingAvailable ? "checked" : "unchecked"}
                    onPress={() => {
                        setIsParkingAvailable(prev => !prev);
                    }}
                    label="Is Parking Available"
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="isParkingAvailable" />
            </Surface>

            <Surface elevation={2} style={commonStyles.formElement}>
                <TextInput
                    inputMode="numeric"
                    label="Duration In Hours"
                    value={durationInHours}
                    onChangeText={text => setDurationInHours(text)}
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="durationInHours" />
            </Surface>

            <Surface elevation={2} style={commonStyles.formElement}>
                <DropDown
                    label={"Difficulty Level"}
                    mode={"outlined"}
                    visible={showDropDown}
                    showDropDown={e => setShowDropDown(true)}
                    onDismiss={e => setShowDropDown(false)}
                    value={difficultyLevel}
                    setValue={setDifficultyLevel}
                    list={DIFFICULTY_LEVELS}
                    dropDownItemTextStyle={{
                        color: useTheme().dark ? "white" : "black",
                    }}
                />
            </Surface>

            <Surface elevation={2} style={commonStyles.formElement}>
                <TextInput
                    label="Description"
                    value={description}
                    onChangeText={text => setDescription(text)}
                    style={commonStyles.fillHeight}
                />
                <CustomHelperText errors={errors} value="description" />
            </Surface>

            <View style={commonStyles.formElement}>
                <Surface
                    elevation={2}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingHorizontal: styleConstants.spacing.medium,
                        height: "100%",
                    }}>
                    <Text variant="bodyLarge" style={{ textAlign: "center" }}>
                        Rating {rating}
                    </Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={5}
                        step={0.5}
                        value={rating}
                        onValueChange={v => setRating(v)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </Surface>
                <CustomHelperText errors={errors} value="description" />
            </View>

            <View style={commonStyles.formElement}>
                <Surface
                    elevation={2}
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <TextInput
                        inputMode="numeric"
                        label="Distance"
                        value={distance}
                        onChangeText={text => setDistance(text)}
                        style={{ ...commonStyles.fillHeight, flexBasis: "50%" }}
                    />
                    <View
                        style={{
                            flexBasis: "50%",
                            paddingHorizontal: styleConstants.spacing.medium,
                        }}>
                        <SegmentedButtons
                            value={distanceUnit}
                            onValueChange={setDistanceUnit}
                            buttons={[
                                {
                                    value: "km",
                                    label: "km",
                                },
                                {
                                    value: "mile",
                                    label: "mile",
                                },
                            ]}
                            density="regular"
                        />
                    </View>
                </Surface>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                    <CustomHelperText errors={errors} value="distance" />
                    <CustomHelperText errors={errors} value="distanceUnit" />
                </View>
            </View>

            <Button
                mode="contained"
                onPress={() => validateAndSaveHike()}
                style={{
                    marginTop: styleConstants.spacing.medium,
                    marginBottom: styleConstants.spacing.large,
                }}>
                Save Hike
            </Button>
        </ScrollView>
    );
}

export default HikeForm;
