import React, { useEffect, useRef, useState } from "react";
// import { NavigationEvents } from "react-navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/styles";
import Term from "./Term";
import Translate from "./Translate";
import Favourites from "./Favourites";
import { getTermsByLanguage } from "../api";
import { getLanguage } from "../components/commonFn";
import { Audio, Video } from "expo-av";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
const Stack = createNativeStackNavigator();

const Search = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="search" component={SearchClass} />
      <Stack.Screen name="Term" component={Term} />
      <Stack.Screen name="Translate" component={Translate} />
      <Stack.Screen name="Favourites" component={Favourites} />
    </Stack.Navigator>
  );
};

const SearchClass = ({ navigation }) => {
  const audioRef = useRef(new Audio.Sound());

  const [terms, setTerms] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(null); // For storing the duration
  const [start, setStart] = useState(false);
  const width = Dimensions.get("window").width;
  const getTerms = async () => {
    setIsLoading(true);
    await getLanguage()
      .then((value) => {
        getTermsByLanguage(value)
          .then((value) => {
            setIsLoading(false);
            console.log(value.data.data);
            setTerms(value.data.data);
          })
          .catch((value) => {
            setIsLoading(false);

            console.log(value.response);
          });
        console.log(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  async function playAudio(audioUrl) {
    if (sound) {
      // Unload any previous sound before playing a new one
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioUrl,
    });
    setSound(newSound);
    await newSound.playAsync();
    // Get the duration of the audio
    const status = await newSound.getStatusAsync();
    if (status && status.durationMillis) {
      const seconds = Math.floor(status.durationMillis / 1000); // Convert to seconds
      setDuration(seconds * 1000);
      setStart(true);
      setTimeout(() => {
        setStart(false);
      }, seconds * 1000);
    }
  }

  const renderItem = ({ item }) => (
    <View className="p-4 space-y-2">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-lg">{item.title}</Text>
        <View className="p-1 bg-white rounded">
          <Text className="text-blue-500">{item.languageName}</Text>
        </View>
      </View>

      <Text>{item.annotation}</Text>
      <Text className="text-gray-500">{item.fullDescription}</Text>

      {/* Button to play annotation audio */}
      <TouchableOpacity
        className="bg-blue-500 flex-row justify-between p-3 items-center rounded"
        onPress={() => playAudio(item.annotationAudioUrl)}
      >
        <Text>Play Annotation Audio</Text>
        <AntDesign name="play" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-blue-500 flex-row justify-between p-3 items-center rounded"
        onPress={() => playAudio(item.descriptionAudioUrl)}
      >
        <Text>Play Description Audio</Text>
        <AntDesign name="play" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
  useEffect(() => {
    getTerms();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-green-200">
      {/* BACKGROUND IMAGE*/}
      <Modal visible={sound ? true : false}>
        <SafeAreaView className="flex-1 items-start ">
          <View className="w-full items-center">
            <LottieView
              source={require("../assets/Animation.json")}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            />
            <View className="flex-row space-x-2">
              <Progress.Bar
                indeterminateAnimationDuration={duration}
                indeterminate={start}
                width={width - 100}
                height={1}
              />
              <TouchableOpacity
                onPress={() => {
                  playAudio();
                }}
              >
                {start ? (
                  <AntDesign name="pausecircle" size={24} color="black" />
                ) : (
                  <AntDesign name="play" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      <View className="flex-1">
        {/* HEADER*/}
        <View className="w-full px-4  flex-row justify-between items-center">
          <Text className="text-lg font-bold ">Search</Text>
          <TouchableOpacity
            style={{ flex: 0, marginTop: 10, marginRight: 10 }}
            onPress={() => {
              navigation.navigate("Favourites");
            }}
          >
            <Ionicons
              name="heart"
              size={30}
              color="black"
              style={{ marginTop: 5 }}
            />
          </TouchableOpacity>
        </View>

        <View className="w-full items-center py-2">
          <View className="flex-row w-11/12 bg-white p-2 rounded border-[0.2px] space-x-2">
            <FontAwesome name="search" size={24} color="black" />
            <TextInput className="flex-1 bg-white" />
          </View>
        </View>
        {isLoading && <ActivityIndicator />}
        <FlatList
          data={terms}
          renderItem={renderItem}
          keyExtractor={(item) => item.termUUID}
        />
      </View>
    </SafeAreaView>
  );
};

export default Search;
