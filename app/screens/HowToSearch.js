import React, { useEffect, useState } from "react";
import { getPageTitle } from "../components/commonFn";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { styles } from "../components/styles";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const HowToSearch = () => {
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
          uri: "https://res.cloudinary.com/dggooq5sq/video/upload/v1728475319/hx48zy8ct9y2i86vtybq.mp4",
        }}
        style={{ width: width - 20, height: width - 20 }}
        useNativeControls
        resizeMode="contain"
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
        shouldPlay
        isMuted={false}
      />
    </View>
  );
};
export default HowToSearch;
