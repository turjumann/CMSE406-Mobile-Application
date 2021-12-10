import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native"; //for Creating a navigation container
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import MessageScreen from "./screens/MessageScreen";

//Creating a stack for the screens
const Stack = createStackNavigator();

//Setting options and styles for the Navigation container
const globalScreenOptions = {
  headerStyle: { backgroundColor: "white" },
  headerTitleStyle: { color: "black" },
  headerTintcolor: "black",
};

//Wrapping screens with a navigation container and rendering the whole application
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName="Home"
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddChat" component={AddChatScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//NOT USED - Global styling for the whole application
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
