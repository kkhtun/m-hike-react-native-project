import React from "react";
import { HelperText } from "react-native-paper";

export default function CustomHelperText({ errors, value, type = "error" }) {
    return (
        <HelperText type={type} visible={!!errors[value]}>
            {errors[value]}
        </HelperText>
    );
}
