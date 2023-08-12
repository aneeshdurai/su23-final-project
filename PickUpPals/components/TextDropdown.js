import React, { memo } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput as Input, HelperText } from "react-native-paper";
import { theme } from "../core/theme";
import { Picker } from "@react-native-picker/picker";

const timeOptions = [
  "12:00 AM PST",
  "01:00 AM PST",
  "02:00 AM PST",
  "03:00 AM PST",
  "04:00 AM PST",
  "05:00 AM PST",
  "06:00 AM PST",
  "07:00 AM PST",
  "08:00 AM PST",
  "09:00 AM PST",
  "10:00 AM PST",
  "11:00 AM PST",
  "12:00 PM PST",
  "01:00 PM PST",
  "02:00 PM PST",
  "03:00 PM PST",
  "04:00 PM PST",
  "05:00 PM PST",
  "06:00 PM PST",
  "07:00 PM PST",
  "08:00 PM PST",
  "09:00 PM PST",
  "10:00 PM PST",
  "11:00 PM PST",
  // Add more time options as needed
];

const TextDropdown = ({ label, value, onChangeText, error, errorText }) => (
  <View style={styles.container}>
    <Picker
      selectedValue={value}
      onValueChange={(itemValue) => onChangeText(itemValue)}
    >
      {timeOptions.map((time, index) => (
        <Picker.Item key={index} label={time} value={time} />
      ))}
    </Picker>
    {error ? <HelperText type="error">{errorText}</HelperText> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12
  },
  input: {
    backgroundColor: theme.colors.surface
  },
  error: {
    fontSize: 14,
    color: theme.colors.error,
    paddingHorizontal: 4,
    paddingTop: 4
  }
});

export default memo(TextDropdown);