import React, { useState, useEffect } from "react";
import { NavigationEvents } from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { styles } from "../components/styles";
import * as FileSystem from "expo-file-system";
import { getPageTitle, getLanguage } from "../components/commonFn";

// ---TIME COUNTING ALERT-----------------------------------------------------------------------------------------------------------------------------
const CustomAlert = (props) => {
  const my_width = String(props.count + "%");

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(false);
      }}
    >
      <Pressable
        style={[
          Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
          styles.backdrop,
        ]}
      />
      <View style={styles.alert_container}>
        <Text>Downloading...</Text>
        <View style={styles.progressBar}>
          <Animated.View
            style={
              ([styles.absoluteFill],
                { backgroundColor: "#8BED4F", width: my_width })
            }
          ></Animated.View>
        </View>
        <Text>{props.count}%</Text>
      </View>
    </Modal>
  );
};

// ---DOWNLOADS MAIN FUNCTION-----------------------------------------------------------------------------------------------------------------------------
const Downloads = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(0);

  const [orientation, setOrientation] = useState("landscale");
  useEffect(() => {
    checkOrientation();
  }, []);

  const checkOrientation = () => {
    var width = Dimensions.get("window").width;
    var height = Dimensions.get("window").height;
    setOrientation(width > height ? "lanscale" : "portrait");
  };
  Dimensions.addEventListener("change", () => {
    checkOrientation();
  });

  // ---DOWNLOAD TEXT----------------------------------------------------------------------------------------------------------------------------------------
  const downloadText = () => {
    setModalVisible(true);
    setCount(0);
    fetch(
      "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/languages" /*GETS ALL LANGUAGES FROM DATABASE*/
    )
      .then((response) => response.json())

      .then(async (jsonLang) => {
        try {
          await AsyncStorage.setItem(
            "all-languages",
            JSON.stringify(jsonLang)
          ); /*UPDATES ALL LANGUAGES LIST (CURRENTLY langButtons.json)*/
        } catch (error) {
          console.log(error);
          setModalVisible(false);
        }
      })
      .catch((error) => {
        Alert.alert("There was a Problem", "Please try again later"),
          setModalVisible(false);
      })
      .then(async () => {
        console.log("log3");
        try {
          var languages = await AsyncStorage.getItem(
            "all-languages" /*GETS ALL LANGUAGES FROM ASYNCSTORAGE*/
          );
          languages = JSON.parse(languages);
          let total_completed = 0;
          for (var l in languages) {
            const lang = languages[l];
            fetch(
              "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/" +
              lang.name.toLowerCase() +
              "/terms" /*GETS SPECIFIC LANGUAGES FROM DATABASE*/
            )
              .then((response) => response.json())
              .then(async (jsonTerms) => {
                try {
                  for (let x in jsonTerms) {
                    jsonTerms[x]["id"] = String(jsonTerms[x]["id"]);
                    jsonTerms[x]["language"] = String(lang.name.toLowerCase());
                    jsonTerms[x]["pictoURL"] = String(
                      jsonTerms[x]["pictogram"]
                    );
                    jsonTerms[x]["audioURL"] = String(jsonTerms[x]["audio"]);
                  }
                  await AsyncStorage.setItem(
                    lang.name.toLowerCase(),
                    JSON.stringify(jsonTerms)
                  ); /*UPDATES DATABASE FOR EACH LANGUAGE*/
                  total_completed += 1;
                  let percentage_completed =
                    (total_completed / languages.length) * 100;
                  setCount(percentage_completed.toFixed(1));
                  if (percentage_completed == 100) {
                    setModalVisible(false);
                  }
                } catch (error) {
                  console.log(error);
                  setModalVisible(false);
                }
              })
              .catch((error) => console.log(error));
          }
          // let total_lang = Object.keys(languages).length;
          // let total_completed = 0;
          // for (let x in languages) {
          //   let language = languages[x]["lang"];

          // }
        } catch (error) {
          console.log(error);
          setModalVisible(false);
        }
      });
  };

  // ---DOWNLOAD AUDIO-----------------------------------------------------------------------------------------------------------------------------
  const downloadAudio = async () => {
    setModalVisible(true);
    setCount(0);
    // This line checks for existing storage
    var lanDir = FileSystem.documentDirectory;
    const dirInfo = await FileSystem.getInfoAsync(lanDir);
    let total_terms = 1;
    let total_audio_completed = 0;
    try {
      var languages = await AsyncStorage.getItem("all-languages");
      var english_terms = await AsyncStorage.getItem("english");
      english_terms = JSON.parse(english_terms);
      languages = JSON.parse(languages);
      total_terms =
        (Object.keys(languages).length + 1) * Object.keys(english_terms).length;
      for (let x in languages) {
        const language = languages[x]["name"].toLowerCase();
        var terms = await AsyncStorage.getItem(
          language
        ); /*GETS SPECIFIC LANGUAGES FROM ASYNCSTORAGE*/
        terms = JSON.parse(terms); /*PARSES STRING INTO JSON*/
        for (let y in terms) {
          const audioURL = terms[y]["audioURL"];
          console.log(audioURL)
          const termNumber = ("0" + terms[y]["termNumber"]).slice(-2);
          const title = english_terms[y]["title"].split(" ").join("_");
          try {
            var lanDir = FileSystem.documentDirectory + language + "/";
            const dirInfo = await FileSystem.getInfoAsync(lanDir);
            if (!dirInfo.exists) {
              await FileSystem.makeDirectoryAsync(lanDir, {
                intermediates: true,
              }); /*CREATES DIRECTORY IF DOESN'T EXIST ALREADY*/
            }
            FileSystem.downloadAsync(
              audioURL,
              FileSystem.documentDirectory +
              language +
              "/" +
              termNumber +
              "_" +
              title +
              "_" +
              language +
              "_audio.mp3" /*DOWNLOADS AUDIO TO THIS DIRECTORY*/
            )
              .then((file) => {
                total_audio_completed += 1;
                let percentage_completed =
                  (total_audio_completed / total_terms) * 100;
                setCount(percentage_completed.toFixed(1));
                console.log(file)
              })
              .catch((error) => {
                console.error(error);
                setModalVisible(false);
              });
          } catch (error) {
            console.log(error);
            setModalVisible(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setModalVisible(false);
    }
    try {
      var terms = await AsyncStorage.getItem("english");
      terms = JSON.parse(terms); /*PARSES STRING INTO JSON*/
      for (let y in terms) {
        let pictoURL = terms[y]["pictoURL"];
        let termNumber = ("0" + terms[y]["termNumber"]).slice(-2);
        let title = terms[y]["title"].split(" ").join("_");
        var lanDir = FileSystem.documentDirectory + "pictogram/";
        const dirInfo = await FileSystem.getInfoAsync(lanDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(lanDir, {
            intermediates: true,
          }); /*CREATES DIRECTORY IF DOESN'T EXIST ALREADY*/
        }
        FileSystem.downloadAsync(
          pictoURL,
          FileSystem.documentDirectory +
          "pictogram/" +
          termNumber +
          "_" +
          title +
          ".png" /*DOWNLOADS PICTO TO THIS DIRECTORY*/
        )
          .then(() => {
            total_audio_completed = total_audio_completed + 1;
            let percentage_completed =
              (total_audio_completed / total_terms) * 100;
            setCount(percentage_completed.toFixed(1));
            if (percentage_completed == 100) {
              setModalVisible(false);
            }
          })
          .catch((error) => {
            console.error(error);
            setModalVisible(false);
          });
      }
    } catch (error) {
      console.log(error);
      setModalVisible(false);
    }
    try {
      editURLs();
    } catch (error) {
      console.log(error);
      setModalVisible(false);
    }
  };

  // ---URL PROCESSING-----------------------------------------------------------------------------------------------------------------------------
  const editURLs = async () => {
    fetch(
      "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/languages" /*GETS ALL LANGUAGES FROM DATABASE*/
    )
      .then((response) => response.json())
      .catch((error) => console.log(error))
      .then(async (jsonLang) => {
        try {
          await AsyncStorage.setItem(
            "all-languages",
            JSON.stringify(jsonLang)
          ); /*UPDATES ALL LANGUAGES LIST (CURRENTLY langButtons.json)*/
        } catch (error) {
          console.log(error);
          setModalVisible(false);
          Alert.alert("There was a Problem", "Please try again later");
        }
      })
      .then(async () => {
        try {
          var languages = await AsyncStorage.getItem(
            "all-languages" /*GETS ALL LANGUAGES FROM ASYNCSTORAGE*/
          );
          var english_terms = await AsyncStorage.getItem("english");
          english_terms = JSON.parse(english_terms);
          languages = JSON.parse(languages);
          for (let x in languages) {
            let language = languages[x]["name"].toLowerCase();
            fetch(
              "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/" +
              language +
              "/terms" /*GETS SPECIFIC LANGUAGES FROM DATABASE*/
            )
              .then((response) => response.json())
              .catch((error) => console.log(error))
              .then(async (jsonTerms) => {
                try {
                  for (let x in jsonTerms) {
                    jsonTerms[x]["language"] = String(language);
                    let termNumber = ("0" + jsonTerms[x]["termNumber"]).slice(
                      -2
                    );
                    let title = english_terms[x]["title"].split(" ").join("_");
                    jsonTerms[x]["pictoURL"] = String(
                      jsonTerms[x]["pictogram"]
                    );
                    jsonTerms[x]["pictogram"] = String(
                      FileSystem.documentDirectory +
                      "pictogram/" +
                      termNumber +
                      "_" +
                      title +
                      ".png"
                    );
                    jsonTerms[x]["id"] = String(jsonTerms[x]["id"]);
                    jsonTerms[x]["audioURL"] = String(jsonTerms[x]["audio"]);
                    jsonTerms[x]["audio"] = String(
                      FileSystem.documentDirectory +
                      language +
                      "/" +
                      termNumber +
                      "_" +
                      title +
                      "_" +
                      language +
                      "_audio.mp3"
                    );
                  }
                  await AsyncStorage.setItem(
                    language,
                    JSON.stringify(jsonTerms)
                  ); /*UPDATES DATABASE FOR EACH LANGUAGE*/
                } catch (error) {
                  console.log(error);
                  setModalVisible(false);
                  Alert.alert("There was a Problem", "Please try again later");
                }
              });
          }
        } catch (error) {
          console.log(error);
          setModalVisible(false);
          Alert.alert("There was a Problem", "Please try again later");
        }
      });
  };
  // Used to trigger re-rendering on Focus (fixed Change Language from Settings bug)
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Downloads Page ----->", language);
    });
  };

  // ---GET LANGUAGE FROM ASYNCSTORAGE-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [language, setLanguageTerms] = useState("");
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      // console.log("setLanguageTerms Downloads Page ----->", language);
    });
  }, []);

  // ---PAGE TITLE-----------------------------------------------------------------------------------------------------------------------------------------
  const [pageTitle, setPageTitle] = useState("");
  useEffect(() => {
    try {
      getPageTitle("downloads").then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
      return Promise.reject();
    }
  }, [language]);

  // ---DOWNLOADS RENDER PAGE-----------------------------------------------------------------------------------------------------------------------------
  return (
    <View>
      <NavigationEvents onDidFocus={() => setDefaultLanguage()} />
      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewD}>
          <Text style={styles.myHeaderTextD}>{pageTitle}</Text>
          {/* {pageTitle} */}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <CustomAlert
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            count={count}
            setCount={setCount}
          />
          <View
            style={{
              flexDirection: orientation == "lanscale" ? "row" : "column",
              justifyContent: "space-evenly",
            }}
          >
            <TouchableOpacity
              title="Text"
              onPress={downloadText}
              style={{
                flex: orientation == "lanscale" ? 1 : 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Entypo name="text-document" size={100} color="#7fd13a" />
              <Text style={{ fontWeight: "bold" }}>Download Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              title="Audio"
              onPress={downloadAudio}
              style={{
                flex: orientation == "lanscale" ? 1 : 1,
                alignItems: "center",
              }}
            >
              <AntDesign name="sound" size={100} color="orange" />
              <Text style={{ fontWeight: "bold" }}>Download Audio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Downloads;
