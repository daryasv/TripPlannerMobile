import { Button, Image, Input, ListItem } from "@rneui/themed";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import * as Location from "expo-location";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  NewPinnedLocationProps,
  SaveLocationData,
  createRoute,
  saveLocation,
  uploadNewPinnedLocation,
} from "../../../actions/feedActions";
import { ScrollView } from "react-native-gesture-handler";
import * as TaskManager from "expo-task-manager";
import { Card } from "@rneui/base";

const LOCATION_TASK_NAME = "trip-location-updates";

interface PinLocationProps {
  image?: ImagePicker.ImagePickerAsset;
  description?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  id?: string;
}

const RouteTab = forwardRef((props, ref) => {
  const [timeLabel, setTimeLabel] = useState("" as string);
  const [duration, setDuration] = useState(0 as number);
  const timerRef = useRef<NodeJS.Timer>();
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [locations, setLocations] = useState([] as Location.LocationObject[]);
  const [pins, setPins] = useState([] as PinLocationProps[]);

  //Constractor
  useEffect(() => {
    if (!status?.granted) {
      requestPermission();
    }

    return () => {
      handleStop();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    save() {
      return createRoute({
        description: "test",
        totalDuration: duration,
        locations: locations.map((location) => location.coords),
        pinnedLocations: pins.map((p) => p.id),
        totalDistance: 0,
        user_id: "",
      });
    },
  }));

  const handleStart = useCallback(() => {
    const start = moment();
    setTimeLabel("00:00:00");
    timerRef.current = setInterval(() => {
      const d = moment.duration(moment().diff(start)).asMilliseconds();
      setDuration(d);
      const label = moment.utc(d).format("HH:mm:ss");
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
    }
    try {
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch((e) => {});
      TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME).catch((e) => {});
    } catch (e) {}
  };

  const addNewPin = (pin: PinLocationProps) => {
    setPins((old) => [pin, ...old]);
  };

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
      <View style={{ flex: 1 }}>
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
            radius={40}
            buttonStyle={{ backgroundColor: "black", width: 100 }}
            onPress={handleStop}
          ></Button>
        </View>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <NewPinLocation handleSavePin={addNewPin} />
          {pins.map((p, index) => (
            <PinLocation key={index} details={p} />
          ))}
        </KeyboardAwareScrollView>
      </View>
    );
  }
});

function PinLocation(props: { details: PinLocationProps }) {
  return (
    <Card containerStyle={{ borderRadius: 10, padding: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {props.details?.image ? (
          <Image
            source={props.details.image}
            style={{ width: 40, height: 40 }}
          />
        ) : null}
        <Text>{props.details.description}</Text>
      </View>
      <Button
        type="clear"
        titleStyle={{
          color: "red",
          fontSize: 14,
          marginTop: 10,
          marginBottom: -10,
        }}
      >
        Remove
      </Button>
    </Card>
  );
}

function NewPinLocation(props: { handleSavePin(pin: PinLocationProps): void }) {
  const [editMode, setEditMode] = useState(false as boolean);
  const [details, setDetails] = React.useState({} as PinLocationProps);
  const [saving, setSaving] = useState(false as boolean);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDetails((oldDetails) => ({ ...oldDetails, image: result.assets[0] }));
    }
  };

  const onSave = async () => {
    if (!saving && (details.description || details.image)) {
      setSaving(true);
      //go to gps and get current location
      const location: PinLocationProps["location"] = (
        await Location.getCurrentPositionAsync()
      )?.coords;

      const dataToSend: NewPinnedLocationProps = {
        description: details.description,
        "location.latitude": location.latitude.toString(),
        "location.longitude": location.longitude.toString(),
      };

      uploadNewPinnedLocation(details.image, dataToSend, (id) => {
        setSaving(false);
        if (id) {
          setEditMode(false);
          props.handleSavePin({
            image: details.image,
            description: details.description,
            location: location,
            id: id,
          });
          setDetails({});
        }
      });
    }
  };

  if (!editMode) {
    return (
      <Button
        containerStyle={{ margin: 30 }}
        radius={50}
        title={"Add new pinnded"}
        onPress={() => setEditMode(true)}
      />
    );
  } else {
    return (
      <Card wrapperStyle={{ gap: 25 }} containerStyle={{ borderRadius: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#bbb",
              width: 0.3 * windowWidth,
              aspectRatio: 1,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={pickImage}
          >
            {details?.image ? (
              <Image
                source={{
                  uri: details.image?.uri,
                }}
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 15,
                  resizeMode: "cover",
                }}
              />
            ) : (
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 18,
                  color: "white",
                  padding: 10,
                }}
              >
                + Add Photo
              </Text>
            )}
          </TouchableOpacity>

          <Input
            placeholder="Write something..."
            multiline
            containerStyle={{
              width: 0.6 * windowWidth,
              borderWidth: 1,
              marginLeft: 10,
              borderRadius: 10,
              borderColor: "#ccc",
              padding: 10,
            }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            label="Description"
            onChangeText={(description) =>
              setDetails((old) => ({ ...old, description }))
            }
          />
        </View>
        <Button disabled={saving} title={"Save"} radius={50} onPress={onSave} />
        <Button
          disabled={saving}
          title={"Cancel"}
          type="clear"
          titleStyle={{ color: "red" }}
          onPress={() => setEditMode(false)}
        />
      </Card>
    );
  }
}

const windowWidth = Dimensions.get("window").width - 40;

export default RouteTab;
