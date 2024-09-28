import React, { useEffect, useState } from "react";
import { getPageTitle } from "../components/commonFn";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../components/styles";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

const HowToSearch = ({ navigation }) => {
  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("howtoS").then((result) => {
        setPageTitle(result);
      });
    } catch {}
  }, []);

  const videoURI =
    "https://ymcadrr.southafricanorth.cloudapp.azure.com/public/search.mp4";

  const [videoLink, setVideoLink] = useState("");

  const getVideo = async (videoURI) => {
    const dirInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "searchVideo.mp4"
    );
    if (!dirInfo.exists) {
      //await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });

      try {
        const { uri } = await FileSystem.downloadAsync(
          videoURI,
          FileSystem.documentDirectory + "searchVideo.mp4",
          {}
        );

        setVideoLink(uri);
        setOnline(false);
      } catch {
        setOnline(true);
        //Alert.alert("Please Download when online again", ":)");
      }
    } else {
      setVideoLink(FileSystem.documentDirectory + "searchVideo.mp4");
      setOnline(false);
    }
  };

  useEffect(() => {
    getVideo(videoURI);
  }, []);

  const [online, setOnline] = useState(null);

  return (
    <View className="flex-1 ">
      <View className="flex-1">
        <ScrollView>
          <View style={styles.howToContainer}>
            <View style={{ alignSelf: "center" }}>
              {online == false ? (
                <Video
                  style={{
                    height: 350,
                    width: 350,
                  }}
                  resizeMode={"contain"}
                  source={{ uri: videoLink }}
                  useNativeControls
                />
              ) : (
                <Video
                  style={{
                    height: 300,
                    width: 350,
                  }}
                  source={{
                    uri: videoURI,
                  }}
                  useNativeControls
                />
              )}
              {/* {online == false ? <Text>Offline</Text> : <Text>ONLINE</Text>} */}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
export default HowToSearch;
