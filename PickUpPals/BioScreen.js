import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Background from "./components/Background";
import Logo from "./components/Logo";
import Header from "./components/Header";
import Button from "./components/Button";
import TextInput from "./components/TextInput";
import BackButton from "./components/BackButton";
import { theme } from "./core/theme";
import Toast from "./components/Toast";
import Logs from "./components/small_log";

const RegisterScreen = ({ navigation }) => {

  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bio, setBio] = useState({ value: "", error: "" });


  const _onSignUpPressed = async () => {
    navigation.navigate("CreateGameScreen");
    if (loading) return;

    if (emailError || passwordError || nameError) {
      return;
    }

    setLoading(true);

    



    setLoading(false);
  };

  return (
    <Background>

      <Text style={styles.bigText}>Bio</Text>

      <View style={{ position: 'absolute', top: 0, left: 0 }}>
      <Logs />
      </View>

     

      <Logo />





  

      

     
      <TextInput
        label="Introduce Yourself"
        returnKeyType="next"
        value={bio.value}
        onChangeText={text => setBio({ value: text, error: "" })}
        error={!!bio.error}
        errorText={bio.error}
        autoCapitalize="none"
        multiline         // Allow multiple lines
        numberOfLines={4} // Show 4 lines at once
        style={styles.bioInput}  // Add some styling for this input
      />

      <TextInput
        label="Social Media (optional)"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button
        loading={loading}
        mode="contained"
        onPress={_onSignUpPressed}
        style={styles.button}
      >
        Complete Profile
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
  },bioInput: {
    height: 100,    // Give more height
    marginTop: 10,  // Some margin to separate from the above content
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
  }, bigText: {
    fontSize: 32,      // Choose any size that looks "big" to you
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20     // Some margin to separate from the top content
  },
  
  subText: {
    fontSize: 18,     // Choose an appropriate size for the subtitle
    textAlign: 'center',
    marginTop: 10     // Some margin to separate from the bigText
  }
});

export default memo(RegisterScreen);