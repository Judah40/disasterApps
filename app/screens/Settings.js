import React, { useEffect, useState } from "react";
import { NavigationEvents } from "react-navigation";
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
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";

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
      //console.log(location);
    }
    const isSMSa = await SMS.isAvailableAsync();
    if (isSMSa) {
      await SMS.sendSMSAsync([
        "Receiver's number goes here",
        "DRR app REPORT EVENT pressed.",
      ]);
    } else {
      Alert.alert("COMING SOON...", "Thank you for your patience :)");
      // console.log("Emergency SMS function.");
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
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     //diplay error
    //     Alert.alert("EMERGENCY BUTTON", "Coming soon...");
    //     console.log("Emergency function: ", error);
    //   });
  };

  const alertTemp = () => {
    Alert.alert("COMING SOON...", "Thank you for your patience :)");
  };
  // Used to trigger re-rendering on Focus (fixed Change Language from Settings bug)
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Search Page ----->", language);
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
      // console.log("setLanguageTerms Search Page ----->", language);
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
      console.log("Error: couldn't get pageTitle");
    }
  }, [language]);

  Dimensions.addEventListener("change", () => {
    checkOrientation();
  });

  return (
    <View>
      <NavigationEvents
        onFocus={() => {
          setDefaultLanguage();
        }}
      />
      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewSettings}>
          <Text style={styles.myHeaderText}>{pageTitle}</Text>
        </View>

        {/* SETTINGS CONTAINER */}

        <View style={styles.containerSettings}>
          <View
            style={{
              flexDirection: orientation == "lanscale" ? "row" : "column",
            }}
          >
            <TouchableOpacity
              title="Languages"
              onPress={() => navigation.navigate("Languages")}
              style={{
                alignItems: "center",
                marginVertical: 25,
                flex: orientation == "lanscale" ? 1 : 0,
              }}
            >
              <MaterialIcons
                style={{ alignSelf: "center" }}
                name="language"
                size={100}
                color={"#FF4E40"}
              />
              <Text style={styles.bold}>Change Language</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity title="Emergency" onPress={() => reportEvent()}> */}

            <TouchableOpacity
              title="Emergency"
              onPress={() => alertTemp()}
              style={{
                alignItems: "center",
                marginVertical: 25,
                flex: orientation == "lanscale" ? 1 : 0,
              }}
            >
              <MaterialIcons
                style={{ alignSelf: "center" }}
                name="notification-important"
                size={100}
                color={"red"}
              />
              <Text style={[styles.bold, { color: "red" }]}>REPORT EVENT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              title="Languages"
              onPress={() =>
                Alert.alert(
                  "Help us be better!",
                  "To let us know what you think about this app, please email info.drr.app@gmail.com Thank you :)"
                )
              }
              style={{
                alignItems: "center",
                marginVertical: 25,
                flex: orientation == "lanscale" ? 1 : 0,
              }}
            >
              <MaterialIcons
                style={{ alignSelf: "center" }}
                name="local-post-office"
                size={100}
                color={"#F9A603"}
              />
              <Text style={styles.bold}>Leave Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Settings;
