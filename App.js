import React from "react";
import Languages from "./app/screens/Languages";
import Welcome from "./app/screens/Welcome";
import BottomTabNav from "./BottomTabNav";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer
    
    >
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen
          name="Welcome"
          component={Welcome}
        
        />
        <Stack.Screen
          name="Languages"
          component={Languages}
         
        />
        <Stack.Screen name="Tabs" component={BottomTabNav}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
