import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Settings from "./app/screens/Settings";
import Search from "./app/screens/Search";
import Info from "./app/screens/Info";
import Downloads from "./app/screens/Downloads";
import Languages from "./app/screens/Languages";

const BottomTabNav = createBottomTabNavigator(
  {
    Search: {
      screen: Search,
      navigationOptions: {
        headerShown: false,
        tabBarOptions: {
          activeTintColor: "orange", // yellow
          inactiveTintColor: "#8e8e93",
          showLabel: false,
          style: { height: 47 },
          tabStyle: { height: 50 },
        },

        tabBarIcon: (tabSearch) => {
          return (
            <Ionicons
              name="search-circle-sharp" // select icon
              size={50} // size icon
              color={tabSearch.focused ? "orange" : "#8e8e93"} // activeColor : "inactiveColor"
              style={{ alignSelf: "center", minWidth: 50, minHeight: 50 }}
            />
          );
        },
      },
    },
    Downloads: {
      screen: Downloads,
      navigationOptions: {
        headerShown: false,
        tabBarOptions: {
          //tabBarLabel: "Downloads",
          activeTintColor: "#7fd13a", // green
          inactiveTintColor: "#8e8e93",
          showLabel: false,
          style: { height: 47 },
          tabStyle: { height: 50 },
        },
        tabBarIcon: (tabDow) => {
          return (
            <MaterialCommunityIcons
              name="cloud-download"
              size={50}
              color={tabDow.focused ? "#7fd13a" : "#8e8e93"}
              style={{ alignSelf: "center", minWidth: 50, minHeight: 50 }}
            />
          );
        },
      },
    },
    Info: {
      screen: Info,
      navigationOptions: {
        headerShown: false,
        //tabBarLabel: "Info",
        tabBarOptions: {
          activeTintColor: "#0090d2", // blue
          inactiveTintColor: "#8e8e93",
          showLabel: false,
          style: { height: 47 },
          tabStyle: { height: 50 },
        },
        tabBarIcon: (tabInfo) => {
          return (
            <Ionicons
              name="information-circle"
              size={50}
              color={tabInfo.focused ? "#0090d2" : "#8e8e93"}
              style={{
                alignSelf: "center",
                minWidth: 50,
                minHeight: 50,
              }}
            />
          );
        },
      },
    },

    Settings: {
      screen: Settings,
      navigationOptions: {
        headerShown: false,
        tabBarOptions: {
          activeTintColor: "#FF4E40", // red
          inactiveTintColor: "#8e8e93",
          showLabel: false,
          style: { height: 47 },
          tabStyle: { height: 50 },
        },
        tabBarIcon: (tabSet) => {
          return (
            <MaterialIcons
              // style={{ paddingTop: 3 }}
              name="settings"
              size={45}
              color={tabSet.focused ? "#FF4E40" : "#8e8e93"}
              style={{
                alignSelf: "center",
                minWidth: 50,
                minHeight: 50,
              }}
            />
          );
        },
      },
    },
  },
  {
    initialRouteName: "Search",
    order: ["Search", "Downloads", "Info", "Settings"],
    navigationOptions: {
      headerBackTitle: "none",
      headerBackTitleVisible: false,
      headerMode: "screen",
      headerShown: false,
    },
  }
);

export default BottomTabNav;
