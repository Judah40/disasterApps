import React, { useEffect, useRef, useState } from "react";
import FastImage from "react-native-fast-image";
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
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../components/styles";
import Term from "./Term";
import Translate from "./Translate";
import Favourites from "./Favourites";
import { getTermsByLanguage } from "../api";
import { getLanguage } from "../components/commonFn";
import { Audio } from "expo-av";
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
      {/* <Stack.Screen name="Favourites" component={Favourites} /> */}
    </Stack.Navigator>
  );
};

const SearchClass = ({ navigation }) => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState({});
  const [isImageUrl, setIsImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(null);
  const [start, setStart] = useState(false);
  const [title, setTitle] = useState("");
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const width = Dimensions.get("window").width;
  const [filteredData, setFilteredData] = useState(terms);
  const [searchQuery, setSearchQuery] = useState("");

  // Cleanup and stop sound when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleSeacrch = (text) => {
    if (text) {
      setSearchQuery(text);
      // Filter the data based on the search query
      const filteredTerms = terms.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      if (filteredData) {
        setTerms(filteredTerms);
      }
    } else {
      setSearchQuery("");
      getTerms();
    }
  };
  const getTerms = async () => {
    setIsLoading(true);
    try {
      const language = await getLanguage();
      const { data } = await getTermsByLanguage(language);
      const { data: termsData } = data;

      if (termsData) {
        setTerms(termsData);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch terms. Please try again later.");
      console.error("GET_TERMS_ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (audioUrl) => {
    try {
      setIsAudioLoading(true);
      if (sound) {
        await sound.unloadAsync(); // Unload previous sound
      }
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });

      if (newSound) {
        setSound(newSound);
        await newSound.playAsync();
        const status = await newSound.getStatusAsync();
        if (status?.durationMillis) {
          const seconds = Math.floor(status.durationMillis / 1000);
          setDuration(seconds * 1000);
          setStart(true);

          setTimeout(() => {
            setStart(false);
          }, seconds * 1000);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to play audio.");
      console.error("AUDIO_PLAY_ERROR: ", error);
    } finally {
      setIsAudioLoading(false);
    }
  };

  const pauseAudio = () => {
    if (sound) {
      sound.pauseAsync();
      setStart(false);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setStart(false);
    }
  };

  const replayAudio = () => {
    if (sound) {
      sound.playAsync();
      setStart(true);
    }
  };

  const renderItem = ({ item }) => (
    <View className="p-4 space-y-5">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-lg">{item.title}</Text>
        {/* <Text className="text-blue-500">{item.languageName}</Text> */}
        {/* <View className="p-1 bg-white rounded"></View> */}
      </View>
      {item.pictogramUrl && (
        <View className="w-full h-40 border rounded border-gray-400">
          <Image source={{ uri: item.pictogramUrl }} className="w-full h-40" />
        </View>
      )}

      <Text className="text-gray-500 ">{item.annotation}</Text>
      <Text>{item.fullDescription}</Text>

      {/* Button to play annotation audio */}
      <TouchableOpacity
        className="bg-blue-500 flex-row justify-between p-3 items-center rounded "
        onPress={() => {
          playAudio(item.annotationAudioUrl);
          setSelectedTerm(item);
          setTitle(item.title);
          setIsImageUrl(item.pictogramUrl);
        }}
      >
        <Text className="text-white font-bold">Play Annotation Audio</Text>
        {isAudioLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <AntDesign name="play" size={24} color="white" />
        )}
        {/* <AntDesign name="play" size={24} color="white" /> */}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-500 flex-row justify-between p-3 items-center rounded"
        onPress={() => {
          playAudio(item.descriptionAudioUrl);
          setTitle(item.title);
          setSelectedTerm(item);
          setIsImageUrl(item.pictogramUrl);
        }}
      >
        <Text className="text-white font-bold">Play Description Audio</Text>
        {isAudioLoading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <AntDesign name="play" size={24} color="white" />
        )}
        {/* <AntDesign name="play" size={24} color="white" /> */}
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Modal
        visible={!!sound}
        presentationStyle="formSheet"
        animationType="slide"
      >
        <SafeAreaView className="flex-1 items-start px-3 py-2">
          <View className="flex-row w-full justify-between items-center py-4 px-3">
            <Text className="text-lg font-semibold">{selectedTerm.title}</Text>
            <TouchableOpacity
              onPress={() => {
                stopAudio();
                setSelectedTerm({});
                setSound(null);
              }}
            >
              <AntDesign name="closecircle" size={30} color="red" />
            </TouchableOpacity>
          </View>
          <View className="w-full items-center">
            {/* <LottieView
              source={require("../assets/Animation.json")}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
            /> */}
            <View className="flex-row my-3 space-x-2">
              <Progress.Bar
                indeterminateAnimationDuration={duration}
                indeterminate={start}
                width={width - 100}
                height={1}
              />
              {start ? (
                <TouchableOpacity onPress={pauseAudio}>
                  <AntDesign name="pausecircle" size={24} color="black" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={replayAudio}>
                  <AntDesign name="play" size={24} color="black" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={stopAudio}>
                <FontAwesome name="stop" size={24} color="black" />
              </TouchableOpacity>
            </View>

            {selectedTerm ? (
              <View className=" p-2 space-y-5">
                <View className="my-2">
                  <Text className="font-extrabold">Annotation</Text>
                  <Text className="text-gray-500">
                    {selectedTerm.annotation}
                  </Text>
                </View>

                <View className="my-2">
                  <Text className="font-extrabold">Description</Text>
                  <Text>{selectedTerm.fullDescription}</Text>
                </View>
              </View>
            ) : (
              <ActivityIndicator size="small" color="#ffffff" />
            )}
          </View>
        </SafeAreaView>
      </Modal>

      <View className="flex-1">
        {/* HEADER */}
        <View className="w-full px-4 flex-row justify-between items-center py-3">
          <Text className="text-lg font-bold ">Search</Text>
          {/* <TouchableOpacity
            style={{ marginTop: 10, marginRight: 10 }}
            onPress={() => {
              navigation.navigate("Favourites");
            }}
          >
            <Ionicons name="heart" size={30} color="black" />
          </TouchableOpacity> */}
        </View>

        <View className="w-full items-center py-2">
          <View className="flex-row w-11/12 bg-white p-2 rounded border-[0.2px] space-x-2">
            <FontAwesome name="search" size={24} color="black" />
            <TextInput
              className="flex-1 bg-white"
              onChangeText={(value) => handleSeacrch(value)}
              value={searchQuery}
            />
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

// <TouchableOpacity
// style={{ flex: 0, marginTop: 10, marginRight: 10 }}
// onPress={() => {
//   navigation.navigate("Favourites");
// }}
// >
// <Ionicons
//   name="heart"
//   size={30}
//   color="black"
//   style={{ marginTop: 5 }}
// />
// </TouchableOpacity>
