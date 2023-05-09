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
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, []);

  const videoURI =
    "https://ymcadrr.southafricanorth.cloudapp.azure.com/public/search.mp4";

  const [videoLink, setVideoLink] = useState("");

  const getVideo = async (videoURI) => {
    const dirInfo = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + "searchVideo.mp4"
    );
    if (!dirInfo.exists) {
      console.log("Gif directory doesn't exist, creating...");
      //await FileSystem.makeDirectoryAsync(gifDir, { intermediates: true });

      try {
        const { uri } = await FileSystem.downloadAsync(
          videoURI,
          FileSystem.documentDirectory + "searchVideo.mp4",
          {}
        );

        setVideoLink(uri);
        console.log("path", uri);
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
    <View>
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewHelp}>
          <TouchableOpacity
            style={{ justifyContent: "flex-start" }}
            onPress={() => {
              navigation.navigate("InfoClass");
            }}
          >
            <AntDesign
              name="left"
              size={30}
              color="white"
              style={{ marginTop: 20, marginLeft: 1 }}
            />
          </TouchableOpacity>
          <Text style={styles.myHeaderText}>{pageTitle}</Text>
        </View>
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
      </ImageBackground>
    </View>
  );
};
export default HowToSearch;
