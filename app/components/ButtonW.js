import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function ButtonW({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 17,
    borderColor: "#ea0c1c",
    backgroundColor: "#ea0c1c",
    borderRadius: 55,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 17,
    textAlign: "center",
  },
});
