import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import AddQuestion from "./AddQuestion";
import Settings from "./Settings"

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer styles={StyleSheet.container}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Welcome" component={Dashboard} />
        <Stack.Screen name="AddQuestion" component={AddQuestion} />
        <Stack.Screen name="Settings" component={Settings} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#485613',
  },
});