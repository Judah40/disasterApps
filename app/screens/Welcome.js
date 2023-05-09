import React, { useEffect, useState } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import ButtonW from "../components/ButtonW";
import { styles } from "../components/styles";
import { NavigationEvents } from "react-navigation";
import { setLanguage, getLanguage } from "../components/commonFn";
import { CheckError } from "../components/checkErrorFn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

const Welcome = ({ navigation }) => {
  // Setting initial Route

  // ---DOWNLOAD TEXT----------------------------------------------------------------------------------------------------------------------------------------
  const downloadText = () => {
    fetch(
      "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/languages" /*GETS ALL LANGUAGES FROM DATABASE*/
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      })
      .then(async (jsonLang) => {
        try {
          await AsyncStorage.setItem(
            "all-languages",
            JSON.stringify(jsonLang)
          ); /*UPDATES ALL LANGUAGES LIST (CURRENTLY langButtons.json)*/
        } catch (error) {
          //console.log(error);
          console.log("initial language set up in progress..");
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then(async () => {
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
                } catch (error) {
                  console.log(error);
                }
              });
            //console.log("initial language set up: Success!");
          }
          // let total_lang = Object.keys(languages).length;
          // let total_completed = 0;
          // for (let x in languages) {
          //   let language = languages[x]["lang"];

          // }
        } catch (error) {
          console.log(error);
        }
      });
  };

  // ---DOWNLOAD Pictograms-----------------------------------------------------------------------------------------------------------------------------
  const downloadPictograms = async () => {
    try {
      fetch(
        "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/english/terms" /*GETS ALL LANGUAGES FROM DATABASE*/
      )
        .then((response) => response.json())
        .then(async (terms) => {
          for (let y in terms) {
            let pictoURL = terms[y]["pictogram"];
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
            ).catch((error) => {
              console.error(error);
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
    try {
      editURLs();
    } catch (error) {
      console.log(error);
    }
  };

  // ---URL PROCESSING-----------------------------------------------------------------------------------------------------------------------------
  const editURLs = async () => {
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
        }
      })
      .then(async () => {
        try {
          var languages = await AsyncStorage.getItem(
            "all-languages" /*GETS ALL LANGUAGES FROM ASYNCSTORAGE*/
          );
          fetch(
            "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/english/terms" /*GETS ALL LANGUAGES FROM DATABASE*/
          )
            .then((response) => response.json())
            .then(async (english_terms) => {
              languages = JSON.parse(languages);
              for (let x in languages) {
                let language = languages[x]["name"].toLowerCase();
                fetch(
                  "https://ymcadrr.southafricanorth.cloudapp.azure.com/api/" +
                  language +
                  "/terms" /*GETS SPECIFIC LANGUAGES FROM DATABASE*/
                )
                  .then((response) => response.json())
                  .then(async (jsonTerms) => {
                    try {
                      for (let x in jsonTerms) {
                        jsonTerms[x]["language"] = String(language);
                        let termNumber = (
                          "0" + jsonTerms[x]["termNumber"]
                        ).slice(-2);
                        let title = english_terms[x]["title"]
                          .split(" ")
                          .join("_");
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
                        delete jsonTerms[x]["pictoURL"];
                      }
                      await AsyncStorage.setItem(
                        language,
                        JSON.stringify(jsonTerms)
                      ); /*UPDATES DATABASE FOR EACH LANGUAGE*/
                    } catch (error) {
                      console.log(error);
                    }
                  });
              }
            });
        } catch (error) {
          console.log(error);
        }
      });
  };

  const [showIndex, setShowIndex] = useState(false);
  const PageNav = async () => {
    //AsyncStorage.removeItem("currentlang");
    getLanguage().then((language) => {
      //console.log("getLanguage Welcome page ----->", language);
      if (language != null) {
        navigation.navigate("BottomTabNav");
      } else {
        setShowIndex(true);
      }
    });
  };

  return (
    <View style={styles.container}>
      <NavigationEvents onDidFocus={() => PageNav()} />
      {showIndex == true ? (
        <ImageBackground
          source={require("../assets/DRR_Image.png")}
          style={styles.backGroundImage}
        >
          <View style={styles.welcomePage}>
            <Image source={require("../assets/DRR.png")} />
            <Text
              style={{
                paddingTop: 15,
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              Disaster Risk Reduction
            </Text>

            <Text
              style={{
                paddingBottom: 15,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Terminology
            </Text>

            <ButtonW
              text="Get Started"
              onPress={() => {
                setLanguage("english"),
                  downloadText(),
                  downloadPictograms(),
                  navigation.navigate("Languages");
              }}
            />
          </View>
        </ImageBackground>
      ) : (
        <View></View>
      )}
    </View>
  );
};

export default Welcome;
