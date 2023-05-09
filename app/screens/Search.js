import React, { useEffect, useState } from "react";
import ExpoFastImage from "expo-fast-image";
import { NavigationEvents } from "react-navigation";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import { styles } from "../components/styles";
import { createStackNavigator } from "react-navigation-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Term from "./Term";
import Translate from "./Translate";
import Favourites from "./Favourites";
import { getPageTitle, getLanguage } from "../components/commonFn";
import { CheckError } from "../components/checkErrorFn";

// ---SEARCH MAIN FUNCTION-----------------------------------------------------------------------------------------------------------------------------
const SearchClass = ({ navigation }) => {
  const [data, setData] = useState("");
  const [filteredData, stateSetFilteredData] = useState("");
  const [searchValue, stateSetSearchValue] = useState("");

  const [searchHistory, setSearchHistory] = useState([]);

  // --- FUNCTION TO FETCH ASYNCSTORAGE IF API FAILS-----------------------------------------------------------------------------------------------------------------------------
  const defaultProcessing = async (language) => {
    try {
      var terms = await AsyncStorage.getItem(language.toLowerCase());
      terms = JSON.parse(terms);
      if (terms != null) {
        console.log("AsyncStorage Terms fetch success.");
        setData(terms);
        stateSetFilteredData(terms);
      }
      if (terms === null) {
        console.log("Search Page: Fetch Terms failed");
      }
    } catch (err) {
      console.log("------------", err);
    }
  };

  // ---GET LANGUAGE FROM ASYNCSTORAGE-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [language, setLanguageTerms] = useState("");
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      // console.log("setLanguageTerms Search Page ----->", language);
      APIfetch(language);
    });
  }, []);

  // Used to trigger re-rendering on Focus (fixed Change Language from Settings bug)
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Search Page ----->", language);
      APIfetch(language);
    });
  };

  // ---ATTEMPT DATABASE FETCH-------------------------------------------------------------------------------------------------------------------------------------------------------------

  const APIfetch = async (language) => {
    const url = `https://ymcadrr.southafricanorth.cloudapp.azure.com/api/${language}/terms`;
    //console.log(url);

    fetch(url)
      .then(CheckError)
      .then((data) => {
        console.log("Succesful connection to api ===", data.length);
        if (data.length) {
          setData(data);
          stateSetFilteredData(data);
        } else {
          try {
            console.log("Search page: Connection failed.");
            defaultProcessing(language).then(() => { });
          } catch (err) {
            console.log("Error: AsyncStorage is likely empty", err);
            Alert.alert(
              "There was a problem",
              "Please Download content when online"
            );
            navigation.navigate("Downloads");
          }
        }
      })
      .catch((error) => {
        console.log(error);
        try {
          defaultProcessing(language).then(() => { });
        } catch (err) {
          Alert.alert("There was a problem. Please contact Admin.");
          console.log(err);
        }
      });
  };

  // ---USED IN RENDERITEM FUNCTION-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const Item = (item) => {
    return (
      <TouchableOpacity
        key={item.termNumber}
        onPress={() => goToTerm(item)}
        style={styles.searchTermBox}
      >
        <Text style={styles.searchTitle}>
          {item.termNumber}
          {"."} {item.title}
        </Text>
        <Image style={styles.searchImage} source={{ uri: `${item.picto}` }} />
      </TouchableOpacity>
    );
  };

  // ---CALLED FROM FLATLIST TO DIPLAY FOR EACH ITEM-----------------------------------------------------------------------------------------------------------------------------------------
  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      id={item.id}
      //picto={item.picto}
      termNumber={item.termNumber}
      picto={item.pictogram}
      text={item.text}
      audio={item.audio}
    />
  );

  // ---HANDLES ONPRESS TERM -------------------------------------------------------------------------------------------------------------------------------------------------------------

  const goToTerm = async (item) => {
    // FUNCTION TO USE FOR HISTORY
    // Recently seen terms function. Saves history and updates
    var saved = await AsyncStorage.getItem("history");
    //console.log(saved);
    var list = [];
    if (saved != null) {
      list = JSON.parse(saved);
    }
    // Check for duplicates
    if (!list.includes(item.title)) {
      list.push(item.title);
    }
    AsyncStorage.setItem("history", JSON.stringify(list));
    if (item.audio) {
      global.audiourl = item.audio;
    }
    if (showHistory) {
      setShowHistory(!showHistory);
    }
    navigation.navigate("Term", { item: item });
  };

  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  // useEffect(() => {
  //   getHistoryList();
  // }, []);
  const getHistoryList = async () => {
    var saved = await AsyncStorage.getItem("history");
    var list = [];
    if (saved != null) {
      list = JSON.parse(saved);
    }
    setHistoryList(list);
  };
  // ---HANDLES SEARCH TEXT INPUT-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const searchFunction = (text) => {
    if (text) {
      // filteredData = data.filter....
      let titleSearch = data.filter((item) => {
        const itemUpperCase = item.title.toUpperCase();
        const text_data = text.toUpperCase();
        return itemUpperCase.includes(text_data);
      });
      const updatedData = data.filter((item) => {
        // const item_data = item.title.toUpperCase();
        // const item_id = item.id;
        // const item_text = item.text.toUpperCase();
        // const text_data = text.toUpperCase();

        // if (isNaN(text_data)) {
        //   return (
        //     item_data.indexOf(text_data) > -1 ||
        //     item_text.indexOf(text_data) > -1
        //   );
        // } else {
        //   return item_id.indexOf(text_data) > -1;
        // }
        const itemTitle = item.title.toUpperCase();
        const itemUpperCase = JSON.stringify(item).toUpperCase();
        const text_data = text.toUpperCase();

        return (
          itemUpperCase.includes(text_data) && !itemTitle.includes(text_data)
        );
      });
      const mergedList = [...titleSearch, ...updatedData];
      stateSetSearchValue(text);
      stateSetFilteredData(mergedList); // filteredData = updatedData
      setShowHistory(false);
    } else {
      stateSetFilteredData(data);
      stateSetSearchValue(text);
    }
  };

  // ---PAGE TITLE------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("search").then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, [language]);
  // ---SEARCH RENDER PAGE------------------------------------------------------------------------------------------------------------------------------------------------------
  return (
    <View>
      <NavigationEvents
        onDidFocus={() => {
          setShowHistory(false);
          stateSetSearchValue("");
          setDefaultLanguage();
          getHistoryList();
          console.log("SEARCH page loaded");
        }}
      />

      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewSearch}>
          <Text style={styles.myHeaderTextSearch}>{pageTitle}</Text>
          <TouchableOpacity
            style={{ flex: 0, marginTop: 10, marginRight: 10 }}
            onPress={() => {
              navigation.navigate("Favourites");
            }}
          >
            <Ionicons
              name="heart"
              size={30}
              color="white"
              style={{ marginTop: 5 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {/* Note: Press CMD+K to open a Keyboard in Expo Simulator */}
          <View style={styles.searchBar__unclicked}>
            {/* SEARCHBAR ICON */}
            <View style={{ justifyContent: "center", padding: 10 }}>
              <Feather name="search" size={15} color="black" />
            </View>

            {/* SEARCHBAR INPUT */}
            <TextInput
              style={styles.input}
              placeholder="Search ..."
              value={searchValue}
              onChangeText={(text) => searchFunction(text)}
              onClear={(text) => searchFunction(text)}
              autoCorrect={false}
            />

            {/* History ICON */}
            <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
              <View
                style={{
                  justifyContent: "center",
                  padding: 3,
                  paddingRight: 5,
                  marginTop: 15,
                }}
              >
                <AntDesign
                  name={showHistory == false ? "caretdown" : "caretup"}
                  size={15}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            {/* Clear search text input button */}
            <TouchableOpacity
              onPress={() => {
                stateSetSearchValue("");
                setDefaultLanguage();
                setShowHistory(false);
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  padding: 5,
                  paddingRight: 5,
                  marginTop: 15,

                  marginRight: 7,
                }}
              >
                <AntDesign name={"closecircle"} size={15} color="#ccc" />
              </View>
            </TouchableOpacity>
          </View>
          {showHistory == true && (
            <View style={styles.historyDropDown}>
              <ScrollView>
                <View>
                  {historyList.reverse().map((data, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => searchFunction(data)}
                        style={styles.historyList}
                      >
                        <Text style={styles.historyText}>{data}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}
          {/* TERMS CONTAINER */}
          <View style={styles.searchContainer}>
            <FlatList
              data={filteredData}
              renderItem={renderItem}
              keyExtractor={(item) => item.termNumber}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

// ---SEARCH NAVIGATION------------------------------------------------------------------------------------------------------------------------------------------------------
const Search = createStackNavigator(
  {
    SearchClass: {
      screen: SearchClass,
      navigationOptions: {
        headerShown: false,
        //title: "Search",
        headerBackTitleVisible: false,
        headerLeft: () => null,
        headerStyle: {
          backgroundColor: "orange",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 22,
        },
      },
    },

    Term: {
      screen: Term,
      navigationOptions: {
        title: "",
        //headerShown: false,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "orange",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
          color: "orange",
          fontWeight: "bold",
          fontSize: 22,
        },
      },
    },
    Translate: {
      screen: Translate,
      navigationOptions: {
        headerShown: false,
        headerTitle: "Translate",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "orange",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 22,
        },
      },
    },
    Favourites: {
      screen: Favourites,
      navigationOptions: {
        headerShown: false,
        headerTitle: "Favourites",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "red",
        },
        headerTitleAlign: "center",
        headerTitleStyle: {
          color: "white",
          fontWeight: "bold",
          fontSize: 22,
        },
      },
    },
  },
  {
    headerMode: "screen",
    headerBackTitle: "none",
  }
);

export default Search;
