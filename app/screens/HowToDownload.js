import React, { useEffect, useState } from "react";
import { getPageTitle } from "../components/commonFn";
import {
  View,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { styles } from "../components/styles";
import { AntDesign } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as FileSystem from "expo-file-system";

const HowToDownload = ({ navigation }) => {
  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("howtoD").then((result) => {
        setPageTitle(result);
      });
    } catch {
    }
  }, []);

  const videoURI =
    "https://ymcadrr.southafricanorth.cloudapp.azure.com/public/download.mp4";

  const [videoLink, setVideoLink] = useState("");

  const getVideo = async (videoURI) => {
    const dirInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "downloadVideo.mp4"
    );
    if (!dirInfo.exists) {
      
      try {
        await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });
        const { uri } = await FileSystem.downloadAsync(
          videoURI,
          FileSystem.documentDirectory + "downloadVideo.mp4",
          {}
        );

        setVideoLink(uri);
        setOnline(false);
      } catch {
        setOnline(true);
        //Alert.alert("Please Download when online again", ":)");
      }
    } else {
      setVideoLink(FileSystem.documentDirectory + "downloadVideo.mp4");
      setOnline(false);
    }
  };

  useEffect(() => {
    getVideo(videoURI);
  }, []);

  const [online, setOnline] = useState(null);
  return (
    <View>
      <View
     className="flex-1 bg-red-500"
      >
       
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

export default HowToDownload;
