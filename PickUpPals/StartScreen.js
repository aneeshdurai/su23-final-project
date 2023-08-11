import React, { memo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity ,Image,SafeAreaView} from "react-native";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('Register')}>
        <Image source={require('./assets/starting.png')} style={styles.image} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,   // Use null to allow flex to control width
    height: null,  // Use null to allow flex to control height
    resizeMode: 'cover',
  }
});

export default memo(RegisterScreen);

