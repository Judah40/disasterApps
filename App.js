import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import Languages from "./app/screens/Languages";
import Welcome from "./app/screens/Welcome";
import BottomTabNav from "./BottomTabNav";
import "react-native-gesture-handler";

export default function App() {
  return <AppContainer />;
}

const AppNavigator = createStackNavigator(
  {
    Welcome: {
      screen: Welcome,
      navigationOptions: {
        headerShown: false,
      },
    },
    Languages: {
      screen: Languages,
      navigationOptions: {
        headerShown: false,
        headerBackTitle: "none",
        headerBackTitleVisible: false,
      },
    },
    BottomTabNav: { screen: BottomTabNav },
  },
  {
    initialRouteName: "Welcome",
    navigationOptions: {
      headerBackTitle: "none",
      headerBackTitleVisible: false,
      headerMode: "screen",
    },
  }
);

const AppContainer = createAppContainer(AppNavigator);
