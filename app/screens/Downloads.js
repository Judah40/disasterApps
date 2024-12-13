import React, { useState, useEffect } from "react";
// import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { getLanguage } from "../components/commonFn";
import { downloadAllLanguages } from "../api";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

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

  const downloadText = async () => {
    try {
      const language = await getLanguage();
      const { data } = await downloadAllLanguages(language);
      console.log(data);

    // Create HTML content for the PDF
    const htmlContent = `
      <html>
        <body>
          <h1>${language}</h1>
          <p>${data}</p>
        </body>
      </html>
    `;

    // Generate the PDF using expo-print
    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    // Define a file path for saving the PDF
    const filePath = `${FileSystem.documentDirectory}example.pdf`;

    // Move the generated PDF to the file system
    await FileSystem.moveAsync({
      from: uri,
      to: filePath,
    });

    // Share the PDF
    if (await FileSystem.getInfoAsync(filePath)) {
      await Sharing.shareAsync(filePath);
    } else {
      Alert.alert("Error", "Failed to save the PDF.");
    }
  } catch (error) {
    Alert.alert("Error", "Something went wrong while creating the PDF.");
    console.error(error);
  } finally {
    setIsLoading(false);
  }
  };
  return (
    <SafeAreaView className="flex-1 ">
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
              onPress={() => {
                downloadText();
              }}
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
              onPress={() => {
                Alert.alert("Status", "Coming soon");
              }}
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
