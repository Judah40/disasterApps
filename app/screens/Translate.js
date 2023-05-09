import React, { useEffect, useState } from "react";
import { View, ImageBackground, Text, FlatList, Alert } from "react-native";
import { styles } from "../components/styles";
import { NavigationEvents } from "react-navigation";
import ButtonSL from "../components/ButtonSL";
import langButtonsHardCode from "../components/langButtons.json";
import { getPageTitle, setLanguage, getLanguage } from "../components/commonFn";
import { CheckError } from "../components/checkErrorFn";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Translate = ({ navigation }) => {
  const [langButtons, setLangButtons] = useState("");
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguage(language.toLowerCase());
      //console.log("getLanguage Languages Page ----->", language);
      APIfetch(language);
    });
  }, []);
  const [language, setLanguageTerms] = useState("");
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Search Page ----->", language);
      APIfetch(language);
    });
  };
  const defaultProcessing = async () => {
    try {
      var allLanguages = await AsyncStorage.getItem("all-languages");
      allLanguages = JSON.parse(allLanguages);
      if (allLanguages != null) {
        console.log("AsyncStorage Terms fetch success.");
        setLangButtons(allLanguages);
      }
      if (allLanguages == null) {
        console.log("Translate Page: Fetch Terms failed", allLanguages);
        try {
          setLangButtons(langButtonsHardCode);
        } catch (err) {
          Alert.alert("There was a problem. Please contact Admin.");
          console.log("internal file langButtons error: ", err);
        }
      }
    } catch (err) {
      console.log("Error Translate Page: ", err);
    }
  };

  const APIfetch = async () => {
    const url = `https://ymcadrr.southafricanorth.cloudapp.azure.com/api/languages`;
    //console.log(url);

    fetch(url)
      .then(CheckError)
      .then((data) => {
        console.log("Succesful connection to api");
        if (data.length) {
          setLangButtons(data);
        } else {
          console.log(
            "Error: There is a problem with the database. The successful terms fetch was empty"
          );
          defaultProcessing().then(() => { });
          // Alert.alert("There was a problem. Please contact Admin.");
        }
      })
      .catch((error) => {
        try {
          console.log(
            error,
            "Translate page: Connection failed. Offline mode on. "
          );
          defaultProcessing().then(() => { });
        } catch {
          console.log("Error: AsyncStorage is likely empty");
          Alert.alert("Please Download terms");
          navigation.navigate("Downloads");
        }
      });
  };

  const termDefaultProcessing = async (language) => {
    try {
      var terms = await AsyncStorage.getItem(language.toLowerCase());
      terms = JSON.parse(terms);
      if (terms != null) {
        console.log("AsyncStorage Terms fetch success.");
        let my_terms = terms.filter(
          (item) => item.termNumber === navigation.state.params.term_number
        );
        my_terms[0].picto = my_terms[0].pictogram;
        delete my_terms[0].pictogram;
        if (my_terms == "") {
          Alert.alert("This term does not exist in this language");
          navigation.navigate("SearchClass");
        } else {
          navigation.navigate("Term", { item: my_terms[0] });
        }
      }
      if (terms == null) {
        console.log("Translate Page: Fetch Terms failed");
      }
    } catch {
      console.log("------------");
    }
  };

  const termAPIfetch = async (language) => {
    const url = `https://ymcadrr.southafricanorth.cloudapp.azure.com/api/${language}/terms`;
    //console.log(url);

    fetch(url)
      .then(CheckError)
      .then((data) => {
        console.log("Succesful connection to api ===", data.length);
        if (data.length) {
          let my_terms = data.filter(
            (item) => item.termNumber === navigation.state.params.term_number
          );
          my_terms[0].picto = my_terms[0].pictogram;
          delete my_terms[0].pictogram;
          if (my_terms == "") {
            Alert.alert("This term does not exist in this language");
            navigation.navigate("SearchClass");
          } else {
            navigation.navigate("Term", { item: my_terms[0] });
          }
        } else {
          console.log(
            "Error: There is a problem with the database. The successful terms fetch was empty"
          );
          Alert.alert("There was a problem. Please contact Admin.");
        }
      })
      .catch((error) => {
        try {
          console.log(error, "Translate page: Connection failed.");
          termDefaultProcessing(language).then(() => { });
        } catch {
          console.log("Error: AsyncStorage is likely empty");
          Alert.alert("Please Download terms");
          navigation.navigate("Downloads");
        }
      });
  };

  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      APIfetch();
      getPageTitle("termLang").then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, []);

  return (
    <View>
      <NavigationEvents
        onDidFocus={() => {
          setDefaultLanguage();
          console.log("Translate page loaded");
        }}
      />
      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewSearch}>
          <Text style={styles.myHeaderText}>{pageTitle}</Text>
        </View>

        {/* BUTTONS CONTAINER */}
        <View style={styles.containerSL}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={langButtons}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => {
              return (
                <ButtonSL
                  lang={item.name}
                  onPress={() => {
                    termAPIfetch(item.name).then(async () => { });
                  }}
                />
              );
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Translate;
