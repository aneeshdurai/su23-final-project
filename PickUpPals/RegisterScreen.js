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
import firebase from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { string } from "prop-types";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();

  function newAccount(username, password) {
    if (loading) return;

    setLoading(true);
    createUserWithEmailAndPassword(auth, username, password).then((userCredential) => {
      // Signed in
      updateProfile(userCredential.user, { displayName: name.value });
      const user = userCredential.user;
      navigation.navigate('DashBoard');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      setLoading(false);
    });
  }

  return (
    <Background>

      <Text style={styles.bigText}>Sign Up / Log In</Text>
      <Text style={styles.subText}>To access all games!</Text>

      <Logo />

      <Header> Create your account </Header>


      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
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
        onPress={() => newAccount(email.value, password.value)}
        style={styles.button}
      >
        Register
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
  },
  bigText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  },
  subText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10
  }
});

export default memo(RegisterScreen);
