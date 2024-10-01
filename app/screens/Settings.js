import React, { useEffect, useState } from "react";
// import { NavigationEvents } from "react-navigation";
import { getPageTitle, getLanguage } from "../components/commonFn";
import {
  View,
  ScrollView,
  Text,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { styles } from "../components/styles";
import * as SMS from "expo-sms";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native";

const Settings = ({ navigation }) => {
  // NOTE:
  // The function below allowa sending a message or email to a particular organisation to inform about an event in the area
  // which might be relevant and important to know across the country.
  // This message allows the addition of the user’s location, which can help the receiver understand better
  // where the event has been observed.
  // Sending an email requires server setup
  // Or alternatively, attempt to obtain mobile and/or other apps permissions such as contacts list, email apps, etc.
  const reportEvent = async () => {
    var { status } = await Location.requestForegroundPermissionsAsync();
    var location = "";
    if (status == "granted") {
      var myLocation = await Location.getCurrentPositionAsync();
      //myLocation.coords
      location = myLocation.coords.latitude + "," + myLocation.coords.longitude;
      //// // console.log(location);
    }
    const isSMSa = await SMS.isAvailableAsync();
    if (isSMSa) {
      await SMS.sendSMSAsync([
        "Receiver's number goes here",
        "DRR app REPORT EVENT pressed.",
      ]);
    } else {
      Alert.alert("COMING SOON...", "Thank you for your patience :)");
      // // // console.log("Emergency SMS function.");
    }
    // FUNCTION TO USE FOR SENDING AN EMAIL VIA SERVER
    // THE SERVER HAS TO BE SET UP WITH AN EMAIL RECEIVER (AND POTENTIALLY SENDER)
    // await fetch("http://", {
    //   // Here goes server link
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     location: location,
    //   }),
    // })
    //   .then((result) => result.json())
    //   .then((response) => {
    //     //handle result
    //     // // console.log(response);
    //   })
    //   .catch((error) => {
    //     //diplay error
    //     Alert.alert("EMERGENCY BUTTON", "Coming soon...");
    //     // // console.log("Emergency function: ", error);
    //   });
  };

  const alertTemp = () => {
    Alert.alert("COMING SOON...", "Thank you for your patience :)");
  };
  // Used to trigger re-rendering on Focus (fixed Change Language from Settings bug)
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //// // console.log("setLanguageTerms Search Page ----->", language);
    });
  };

  // ---GET LANGUAGE FROM ASYNCSTORAGE-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [language, setLanguageTerms] = useState("");
  const [orientation, setOrientation] = useState("landscale");
  useEffect(() => {
    checkOrientation();
  }, []);

  const checkOrientation = () => {
    var width = Dimensions.get("window").width;
    var height = Dimensions.get("window").height;
    setOrientation(width > height ? "lanscale" : "portrait");
  };
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      // // // console.log("setLanguageTerms Search Page ----->", language);
    });
  }, []);
  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("settings").then((result) => {
        setPageTitle(result);
      });
    } catch {
      // // console.log("Error: couldn't get pageTitle");
    }
  }, [language]);

  Dimensions.addEventListener("change", () => {
    checkOrientation();
  });

  return (
    <SafeAreaView className="flex-1 ">
      {/* BACKGROUND IMAGE*/}
      <View className="flex-1">
        <View className="w-full px-4  flex-row justify-between items-center">
          <Text className="text-lg font-bold">Setting</Text>
          {/* {pageTitle} */}
        </View>

        {/* SETTINGS CONTAINER */}

        <View>
          <View className="p-2 space-y-4">
            <TouchableOpacity
              title="Languages"
              onPress={() => navigation.navigate("Languages")}
              className="flex-row p-3 mx-2 rounded-lg bg-white items-center space-x-1"
            >
              <MaterialIcons name="language" size={24} color={"#FF4E40"} />
              <Text style={styles.bold}>Change Language</Text>
              <View className="flex-1 items-end">
                <AntDesign name="right" size={24} color="black" />
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity title="Emergency" onPress={() => reportEvent()}> */}

            <TouchableOpacity
              title="Emergency"
              onPress={() => alertTemp()}
              className="flex-row p-3 mx-2 rounded-lg bg-white items-center space-x-1"
            >
              <MaterialIcons
                name="notification-important"
                size={24}
                color={"red"}
              />
              <Text style={[styles.bold, { color: "red" }]}>REPORT EVENT</Text>
              <View className="flex-1 items-end">
                <AntDesign name="right" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              title="Languages"
              onPress={() =>
                Alert.alert(
                  "Help us be better!",
                  "To let us know what you think about this app, please email info.drr.app@gmail.com Thank you :)"
                )
              }
              className="flex-row p-3 mx-2 rounded-lg bg-white items-center space-x-1"
            >
              <MaterialIcons
                name="local-post-office"
                size={24}
                color={"#F9A603"}
              />
              <Text style={styles.bold}>Leave Feedback</Text>
              <View className="flex-1 items-end">
                <AntDesign name="right" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
