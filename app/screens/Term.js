import React, { useEffect, useState } from "react";
import ImageModal from "react-native-image-modal";
import { NavigationEvents } from "react-navigation";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  Share,
  Modal,
} from "react-native";
import { FontAwesome, Entypo, Ionicons } from "@expo/vector-icons";
import { styles } from "../components/styles";
import ButtonTranslate from "../components/ButtonTranslate";
import { Audio } from "expo-av";
import AudioSlider from "../components/AudioSlider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Term = ({ navigation }) => {
  // Each part of Term definition
  const termID = navigation.state.params.item.id;
  const termNumber = navigation.state.params.item.termNumber;
  const termTitlePrep = navigation.state.params.item.title;

  const termTitle = termTitlePrep.trim();
  const termTextPrep = navigation.state.params.item.text;
  const termText = termTextPrep.trim();

  const termPicto = navigation.state.params.item.picto;
  const termAudio = navigation.state.params.item.audio;

  //console.log(termPicto);
  // ---SHARE MEDIA BUTTON-----------------------------------------------------------------------------------------------------------------------------
  const share = async (title_to_share, message_to_share, url_to_share) => {
    try {
      const result = await Share.share({
        title: title_to_share,
        message: message_to_share,
        url: url_to_share,
      });
      if (result.action == Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared");
        } else {
          console.log("Not shared");
        }
      } else if (result.action == Share.dismissedAction) {
        console.log("Dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const translateTerm = () => {
    navigation.navigate("Translate", { term_number: termNumber });
  };

  let title = String(termTitle);
  let message = String(termText);
  let url = String(termPicto);
  const [shortTxtFlag, setShortTxtFlag] = useState(true);

  // ---FAVOURITES BUTTON-----------------------------------------------------------------------------------------------------------------------------
  const [fav, setFav] = useState([]);

  useEffect(() => {
    getFav();
  }, []);

  const getFav = async () => {
    var saved = await AsyncStorage.getItem("favourites");
    // console.log(saved);
    var list = [];
    if (saved != null) {
      list = JSON.parse(saved);
    }
    setFav(list);
  };

  const addToFav = async (item) => {
    // FAVOURITES FUNCTION

    //AsyncStorage.removeItem("favourites");// This line clears out all favourites
    var saved = await AsyncStorage.getItem("favourites");
    //console.log(saved);
    var list = [];
    if (saved != null) {
      list = JSON.parse(saved);
    }
    // Check for duplicates
    if (!list.includes(item)) {
      list.push(item);
      // console.log(item);
    } else {
      list = list.filter(function (data) {
        return data != item;
      });
    }

    AsyncStorage.setItem("favourites", JSON.stringify(list));
    setFav(list);
  };

  // const audioPlayer = () => {
  //   console.log("I got played!");
  //   return <AudioSlider audio={`${termAudio}`} />;
  // };

  const audioPlayer = () => {
    return <AudioSlider audio={`${termAudio}`} />;
  };

  return (
    <SafeAreaView style={styles.termContainer}>
      <NavigationEvents
        onDidFocus={() => {
          audioPlayer();
          console.log("TERM page loaded");
        }}
      />
      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        <ScrollView
          style={{ flex: 1, marginHorizontal: 20, backgroundColor: "white" }}
        >
          <View style={{ flexDirection: "row", width: "100%" }}>
            <View style={{ flex: 1 }}>
              <View>
                <Text style={styles.termTitle}>{termTitle}</Text>
              </View>
            </View>

            <View style={{ flex: 0 }}>
              <TouchableOpacity style={{ marginHorizontal: 10, marginTop: 7 }}>
                <ButtonTranslate onPress={translateTerm}></ButtonTranslate>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <ImageModal
              resizeMode="contain"
              imageBackgroundColor="#FFFFFF"
              style={styles.termImage}
              source={{ uri: `${termPicto}` }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.termAudioPlayer}>{audioPlayer()}</View>
            <View style={{ flex: 2 }}>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity>
                  <FontAwesome
                    style={{ margin: "1%" }}
                    name="whatsapp"
                    size={32}
                    color="#4ec25a"
                    onPress={() => share(title, message, url)}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Entypo
                    style={{ margin: "1%" }}
                    name="facebook"
                    size={32}
                    color="#395697"
                    onPress={() => share(title, message, url)}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ flex: 0, marginTop: 10, marginLeft: 15 }}
                onPress={() => addToFav(termNumber)}
              >
                <Ionicons
                  name="heart"
                  size={30}
                  color={fav.includes(termNumber) ? "red" : "gray"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => setShortTxtFlag(!shortTxtFlag)}>
            {shortTxtFlag == true ? (
              <Text style={styles.termText} numberOfLines={2}>
                {termText}
              </Text>
            ) : (
              <Text style={styles.termText}>{termText}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default Term;
