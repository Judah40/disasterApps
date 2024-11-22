import React, { useEffect, useState } from "react";
import {
  View,
  ImageBackground,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ButtonSL from "../components/ButtonSL";
import { setLanguage } from "../components/commonFn";
import { getAllLanguages } from "../api";

const Languages = ({ navigation }) => {
  const [langButtons, setLangButtons] = useState();
  useEffect(() => {
    getAllLanguages()
      .then((value) => {
        setLangButtons(value.data.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  return (
    <ImageBackground
      source={require("../assets/abstract-pattern-coloured-oil-bubbles-water.jpg")}
      className="flex-1 items-center justify-center space-y-2"
    >
      <View className="w-11/12 items-center">
        <Text className="text-xl font-semibold">Select Language</Text>
      </View>
      {/* BUTTONS CONTAINER */}
      <View className="h-3/6 rounded-lg items-center bg-white w-11/12 px-4">
        <View className="mt-4">
          {!langButtons && <ActivityIndicator color={"gray"} />}
        </View>
        <FlatList
          data={langButtons}
          keyExtractor={(item) => item.languageId}
          showsVerticalScrollIndicator={false}
          className="w-11/12 "
          renderItem={({ item }) => {
            return (
              <ButtonSL
                lang={item.languageName}
                onPress={() => {
                  setLanguage(item.languageName), navigation.navigate("Tabs");
                }}
              />
            );
          }}
        />
      </View>
    </ImageBackground>
  );
};

export default Languages;
