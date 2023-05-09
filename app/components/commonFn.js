import AsyncStorage from "@react-native-async-storage/async-storage";
import pageNames from "./pageNames.json";

// Used to store language selection
// and also change initial route state
export async function setLanguage(language) {
  try {
    AsyncStorage.setItem("currentlang", language);
  } catch (error) {
    console.log(error);
  }
}

// Used to fetch language selection
export async function getLanguage() {
  var language = await AsyncStorage.getItem("currentlang");
  return language == null ? null : language;
}

// Used to change PAGE TITLES across the app
export async function getPageTitle(param) {
  var pName = "";
  try {
    var lang = await AsyncStorage.getItem("currentlang");
    if (pageNames[lang] != undefined) {
      if (pageNames) {
        pName = pageNames[lang][param];
      }
    } else {
      if (pageNames["english"] != undefined) {
        pName = pageNames["english"][param];
      }
    }
    return pName;
  } catch (error) {
    //console.log("pageName issue: ", error);
  }
}

// Set selected Term to display
export async function setTerm(term) {
  try {
    AsyncStorage.setItem("currentterm", term);
  } catch (error) {
    console.log(error);
  }
}

// Set current Term language
export async function setTermLanguage(language) {
  try {
    AsyncStorage.setItem("currenttermlang", language);
  } catch (error) {
    console.log(error);
  }
}

// Used to fetch Term selection
export async function getLanguageArray(language) {
  var languageArray = await AsyncStorage.getItem(language);
  languageArray = JSON.parse(languageArray);
  return languageArray;
}
