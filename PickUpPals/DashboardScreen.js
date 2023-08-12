import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Background from "./components/Background";
import Logo from "./components/small_log";
import Header from "./components/Header";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import BackButton from "./components/BackButton";
import { theme } from "./core/theme";
import Toast from "./components/Toast";
import { Picker } from "@react-native-picker/picker";

const DashboardScreen = ({ navigation }) => {

  const [name, setName] = useState({ value: "", error: "" });
  const [city, setCity] = useState({ value: "", error: "" });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [age, setAge] = useState("");
  const [skillLevel, setSkillLevel] = useState("");

  const ageOptions = [];
  for(let i = 18; i <= 120; i++) {
    ageOptions.push(<Picker.Item key={i} label={`${i}`} value={`${i}`} />);
  }
  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }; 

  const _onSignUpPressed = async () => {
    navigation.navigate("Bio");
    if (loading) return;

    if (emailError || passwordError || nameError) {
      return;
    }

    setLoading(true);

    



    setLoading(false);
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />

      <View style={{ position: 'absolute', top: 0, left: 0 }}>
        <Logo />
      </View>

      <Picker
        selectedValue={age}
        onValueChange={(itemValue, itemIndex) => setAge(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Age" value="" />
        {ageOptions}
      </Picker>

      <Picker
        selectedValue={skillLevel}
        onValueChange={(itemValue, itemIndex) => setSkillLevel(itemValue)}
        style={styles.picker_2}
      >
        <Picker.Item label="Select Skill Level" value="" />
        <Picker.Item label="Beginner" value="beginner" />
        <Picker.Item label="Intermediate" value="intermediate" />
        <Picker.Item label="Expert" value="expert" />
      </Picker>


      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({ value: capitalizeFirstLetter(text), error: "" })}
        error={!!name.error}
        errorText={name.error}
      />

      <TextInput
        label="City"
        returnKeyType="next"
        value={city.value}
        onChangeText={text => setCity({ value: capitalizeFirstLetter(text), error: "" })}
        error={!!city.error}
        errorText={city.error}
      />

      <TextInput
        label="Phone Number"
        returnKeyType="next"
        value={phoneNumber.value}
        onChangeText={text => setPhoneNumber({ value: capitalizeFirstLetter(text), error: "" })}
        error={!!phoneNumber.error}
        errorText={phoneNumber.error}
      />


      <Button
        loading={loading}
        mode="contained"
        onPress={_onSignUpPressed}
        style={styles.button}
      >
        Continue Profile
      </Button>

      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        </TouchableOpacity>
      </View>

      <Toast message={error} onDismiss={() => setError("")} />
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#666666',
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 3,
  },picker_2: {
    height: 50,
    width: '100%',
    color: '#666666',
    marginBottom: 10, // adjust margin as needed
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 3,
  },
  button: {
    marginTop: 24
  },
  row: {
    flexDirection: "row",
    marginTop: 4
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary
  }
});

export default memo(DashboardScreen);
