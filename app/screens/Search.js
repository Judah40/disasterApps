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

// import React, { useEffect, useState } from "react";

const SearchClass = ({ navigation }) => {
  const [terms, setTerms] = useState([]); // Full list of terms
  const [visibleData, setVisibleData] = useState([]); // Data displayed on the UI
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [hasMore, setHasMore] = useState(true); // Flag for more data
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState({});
  const [duration, setDuration] = useState(null);
  const [start, setStart] = useState(false);





  const [isImageUrl, setIsImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const width = Dimensions.get("window").width;
  const ITEMS_PER_PAGE = 5;

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filteredTerms = terms.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setVisibleData(filteredTerms.slice(0, page * ITEMS_PER_PAGE));
    } else {
      setVisibleData(terms.slice(0, page * ITEMS_PER_PAGE));
    }
  };

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const language = await getLanguage();
      const { data } = await getTermsByLanguage(language); // Fetch all terms
      const { data: termsData } = data;

      if (termsData.length > 0) {
        setTerms(termsData);
        setVisibleData(termsData.slice(0, ITEMS_PER_PAGE)); // Show initial 5 items
        setHasMore(termsData.length > ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch terms. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      const nextData = terms.slice(0, nextPage * ITEMS_PER_PAGE);

      setVisibleData(nextData);
      setPage(nextPage);
      setHasMore(nextData.length < terms.length);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchTerms().finally(() => setIsRefreshing(false));
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
      <Text className="font-semibold text-lg">{item.title}</Text>
      {item.pictogramUrl && (
        <Image source={{ uri: item.pictogramUrl }} className="w-full h-40" />
      )}
      <Text className="text-gray-500">{item.annotation}</Text>
      {item && item.annotationAudioUrl && (
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
      )}

      {item && item.descriptionAudioUrl && (
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
      )}
    </View>
  );

  useEffect(() => {
    fetchTerms();
  }, []);
  // Cleanup and stop sound when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
        <View className="w-full items-center py-2">
          <View className="flex-row w-11/12 bg-white p-2 rounded border-[0.2px] space-x-2">
            <FontAwesome name="search" size={24} color="black" />
            <TextInput
              className="flex-1 bg-white"
              onChangeText={handleSearch}
              value={searchQuery}
            />
          </View>
        </View>

        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item) => item.termUUID}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            isLoading && page > 1 ? <ActivityIndicator /> : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

// {isLoading && page === 1 && <ActivityIndicator />}

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
