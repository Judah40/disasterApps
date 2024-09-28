import React, { useState, useEffect } from "react";
// import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
const Downloads = () => {
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
    <SafeAreaView className="flex-1 bg-green-200">
      <View className="flex-1">
        {/* HEADER*/}
        <View className="w-full px-4  flex-row justify-between items-center">
          <Text className="text-lg font-bold">Downloads</Text>
          {/* {pageTitle} */}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              flexDirection: orientation == "lanscale" ? "row" : "column",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              title="Text"
              onPress={{}}
              style={{
                flex: orientation == "lanscale" ? 1 : 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="text-document" size={100} color="#7fd13a" />
              <Text style={{ fontWeight: "bold" }}>Download Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              title="Audio"
              onPress={{}}
              style={{
                flex: orientation == "lanscale" ? 1 : 1,
                alignItems: "center",
              }}
            >
              <AntDesign name="sound" size={100} color="orange" />
              <Text style={{ fontWeight: "bold" }}>Download Audio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Downloads;
