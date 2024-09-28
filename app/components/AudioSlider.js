import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  Animated,
  PanResponder,
  View,
  Easing,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import sleep from "./sleep";
import DigitalTimeString from "./DigitalTimeString";
import * as FileSystem from "expo-file-system";
// import { NavigationEvents } from "react-navigation";

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;

export default class AudioSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      currentTime: 0,
      duration: 0,
      trackLayout: {},
      dotOffset: new Animated.ValueXY(),
      xDotOffsetAtAnimationStart: 0,
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: async (e, gestureState) => {
        if (this.state.playing) {
          await this.pause();
        }
        await this.setState({
          xDotOffsetAtAnimationStart: this.state.dotOffset.x._value,
        });
        await this.state.dotOffset.setOffset({
          x: this.state.dotOffset.x._value,
        });
        await this.state.dotOffset.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [null, { dx: this.state.dotOffset.x, dy: this.state.dotOffset.y }],
          { useNativeDriver: false }
        )(e, gestureState);
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: async (evt, gestureState) => {
        const currentOffsetX =
          this.state.xDotOffsetAtAnimationStart + this.state.dotOffset.x._value;
        if (
          currentOffsetX < 0 ||
          currentOffsetX > this.state.trackLayout.width
        ) {
          await this.state.dotOffset.setValue({
            x: -this.state.xDotOffsetAtAnimationStart,
            y: 0,
          });
        }
        await this.state.dotOffset.flattenOffset();
        await this.mapAudioToCurrentTime();
      },
      onPanResponderRelease: async (e, { vx }) => {
        const currentOffsetX =
          this.state.xDotOffsetAtAnimationStart + this.state.dotOffset.x._value;
        if (
          currentOffsetX < 0 ||
          currentOffsetX > this.state.trackLayout.width
        ) {
          await this.state.dotOffset.setValue({
            x: -this.state.xDotOffsetAtAnimationStart,
            y: 0,
          });
        }
        await this.state.dotOffset.flattenOffset();
        await this.mapAudioToCurrentTime();
      },
    });
  }

  async componentDidMount() {
    //this.loadAudio();
  }
  loadAudio = async () => {
    this.mounted = true;
    this.soundObject = new Audio.Sound();
    const url = this.props.audio;
    const splitUrl = url.split("/");
    const lastItem = splitUrl[splitUrl.length - 1];

    if (url.startsWith("http://")) {
      const { uri } = await FileSystem.downloadAsync(
        //downloads mp3 into filesystem, storage
        url,
        FileSystem.documentDirectory + "current-audio.mp3",
        {}
      );
      try {
        await this.soundObject.loadAsync({ uri: uri }); //load that mp3 into the app
      } catch (error) {
      }
    } else {
      try {
        await this.soundObject.loadAsync({ uri: url }); //load that mp3 into the app
      } catch (error) {
      }
    }

    //// console.log(url);
    try {
      const status = await this.soundObject.getStatusAsync(); //get some metadata about the audio file
      this.setState({ duration: status["durationMillis"] }); //take the duration and put it in duration state
    } catch (error) {
    }

    this.state.dotOffset.addListener(() => {
      let animatedCurrentTime = this.state.dotOffset.x
        .interpolate({
          inputRange: [0, this.state.trackLayout.width],
          outputRange: [0, this.state.duration],
          extrapolate: "clamp",
        })
        .__getValue();
      this.setState({ currentTime: animatedCurrentTime });
    });
  };

  mapAudioToCurrentTime = async () => {
    await this.soundObject.setPositionAsync(this.state.currentTime);
  };

  onPressPlayPause = async () => {
    if (this.state.playing) {
      await this.pause();
      return;
    }
    await this.play();
  };

  play = async () => {
    // try {
    //   await this.soundObject.playAsync();
    //   this.setState({ playing: true }); //Play button
    //   this.startMovingDot(); //circle to move in the audio player
    // } catch (err) {
    //   // console.log("Play function error on line 144: ", err);
    // }
    await this.soundObject.playAsync();
    this.setState({ playing: true }); //Play button
    this.startMovingDot(); //circle to move in the audio player
  };

  pause = async () => {
    try {
      //Pause the play button
      await this.soundObject.pauseAsync();
      this.setState({ playing: false });
      Animated.timing(this.state.dotOffset).stop(); // Will also call animationPausedOrStopped()
    } catch (error) {
    }
  };

  startMovingDot = async () => {
    const status = await this.soundObject.getStatusAsync();
    const durationLeft = status["durationMillis"] - status["positionMillis"];
    Animated.timing(this.state.dotOffset, {
      toValue: { x: this.state.trackLayout.width, y: 0 },
      duration: durationLeft,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => this.animationPausedOrStopped());
  };

  animationPausedOrStopped = async () => {
    try {
      if (!this.state.playing) {
        // Audio has been paused
        return;
      }
      await sleep(200); // In case animation has finished, but audio has not
      this.setState({ playing: false });
      await this.soundObject.pauseAsync();
      await this.state.dotOffset.setValue({ x: 0, y: 0 });
      await this.soundObject.setPositionAsync(0);
    } catch (error) {
      // console.log("animationPausedOrStopped error --", error);
    }
  };

  measureTrack = (event) => {
    this.setState({ trackLayout: event.nativeEvent.layout }); // {x, y, width, height}
  };

  async componentWillUnmount() {
    try {
      await this.soundObject.unloadAsync();
      this.state.dotOffset.removeAllListeners();
      this.mounted = false;
      this.soundObject = null;
    } catch (error) {
      // console.log("componentWillMount error--", error);
    }
  }

  audioPlayer = async () => {
    // this.loadAudio();

    if (this.mounted == true) {
      try {
        await this.soundObject.pauseAsync();
        this.setState({ dotOffset: new Animated.ValueXY(), playing: false });
        //  this.state.dotOffset.setValue({ x: 0, y: 0 });
        await this.soundObject.setPositionAsync(0);
        this.mounted == false;
        this.loadAudio();
      } catch (err) {
      }
    } else {
      try {
        this.loadAudio();
      } catch (err) {
      }
    }
    // try {
    //   this.loadAudio();
    // } catch (err) {
    //   // console.log("----04 == line 208", err);
    // }
    // try {
    //   await this.soundObject.pauseAsync();
    // } catch (err) {
    //   // console.log("----01 -- line 213", err);
    // }
    // try {
    //   this.setState({ dotOffset: new Animated.ValueXY(), playing: false });
    // } catch {
    //   // console.log("----02");
    // }
    // try {
    //   await this.soundObject.setPositionAsync(0);
    // } catch (err) {
    //   // console.log("-----03 -- line 223", err);
    // }
    // try {
    //   this.loadAudio();
    // } catch (err) {
    //   // console.log("----04 == line 227", err);
    // }
    //// console.log("----1 -- line 230");
  };

  // quitTasks = async () => {
  //   try {
  //     await this.soundObject.unloadAsync();
  //     this.state.dotOffset.removeAllListeners();
  //     this.mounted = false;
  //     this.soundObject = null;
  //   } catch {
  //     // console.log("-- Couldn't unload Audio before leaving page");
  //   }
  // };

  render() {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "stretch",
          paddingLeft: 2,
          paddingRight: 8,
        }}
      >
        <NavigationEvents
          onDidFocus={() => {
            this.audioPlayer();
          }}
        />
        {/* <NavigationEvents
          onDidBlur={() => {
            this.quitTasks();
          }}
        /> */}
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            // paddingLeft: 8,
            //paddingRight: 2,
            height: 35,
          }}
        >
          {this.state.duration == 0 ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingRight: THUMB_SIZE,
                zIndex: 2,
              }}
              onPress={this.onPressPlayPause}
            >
              {this.state.playing ? (
                <MaterialIcons name="pause" size={30} color="black" />
              ) : (
                <Entypo name="controller-play" size={30} color="black" />
              )}
            </TouchableOpacity>
          )}

          <Animated.View
            onLayout={this.measureTrack}
            style={{
              flex: 8,
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              height: TRACK_SIZE,
              borderRadius: TRACK_SIZE / 2,
              backgroundColor: "black",
            }}
          >
            <Animated.View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                left: -((THUMB_SIZE * 4) / 2),
                width: THUMB_SIZE * 4,
                height: THUMB_SIZE * 4,
                transform: [
                  {
                    translateX: this.state.dotOffset.x.interpolate({
                      inputRange: [
                        0,
                        this.state.trackLayout.width != undefined
                          ? this.state.trackLayout.width
                          : 1,
                      ],
                      outputRange: [
                        0,
                        this.state.trackLayout.width != undefined
                          ? this.state.trackLayout.width
                          : 1,
                      ],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
              {...this._panResponder.panHandlers}
            >
              <View
                style={{
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: THUMB_SIZE / 2,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              ></View>
            </Animated.View>
          </Animated.View>
        </View>

        <View
          style={{
            flex: 0,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <DigitalTimeString time={this.state.currentTime} />
          <DigitalTimeString time={this.state.duration} />
        </View>
      </View>
    );
  }
}
