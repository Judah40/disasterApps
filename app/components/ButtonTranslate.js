import React from "react";
import { StyleSheet, TouchableOpacity, Text, View, Image } from "react-native";

export default function ButtonTranslate({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonTranslate}>
        <Image
          source={require("../assets/translate.png")}
          style={styles.buttonTextTranslate}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonTranslate: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: "orange",
    borderWidth: 3,
    margin: 5,
    alignItems: "center",
  },
  buttonTextTranslate: {
    height: 30,
    width: 30,
  },
});
