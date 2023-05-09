import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { StyleSheet, Dimensions } from 'react-native';
import { styles } from '../components/styles';
import * as Location from 'expo-location';
import { getPageTitle, getLanguage } from '../components/commonFn';

const height = Dimensions.get('window').height;

const Map = () => {
  const getLocation = async () => {
    try {
      
      var { status } = await Location.requestForegroundPermissionsAsync();
      if (status == 'granted') {
        var myLocation = await Location.getCurrentPositionAsync();
        setLatitude(myLocation.coords.latitude)  
        setLongitude(myLocation.coords.longitude)  
      } else return '';
    } catch (error) {
      console.log(error)
    }
  };
  const [longitude, setLongitude] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);

  useEffect(() => {
    getLocation()
    console.log(longitude,latitude)
    // .then((result) => {
    //   try {
        
    //     setLatitude(result.latitude);
    //     setLongitude(result.longitude);
    //   } catch (error) {
    //     console.log(error)
    //   }
    // });
  }, [longitude,latitude ]);
  // /On Mac selecl option, two circles will appear, converge cirlces together to zoom in and opposite to zoom out
  return (
    <SafeAreaView style={{flex:1}}>
    <View >
    
    <MapView
      style={styles12.map}
      loadingEnabled={true}
      region={{
        // Change the latitude and longitude of the MapView to see current user location
        // latitude: 37.785834, //San Francisco (Simulator Location)
        // longitude: -122.406417,
        latitude: 8.4606,
        longitude: -11.7799,
        latitudeDelta: 3.0,
        longitudeDelta: 3.0,
      }}
    >
      {/* This Marker shows user current location */}
      {/* In the Simulator user current location shows as San Francisco (Simulator based) */}
      <Marker
        coordinate={{
          latitude: 37.785834,
          longitude: -122.406417,
        }}
        pinColor={"green"}
        title={"ME"}
      />

      {/* These Markers show spoken language in region */}
      <Marker
        coordinate={{
          latitude: 9.8552,
          longitude: -11.5771,
        }}
        // pinColor={"#3290d0"}
        title={"Limba"}
      />
      <Marker
        coordinate={{
          latitude: 9.28552,
          longitude: -11.5771,
        }}
        title={"Krio"}
      />
      <Marker
        coordinate={{
          latitude: 9.4398552,
          longitude: -12.5771,
        }}
        title={"Limba"}
      />
      <Marker
        coordinate={{
          latitude: 8.97687,
          longitude: -11.9,
        }}
        title={"Limba"}
      />
      <Marker
        coordinate={{
          latitude: 8.6,
          longitude: -12.6,
        }}
        title={"Themne"}
      />
      <Marker
        coordinate={{
          latitude: 8.2858747,
          longitude: -13.1,
        }}
        title={"Krio"}
      />
      {/* <MapView.Marker
        coordinate={{
          latitude: 7.8632,
          longitude: -11.1957,
        }}
        title={"Mende"}
      /> */}
      <Marker
        coordinate={{
          latitude: 9.0589,
          longitude: -10.962587,
        }}
        title={"Kono"}
      />
      <Marker
        coordinate={{
          latitude: 8.6001,
          longitude: -10.99587,
        }}
        title={"Krio"}
      />
      <Marker
        coordinate={{
          latitude: 7.6,
          longitude: -11.4731,
        }}
        title={"Mende"}
      />

      <Polygon //  KRIO
        coordinates={[
          { latitude: 8.364399, longitude: -12.975789 },
          { latitude: 8.375268, longitude: -13.04514 },
          { latitude: 8.376627, longitude: -13.070546 },
          { latitude: 8.390892, longitude: -13.084965 },
          { latitude: 8.41195, longitude: -13.094578 },
          { latitude: 8.410592, longitude: -13.116551 },
          { latitude: 8.42146, longitude: -13.126164 },
          { latitude: 8.42961, longitude: -13.146077 },
          { latitude: 8.449307, longitude: -13.157406 },
          { latitude: 8.462212, longitude: -13.172856 },
          { latitude: 8.481228, longitude: -13.188306 },
          { latitude: 8.481228, longitude: -13.205128 },
          { latitude: 8.491415, longitude: -13.206502 },
          { latitude: 8.497527, longitude: -13.230534 },
          { latitude: 8.496848, longitude: -13.269673 },
          { latitude: 8.486661, longitude: -13.279973 },
          { latitude: 8.497867, longitude: -13.286153 },
          { latitude: 8.496848, longitude: -13.296452 },
          { latitude: 8.454741, longitude: -13.281346 },
          { latitude: 8.436403, longitude: -13.284779 },
          { latitude: 8.426893, longitude: -13.301259 },
          { latitude: 8.418063, longitude: -13.284093 },
          { latitude: 8.405837, longitude: -13.273793 },
          { latitude: 8.380703, longitude: -13.263493 },
          { latitude: 8.358964, longitude: -13.24564 },
          { latitude: 8.341301, longitude: -13.225041 },
          { latitude: 8.333827, longitude: -13.204442 },
          { latitude: 8.314804, longitude: -13.203068 },
          { latitude: 8.301215, longitude: -13.192082 },
          { latitude: 8.283549, longitude: -13.176976 },
          { latitude: 8.275395, longitude: -13.170109 },
          { latitude: 8.246855, longitude: -13.176289 },
          { latitude: 8.237342, longitude: -13.16187 },
          { latitude: 8.202682, longitude: -13.15775 },
          { latitude: 8.183653, longitude: -13.163243 },
          { latitude: 8.170059, longitude: -13.161183 },
          { latitude: 8.183653, longitude: -13.139897 },
          { latitude: 8.197245, longitude: -13.127537 },
          { latitude: 8.213556, longitude: -13.086339 },
          { latitude: 8.236662, longitude: -13.068486 },
          { latitude: 8.235303, longitude: -13.002568 },
          { latitude: 8.258747, longitude: -12.977505 },
          { latitude: 8.253141, longitude: -12.959824 },
          { latitude: 8.277434, longitude: -12.955876 },
          { latitude: 8.312766, longitude: -12.943516 },
          { latitude: 8.335866, longitude: -12.928067 },
          { latitude: 8.349453, longitude: -12.929097 },
          { latitude: 8.356926, longitude: -12.940083 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(173, 216, 230, 0.7)" // Shape color
        strokeWidth={0.2}
      />

      <Polygon // LIMBA
        coordinates={[
          { latitude: 9.9842, longitude: -11.777593 },
          { latitude: 9.875982, longitude: -11.700689 },
          { latitude: 9.767729, longitude: -11.662236 },
          { latitude: 9.691931, longitude: -11.612798 },
          { latitude: 9.697346, longitude: -11.458989 },
          { latitude: 9.71359, longitude: -11.349126 },
          { latitude: 9.832685, longitude: -11.365606 },
          { latitude: 9.962559, longitude: -11.404058 },
          { latitude: 10.016658, longitude: -11.42603 },
          { latitude: 10.011248, longitude: -11.634771 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(254, 216, 177, 0.7)" // Shape color light orange LIMBA
        strokeWidth={0.2}
      />
      <Polygon //  MENDE
        coordinates={[
          { latitude: 8.332738, longitude: -10.669815 },
          { latitude: 8.425125, longitude: -10.636856 },
          { latitude: 8.506624, longitude: -10.62587 },
          { latitude: 8.44686, longitude: -10.741226 },
          { latitude: 8.397954, longitude: -10.900528 },
          { latitude: 8.397954, longitude: -11.037857 },
          { latitude: 8.387086, longitude: -11.158707 },
          { latitude: 8.441426, longitude: -11.202652 },
          { latitude: 8.506624, longitude: -11.208145 },
          { latitude: 8.501192, longitude: -11.350967 },
          { latitude: 8.419691, longitude: -11.438858 },
          { latitude: 8.349043, longitude: -11.603653 },
          { latitude: 8.29469, longitude: -11.735489 },
          { latitude: 8.240329, longitude: -11.92775 },
          { latitude: 8.153336, longitude: -12.004654 },
          { latitude: 8.196835, longitude: -12.059586 },
          { latitude: 8.262074, longitude: -12.163956 },
          { latitude: 8.26751, longitude: -12.279312 },
          { latitude: 8.283818, longitude: -12.411148 },
          { latitude: 8.272946, longitude: -12.537491 },
          { latitude: 8.169649, longitude: -12.67482 },
          { latitude: 7.995614, longitude: -12.67482 },
          { latitude: 7.91945, longitude: -12.647354 },
          { latitude: 7.924891, longitude: -12.586929 },
          { latitude: 7.777966, longitude: -12.586929 },
          { latitude: 7.696318, longitude: -12.647354 },
          { latitude: 7.701762, longitude: -12.55397 },
          { latitude: 7.636434, longitude: -12.510025 },
          { latitude: 7.630989, longitude: -12.597916 },
          { latitude: 7.636434, longitude: -12.751724 },
          { latitude: 7.598321, longitude: -12.960465 },
          { latitude: 7.625545, longitude: -13.053848 },
          { latitude: 7.554759, longitude: -13.009903 },
          { latitude: 7.511193, longitude: -12.839615 },
          { latitude: 7.473069, longitude: -12.625382 },
          { latitude: 7.385917, longitude: -12.55397 },
          { latitude: 7.336886, longitude: -12.323258 },
          { latitude: 7.20066, longitude: -11.993668 },
          { latitude: 7.102552, longitude: -11.790421 },
          { latitude: 6.988067, longitude: -11.592667 },
          { latitude: 6.928087, longitude: -11.510269 },
          { latitude: 7.015328, longitude: -11.394913 },
          { latitude: 7.18976, longitude: -11.312515 },
          { latitude: 7.35323, longitude: -11.125748 },
          { latitude: 7.527531, longitude: -10.889542 },
          { latitude: 7.669099, longitude: -10.790665 },
          { latitude: 7.739866, longitude: -10.675308 },
          { latitude: 7.772523, longitude: -10.60939 },
          { latitude: 7.973854, longitude: -10.598404 },
          { latitude: 8.03369, longitude: -10.603897 },
          { latitude: 8.115271, longitude: -10.537979 },
          { latitude: 8.153336, longitude: -10.444595 },
          { latitude: 8.175086, longitude: -10.345718 },
          { latitude: 8.26751, longitude: -10.334732 },
          { latitude: 8.316432, longitude: -10.373184 },
          { latitude: 8.332738, longitude: -10.433609 },
          { latitude: 8.381651, longitude: -10.477554 },
          { latitude: 8.343608, longitude: -10.537979 },
          { latitude: 8.354478, longitude: -10.598404 },
          { latitude: 8.338173, longitude: -10.669815 },
          { latitude: 8.332738, longitude: -10.669815 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(144, 238, 144, 0.5)"
        strokeWidth={0.1}
      />
      <Polygon //  KONO
        coordinates={[
          { latitude: 9.038655, longitude: -10.581925 },
          { latitude: 8.957271, longitude: -10.598404 },
          { latitude: 8.821592, longitude: -10.554459 },
          { latitude: 8.702152, longitude: -10.488541 },
          { latitude: 8.636988, longitude: -10.461075 },
          { latitude: 8.577243, longitude: -10.565445 },
          { latitude: 8.51749, longitude: -10.62587 },
          { latitude: 8.4292, longitude: -10.796158 },
          { latitude: 8.39252, longitude: -10.933487 },
          { latitude: 8.388444, longitude: -11.065323 },
          { latitude: 8.400671, longitude: -11.165573 },
          { latitude: 8.442784, longitude: -11.158707 },
          { latitude: 8.445501, longitude: -11.073563 },
          { latitude: 8.443464, longitude: -11.024811 },
          { latitude: 8.456368, longitude: -10.976059 },
          { latitude: 8.506624, longitude: -10.906021 },
          { latitude: 8.586749, longitude: -10.875809 },
          { latitude: 8.69808, longitude: -10.83873 },
          { latitude: 8.799878, longitude: -10.785172 },
          { latitude: 8.886724, longitude: -10.807144 },
          { latitude: 8.897578, longitude: -10.906021 },
          { latitude: 8.915216, longitude: -10.988419 },
          { latitude: 8.877226, longitude: -11.035111 },
          { latitude: 8.832448, longitude: -11.135361 },
          { latitude: 8.783592, longitude: -11.182053 },
          { latitude: 8.737445, longitude: -11.230118 },
          { latitude: 8.675002, longitude: -11.28505 },
          { latitude: 8.680432, longitude: -11.328995 },
          { latitude: 8.699437, longitude: -11.341354 },
          { latitude: 8.749661, longitude: -11.337235 },
          { latitude: 8.848732, longitude: -11.318008 },
          { latitude: 8.935566, longitude: -11.241104 },
          { latitude: 9.000678, longitude: -11.166946 },
          { latitude: 9.076627, longitude: -11.202652 },
          { latitude: 9.190521, longitude: -11.092789 },
          { latitude: 9.147137, longitude: -10.999405 },
          { latitude: 9.071203, longitude: -10.917008 },
          { latitude: 9.060354, longitude: -10.840103 },
          { latitude: 9.0929, longitude: -10.752213 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(177, 156, 217, 0.5)" // Shape color light purple KONO
        strokeWidth={0.2}
      />
      <Polygon //  KRIO
        coordinates={[
          { latitude: 8.888274, longitude: -10.829578 },
          { latitude: 8.893701, longitude: -10.928455 },
          { latitude: 8.790571, longitude: -11.115223 },
          { latitude: 8.714562, longitude: -11.186634 },
          { latitude: 8.687413, longitude: -11.230579 },
          { latitude: 8.60052, longitude: -11.280018 },
          { latitude: 8.54077, longitude: -11.323963 },
          { latitude: 8.502743, longitude: -11.280018 },
          { latitude: 8.49731, longitude: -11.2141 },
          { latitude: 8.442977, longitude: -11.19762 },
          { latitude: 8.453845, longitude: -11.126209 },
          { latitude: 8.453845, longitude: -10.983387 },
          { latitude: 8.502743, longitude: -10.911976 },
          { latitude: 8.60052, longitude: -10.879017 },
          { latitude: 8.719992, longitude: -10.846058 },
          { latitude: 8.801428, longitude: -10.791126 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(173, 216, 230, 0.6)" // Shape color
        strokeWidth={0.2}
      />
      <Polygon // Themne
        coordinates={[
          { latitude: 8.394072, longitude: -11.510731 },
          { latitude: 8.551635, longitude: -11.30199 },
          { latitude: 8.698273, longitude: -11.378895 },
          { latitude: 8.757998, longitude: -11.400867 },
          { latitude: 8.861137, longitude: -11.312977 },
          { latitude: 8.999514, longitude: -11.469532 },
          { latitude: 8.882846, longitude: -11.626087 },
          { latitude: 8.82857, longitude: -11.779896 },
          { latitude: 8.88556, longitude: -11.914478 },
          { latitude: 8.980524, longitude: -12.010609 },
          { latitude: 9.045628, longitude: -12.156177 },
          { latitude: 9.056478, longitude: -12.334705 },
          { latitude: 9.05919, longitude: -12.38689 },
          { latitude: 9.056478, longitude: -12.488514 },
          { latitude: 9.408907, longitude: -12.175403 },
          { latitude: 9.479351, longitude: -11.950184 },
          { latitude: 9.603945, longitude: -11.851307 },
          { latitude: 9.663518, longitude: -12.071033 },
          { latitude: 9.533528, longitude: -12.362171 },
          { latitude: 9.333029, longitude: -12.526966 },
          { latitude: 9.259846, longitude: -12.590137 },
          { latitude: 9.219181, longitude: -12.686268 },
          { latitude: 9.300505, longitude: -12.845569 },
          { latitude: 9.246291, longitude: -12.966419 },
          { latitude: 9.072752, longitude: -13.070789 },
          { latitude: 9.078176, longitude: -13.136707 },
          { latitude: 9.072752, longitude: -13.301502 },
          { latitude: 8.975099, longitude: -13.279529 },
          { latitude: 8.899128, longitude: -13.180653 },
          { latitude: 8.850281, longitude: -13.175159 },
          { latitude: 8.814999, longitude: -13.249317 },
          { latitude: 8.687413, longitude: -13.235584 },
          { latitude: 8.501724, longitude: -13.126408 },
          { latitude: 8.419205, longitude: -13.006245 },
          { latitude: 8.384561, longitude: -12.919727 },
          { latitude: 8.300998, longitude: -12.934833 },
          { latitude: 8.22829, longitude: -12.971912 },
          { latitude: 7.969967, longitude: -12.873035 },
          { latitude: 8.057, longitude: -12.702747 },
          { latitude: 8.176639, longitude: -12.653309 },
          { latitude: 8.269062, longitude: -12.529713 },
          { latitude: 8.274498, longitude: -12.362171 },
          { latitude: 8.182076, longitude: -11.996876 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(255, 237, 131, 0.5)" // Shape color
        strokeWidth={0.2}
      />

      <Polygon // Krio
        coordinates={[
          { latitude: 9.605284, longitude: -11.86504 },
          { latitude: 9.659441, longitude: -12.002369 },
          { latitude: 9.675687, longitude: -12.112232 },
          { latitude: 9.64861, longitude: -12.189136 },
          { latitude: 9.556535, longitude: -12.393952 },
          { latitude: 9.561952, longitude: -12.448884 },
          { latitude: 9.659441, longitude: -12.520295 },
          { latitude: 9.708175, longitude: -12.558747 },
          { latitude: 9.811035, longitude: -12.492829 },
          { latitude: 9.886806, longitude: -12.360993 },
          { latitude: 9.924685, longitude: -12.229157 },
          { latitude: 9.90304, longitude: -12.14676 },
          { latitude: 9.90304, longitude: -12.036896 },
          { latitude: 9.962559, longitude: -11.905061 },
          { latitude: 10.005839, longitude: -11.861115 },
          { latitude: 10.000429, longitude: -11.806184 },
          { latitude: 9.854335, longitude: -11.7128 },
          { latitude: 9.762316, longitude: -11.701813 },
          { latitude: 9.670271, longitude: -11.646882 },
          { latitude: 9.681102, longitude: -11.548005 },
          { latitude: 9.71359, longitude: -11.443635 },
          { latitude: 9.675687, longitude: -11.399689 },
          { latitude: 9.583619, longitude: -11.394196 },
          { latitude: 9.464435, longitude: -11.377717 },
          { latitude: 9.415666, longitude: -11.317292 },
          { latitude: 9.34521, longitude: -11.333771 },
          { latitude: 9.301845, longitude: -11.399689 },
          { latitude: 9.193409, longitude: -11.393071 },
          { latitude: 9.041544, longitude: -11.420537 },
          { latitude: 8.987291, longitude: -11.491948 },
          { latitude: 8.938456, longitude: -11.585332 },
          { latitude: 8.895042, longitude: -11.700689 },
          { latitude: 8.867905, longitude: -11.810552 },
          { latitude: 8.889615, longitude: -11.865483 },
          { latitude: 9.008993, longitude: -11.838018 },
          { latitude: 9.112061, longitude: -11.783086 },
          { latitude: 9.198832, longitude: -11.777593 },
          { latitude: 9.209677, longitude: -11.870977 },
          { latitude: 9.139179, longitude: -11.953374 },
          { latitude: 9.101213, longitude: -12.019292 },
          { latitude: 9.052394, longitude: -12.096196 },
          { latitude: 9.068668, longitude: -12.156621 },
          { latitude: 9.150026, longitude: -12.090703 },
          { latitude: 9.236788, longitude: -11.991826 },
          { latitude: 9.307266, longitude: -11.936895 },
          { latitude: 9.35605, longitude: -11.969854 },
          { latitude: 9.334369, longitude: -12.057744 },
          { latitude: 9.35063, longitude: -12.112676 },
          { latitude: 9.404827, longitude: -12.063237 },
          { latitude: 9.448179, longitude: -11.991826 },
          { latitude: 9.507779, longitude: -11.87647 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(173, 216, 230, 0.6)" // Shape color KRIO
        strokeWidth={0.2}
      />
      <Polygon // LIMBA
        coordinates={[
          { latitude: 9.589035, longitude: -12.464238 },
          { latitude: 9.637779, longitude: -12.51917 },
          { latitude: 9.48069, longitude: -12.574102 },
          { latitude: 9.410247, longitude: -12.634526 },
          { latitude: 9.318107, longitude: -12.722417 },
          { latitude: 9.28016, longitude: -12.755376 },
          { latitude: 9.263896, longitude: -12.689458 },
          { latitude: 9.291003, longitude: -12.590581 },
          { latitude: 9.37773, longitude: -12.51917 },
          { latitude: 9.48069, longitude: -12.431279 },
          { latitude: 9.529449, longitude: -12.39832 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(254, 216, 177, 0.7)" // Shape color light orange LIMBA
        strokeWidth={0.2}
      />
      <Polygon // LIMBA
        coordinates={[
          { latitude: 9.030694, longitude: -12.08521 },
          { latitude: 8.971013, longitude: -11.975347 },
          { latitude: 8.900469, longitude: -11.903936 },
          { latitude: 8.976439, longitude: -11.870977 },
          { latitude: 9.095789, longitude: -11.810552 },
          { latitude: 9.187987, longitude: -11.777593 },
          { latitude: 9.187987, longitude: -11.87647 },
          { latitude: 9.128332, longitude: -11.947881 },
          { latitude: 9.079517, longitude: -12.013799 },
        ]}
        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
        strokeColors={[
          "#7F0000",
          "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
          "#B24112",
          "#E5845C",
          "#238C23",
          "#7F0000",
        ]}
        fillColor="rgba(254, 216, 177, 0.7)" // Shape color light orange LIMBA
        strokeWidth={0.2}
      />
    </MapView>
    </View>
    </SafeAreaView>
  
  );
};

const LanguagesMap = ({ navigation }) => {
  // PAGE TITLE
  const [pageTitle, setPageTitle] = useState('');
  useEffect(() => {
    try {
      getPageTitle('langMap').then((result) => {
        setPageTitle(result);
      });
    } catch {
      console.log("Error: couldn't get pageTitle");
    }
  }, []);
  return (
    <View>
      {/* HEADER*/}
      <View style={[styles.myHeaderViewMap]}>
        <TouchableOpacity
          style={{ justifyContent: 'flex-start' }}
          onPress={() => {
            navigation.navigate('InfoClass');
          }}
        >
          <AntDesign
            name='left'
            size={30}
            color='white'
            style={{ marginTop: 20, marginLeft: 1 }}
          />
        </TouchableOpacity>
        <Text style={styles.myHeaderText}>{pageTitle}</Text>
      </View>

      <Map />

      {/* <ImageBackground
        source={require("../assets/clouds.jpeg")}
        style={styles.backGroundImage}
      >
        <View style={styles.howToContainer}>
          <TouchableOpacity>
            <Image
              source={require("../assets/countries_languages.png")}
              style={{
                height: 240,
                width: 250,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="play" size={70} color="#004fff" />
          </TouchableOpacity>
        </View>
      </ImageBackground> */}
    </View>
  );
};
const styles12 = StyleSheet.create({
  map: {
    height,
  },
});
export default LanguagesMap;
