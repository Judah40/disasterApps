import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { styles } from "../components/styles";
import HowToSearch from "./HowToSearch";
import HowToDownload from "./HowToDownload";
import LanguagesMap from "./LanguagesMap";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const Info = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Help" component={InfoClass} />
      <Stack.Screen name="HowToSearch" component={HowToSearch} />
      <Stack.Screen name="HowToDownload" component={HowToDownload} />
      <Stack.Screen name="LanguagesMap" component={LanguagesMap} />
    </Stack.Navigator>
  );
};

const InfoClass = ({ navigation }) => {
  const [orientation, setOrientation] = useState("landscale");
  useEffect(() => {
    checkOrientation();
  }, []);

  const checkOrientation = () => {
    var width = Dimensions.get("window").width;
    var height = Dimensions.get("window").height;
    setOrientation(width > height ? "lanscale" : "portrait");
  };
  Dimensions.addEventListener("change", () => {
    checkOrientation();
  });

  return (
    <SafeAreaView className="flex-1 ">
      {/* BACKGROUND IMAGE*/}
      <View className="flex-1">
        <View className="w-full px-4  flex-row justify-between items-center">
        <Text className="text-lg font-bold">Help</Text>
        {/* {pageTitle} */}
      </View>
        <View
          style={[
            styles.containerInfo,
            {
              flexDirection: orientation == "lanscale" ? "row" : "column",
              justifyContent: "space-evenly",
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: orientation == "lanscale" ? "row" : "column",
                marginBottom: orientation == "lanscale" ? 10 : 0,
                justifyContent: "space-evenly",
              }}
            >
              <View className="px-4 flex-row justify-between">
                <TouchableOpacity
                  title="LanguagesMap"
                  onPress={() => navigation.navigate("LanguagesMap")}
                  className="items-center space-y-4"
                >
                  <Image
                    source={require("../assets/countries_languages.png")}
                    className="w-40 h-48"
                  />
                  <Text>Languages Map</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  title="HowToSearch"
                  onPress={() => navigation.navigate("HowToSearch")}
                  className="items-center space-y-4"
                >
                  <Image
                    source={require("../assets/person-with-magnifying-glass.jpg")}
                    className="w-40 h-48"
                  />
                  <Text>How to Search</Text>
                </TouchableOpacity>
              </View>

              <View className="px-4 my-12">
                <TouchableOpacity
                  title="HowToDownload"
                  onPress={() => navigation.navigate("HowToDownload")}
                  className="items-center w-40 space-y-4 b"
                >
                  <Image
                    source={require("../assets/downloadsimg.jpeg")}
                    className="w-40 h-40"
                  />
                  <Text>How to Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

//
export default Info;
