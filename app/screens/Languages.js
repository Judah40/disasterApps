import React, { useEffect, useState } from 'react';
import { View, ImageBackground, Text, FlatList } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { styles } from '../components/styles';
import ButtonSL from '../components/ButtonSL';
import langButtonsHardCode from '../components/langButtons.json';
import { CheckError } from '../components/checkErrorFn';
import { getPageTitle, setLanguage, getLanguage } from '../components/commonFn';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Languages = ({ navigation }) => {
  const [langButtons, setLangButtons] = useState('');
  useEffect(() => {
    getLanguage().then((language) => {
      setLanguage(language.toLowerCase());
      //console.log("getLanguage Languages Page ----->", language);
      APIfetch(language);
    });
  }, []);

  // ---GET LANGUAGE FROM ASYNCSTORAGE-------------------------------------------------------------------------------------------------------------------------------------------------------------
  const [language, setLanguageTerms] = useState('');
  const setDefaultLanguage = async () => {
    getLanguage().then((language) => {
      setLanguageTerms(language);
      //console.log("setLanguageTerms Search Page ----->", language);
      APIfetch(language);
    });
  };

  const defaultProcessing = async () => {
    try {
      var allLanguages = await AsyncStorage.getItem('all-languages');
      allLanguages = JSON.parse(allLanguages);
      if (allLanguages != null) {
        console.log('AsyncStorage Terms fetch success.');
        setLangButtons(allLanguages);
      }
      if (allLanguages == null) {
        console.log('Languages Page: Fetch Terms failed', allLanguages);
        try {
          setLangButtons(langButtonsHardCode);
        } catch (err) {
          Alert.alert('There was a problem. Please contact Admin.');
          console.log('internal file langButtons error: ', err);
        }
      }
    } catch (err) {
      console.log('Error Languages Page: ', err);
    }
  };

  const APIfetch = async () => {
    const url = `https://ymcadrr.southafricanorth.cloudapp.azure.com/api/languages`;
    //console.log(url);

    fetch(url)
      .then(CheckError)
      .then((data) => {
        console.log('Succesful connection to api');
        if (data.length) {
          setLangButtons(data);
        } else {
          console.log(
            'Error: There is a problem with the database. The successful terms fetch was empty'
          );
          defaultProcessing().then(() => {});
          // Alert.alert("There was a problem. Please contact Admin.");
        }
      })
      .catch((error) => {
        try {
          console.log(
            error,
            'Languages page: Connection failed. Offline mode on. '
          );
          defaultProcessing().then(() => {});
        } catch {
          console.log('Error: AsyncStorage is likely empty');
          Alert.alert('Please Download terms');
          navigation.navigate('Downloads');
        }
      });
  };

  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState('');
  useEffect(() => {
    try {
      getPageTitle('languages').then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, [language]);

  return (
    <View>
      <NavigationEvents
        onDidFocus={() => {
          setDefaultLanguage();
          console.log('Languages page loaded');
        }}
      />

      {/* BACKGROUND IMAGE*/}
      <ImageBackground
        source={require('../assets/clouds.jpeg')}
        style={styles.backGroundImage}
      >
        {/* HEADER*/}
        <View style={styles.myHeaderViewLangs}>
          <Text style={styles.myHeaderText}>{pageTitle}</Text>
        </View>

        {/* BUTTONS CONTAINER */}
        <View style={styles.containerSL}>
          <FlatList
            data={langButtons}
            keyExtractor={(item) => item.name}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <ButtonSL
                  lang={item.name}
                  onPress={() => {
                    setLanguage(item.name), navigation.navigate('SearchClass');
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

export default Languages;
