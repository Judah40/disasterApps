import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

export default function ButtonSL({ lang, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonSL}>
        <Text style={styles.buttonTextSL}>{lang}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonSL: {
    padding: 20,
    backgroundColor: "#f0f8ff",
    borderRadius: 50,
    borderColor: "#486FDF",
    borderWidth: 6,
    marginVertical: 20,
  },
  buttonTextSL: {
    color: "black",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 20,
    textAlign: "center",
  },
});
