import React, { useState } from "react";
import { View, Text, Image, ImageBackground, StatusBar } from "react-native";
import ButtonW from "../components/ButtonW";
import { styles } from "../components/styles";
import { setLanguage, getLanguage } from "../components/commonFn";


const Welcome = ({ navigation }) => {
  const [showIndex, setShowIndex] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      {showIndex ? (
        <ImageBackground
          source={require("../assets/DRR_Image.png")}
          style={styles.backGroundImage}
        >
          <View style={styles.welcomePage}>
            <Image source={require("../assets/DRR.png")} />
            <Text
              style={{
                paddingTop: 15,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Disaster Risk Reduction
            </Text>

            <Text
              style={{
                paddingBottom: 15,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Terminology
            </Text>

            <ButtonW
              text="Get Started"
              onPress={() => {
                setLanguage("english"), navigation.navigate("Languages");
              }}
            />
          </View>
        </ImageBackground>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Welcome;
