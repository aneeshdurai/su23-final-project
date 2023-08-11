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
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";




const LoginScreen = ({ navigation }) => {
  /* Screen Requirements:
      - AppBar
      - Email & Password Text Input
      - Submit Button
      - Sign Up Button (goes to Sign Up screen)
      - Reset Password Button
      - Snackbar for Error Messages
  
    All UI components on this screen can be found in:
      https://callstack.github.io/react-native-paper/

    All authentication logic can be found at:
      https://firebase.google.com/docs/auth/web/starts
  */

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = getAuth();

  function login(username, password) {
    signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      navigation.navigate('CreateGameScreen');
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
    });
    
  }
  
  function resetPassword(username) {
    sendPasswordResetEmail(auth, username)
    .then(() => {
    // Password reset email sent!
    // ..
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
  }
  

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate("HomeScreen")} />

      <View style={{ position: 'absolute', top: 0, left: 0 }}>
      <Logo />
      </View>

      <Header> Sign In </Header>

      
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
        //loading={loading}
        mode="contained"
        onPress={() => login(email.value, password.value)}
        style={styles.button}
      >
        Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}> Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.link}>Create an Account</Text>
        </TouchableOpacity>
      </View>

      <Toast message={error} onDismiss={() => setError("")} />
    </Background>
  );

}


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
    }
  });

export default memo(LoginScreen);