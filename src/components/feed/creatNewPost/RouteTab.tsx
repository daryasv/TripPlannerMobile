import { Button, Image, Input, ListItem } from "@rneui/themed";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import * as Location from "expo-location";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SaveLocationData, saveLocation } from "../../../actions/feedActions";
import { ScrollView } from "react-native-gesture-handler";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "trip-location-updates";

const RouteTab = forwardRef((props, ref) => {
  const [timeLabel, setTimeLabel] = useState("" as string);
  const timerRef = useRef<NodeJS.Timer>();
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [locations, setLocations] = useState([] as Location.LocationObject[]);
  const [image, setImage] = React.useState(
    null as ImagePicker.ImagePickerAsset
  );

  //Constractor
  useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }
    
    return () => {
      handleStop();
    };
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  useImperativeHandle(ref, () => ({
    save() {},
  }));

  const handleStart = useCallback(() => {
    const start = moment();
    setTimeLabel("00:00:00");
    timerRef.current = setInterval(() => {
      const label = moment
        .utc(moment.duration(moment().diff(start)).asMilliseconds())
        .format("HH:mm:ss");
      setTimeLabel(label);
    }, 1000);

    Location.getCurrentPositionAsync()
      .then((res) => {
        setLocations([res]);
        Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          distanceInterval: 100,
          deferredUpdatesInterval: 10,
          foregroundService: {
            killServiceOnDestroy: true,
            notificationTitle: "Trip Planner",
            notificationBody: "Recording your route",
          },
          showsBackgroundLocationIndicator: true,
        })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log("e", e);
          });
        TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
          if (error || !data?.locations?.length) {
            // check `error.message` for more details.
            return;
          }
          setLocations((oldLocations) => [...oldLocations, ...data.locations]);
        });
      })
      .catch(() => {
        setLocations([]);
      });
  }, [locations, timeLabel]);

  const handleStop = () => {
    if (timerRef?.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimeLabel(null);
    }
    try {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch((e) => {});
      TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME).catch((e) => {});
    } catch (e) {}
  };

  console.log(locations);

  if (!status?.granted) {
    //todo: add button that sends to settings
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>
          Missing permissions - we need location permissions in order to start
          recording
        </Text>
      </View>
    );
  }

  if (!timeLabel) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: 110,
            height: 110,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "red",
            borderWidth: 5,
            borderRadius: 60,
          }}
          onPress={handleStart}
        >
          <View
            style={{
              backgroundColor: "red",
              height: 80,
              width: 80,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              Start
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "red",
            }}
          >
            Recording
          </Text>
          <Text>{timeLabel}</Text>
          <Button
            title={"Stop"}
            buttonStyle={{ backgroundColor: "black", width: 100 }}
            onPress={handleStop}
          ></Button>
        </View>
      </ScrollView>
    );
  }
});

export default RouteTab;
