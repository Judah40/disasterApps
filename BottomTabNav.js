import React, { useEffect } from "react";
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
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:false
    }}>
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="search-circle-sharp" // select icon
              size={32} // size icon
              color={focused ? "#4CAF50" : "#9E9E9E"} // color icon
              // color={tabSearch.focused ? "orange" : "#8e8e93"} // activeColor : "inactiveColor"
            />
          ),
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
        }}
      />
      <Tab.Screen
        name="Downloads"
        component={Downloads}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="cloud-download" // select icon
              size={32} // size icon
              color={focused ? "#4CAF50" : "#9E9E9E"} // color icon

              // color={tabSearch.focused ? "orange" : "#8e8e93"} // activeColor : "inactiveColor"
            />
          ),
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
        }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="information-circle" // select icon
              size={32} // size icon
              color={focused ? "#4CAF50" : "#9E9E9E"} // color icon

              // color={tabSearch.focused ? "orange" : "#8e8e93"} // activeColor : "inactiveColor"
            />
          ),
          headerShown: false,
          tabBarActiveTintColor: "#4CAF50",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings" // select icon
              size={32} // size icon
              color={focused ? "#4CAF50" : "#9E9E9E"} // color icon

              // color={tabSearch.focused ? "orange" : "#8e8e93"} // activeColor : "inactiveColor"
            />
          ),
          headerTitle: "",
          headerLeft: () => (
            <View style={{ paddingLeft: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>Settings</Text>
            </View>
          ),
          tabBarActiveTintColor: "#4CAF50",
        }}
      />
    </Tab.Navigator>
  );
}

