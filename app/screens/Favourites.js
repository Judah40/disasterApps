import React, { useEffect, useState } from "react";
import { NavigationEvents } from "react-navigation";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  FlatList,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { styles } from "../components/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPageTitle, getLanguage } from "../components/commonFn";
import { CheckError } from "../components/checkErrorFn";

const Favourites = ({ navigation }) => {
  const [data, setData] = useState("");
  const [filteredData, stateSetFilteredData] = useState("");
  const [searchValue, stateSetSearchValue] = useState("");

  // ---PAGE TITLE------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("favs").then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, [language]);

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

  // --- FUNCTION TO FETCH ASYNCSTORAGE IF API FAILS-----------------------------------------------------------------------------------------------------------------------------
  const defaultProcessing = async (language) => {
    try {
      //AsyncStorage.removeItem("favourites"); // This line clears out all favourites
      var terms = await AsyncStorage.getItem(language.toLowerCase());
      terms = JSON.parse(terms);
      if (terms != null) {
        terms = terms.filter(function (terms) {
          return fav.includes(terms.termNumber);
        });
        console.log(" Favourites Page: AsyncStorage Terms fetch success.");
        setData(terms);
        stateSetFilteredData(terms);
      }
      if (terms == null) {
        console.log("Favs Page: Fetch Terms failed");
      }
    } catch {
      console.log("------------");
    }
  };

  // ---GET LANGUAGE FROM ASYNCSTORAGE-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [language, setLanguageTerms] = useState("");
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Favs Page ----->", language);
      APIfetch(language);
    });
  }, []);

  // Used to trigger re-rendering on Focus (fixed Change Language from Settings bug)
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      console.log("setLanguageTerms Favs Page ----->", language);
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
          data = data.filter(function (data) {
            return fav.includes(data.termNumber);
          });
          setData(data);
          stateSetFilteredData(data);
        } else {
          try {
            console.log("Favourites page: Connection failed.");
            defaultProcessing(language).then(() => { });
          } catch {
            console.log("Error: AsyncStorage is likely empty");
            Alert.alert(
              "There was a problem",
              "Please Download content when online"
            );
            navigation.navigate("Downloads");
          }
        }
      })
      .catch((error) => {
        Alert.alert("There was a problem. Please contact Admin.");
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

  return (
    <View>
      <NavigationEvents
        onDidFocus={() => {
          getFav();
          setDefaultLanguage();
          getHistoryList();
          stateSetSearchValue("");
          console.log("FAVS page loaded");
        }}
      />

      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewFav}>
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() => {
              navigation.navigate("SearchClass");
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

        <View style={{ flex: 1 }}>
          {/* Note: Press CMD+K to open a Keyboard in Expo Simulator */}
          <View style={styles.searchBar__unclicked}>
            {/* SEARCHBAR ICON */}
            <View style={{ justifyContent: "center", padding: "3%" }}>
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
                  marginRight: 5,
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
                  marginLeft: 3,
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

export default Favourites;
