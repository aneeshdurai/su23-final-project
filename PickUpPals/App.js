import React from 'react';
import { initializeApp, getApps } from "firebase/app";
import AppNavigator from './AppNavigator'; // Adjust the path

const firebaseConfig = require("./keys.json");

if (getApps().length == 0) {
  initializeApp(firebaseConfig);
}

const App = () => (
  <AppNavigator />
);

export default App;
