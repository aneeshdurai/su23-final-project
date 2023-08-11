import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterScreen from './RegisterScreen'; // Adjust the path
import DashboardScreen from './DashboardScreen'; // Adjust the path
import LoginScreen from './LoginScreen'; // Adjust the path
import CreateGameScreen from './CreateGameScreen';
import SearchGameScreen from './SearchGameScreen';
import BioScreen from './BioScreen'; // Adjust the path
import MyCommunity from './MyCommunity'; // Adjust the path
import ChatScreen from './ChatScreen'; // Adjust the path
import StartScreen from './StartScreen'; // Adjust the path
import MyGames from './MyGames'; // Adjust the path

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="StartScreen">
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MyGames" component={MyGames} />
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="DashBoard" component={DashboardScreen} />
      <Stack.Screen name="Bio" component={BioScreen} />
      <Stack.Screen name="MyCommunity" component={MyCommunity} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="CreateGameScreen" component={CreateGameScreen} />
      <Stack.Screen name="SearchGameScreen" component={SearchGameScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
