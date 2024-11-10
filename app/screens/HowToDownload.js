import React, { useEffect, useState } from "react";
import { getPageTitle } from "../components/commonFn";
import {
  View,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { styles } from "../components/styles";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";

const HowToDownload = ({ navigation }) => {
  const { width } = Dimensions.get("window");

  const [isLoading, setIsLoading] = useState(false);
  const handleLoadStart = () => {
    setIsLoading(true); // Start loading indicator when video starts loading
  };

  const handleLoad = () => {
    setIsLoading(false); // Hide loading indicator when video is loaded
  };

  return (
    <View className="flex-1 items-center justify-center">
      {isLoading && <ActivityIndicator />}
      <Video
        source={{
          uri: "http://res.cloudinary.com/dggooq5sq/video/upload/v1728475317/zw79wfptnz3xh7isdc5p.mp4",
        }}
        style={{ width: width - 20, height: width - 20 }}
        useNativeControls
        resizeMode="contain"
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
      />
    </View>
  );
};
export default HowToDownload;
