import { Button, Image, Input } from "@rneui/themed";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View, Dimensions, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import * as Location from "expo-location";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  NewPinnedLocationProps,
  createRoute,
  uploadNewPinnedLocation,
} from "../../../actions/feedActions";
import * as TaskManager from "expo-task-manager";
import { Card } from "@rneui/base";
import { getLocationData } from "../../utils/LocationsUtils";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
  const [recording, setRecording] = useState(false as boolean);
  const [timeLabel, setTimeLabel] = useState("" as string);
  const [duration, setDuration] = useState(0 as number);
  const timerRef = useRef<NodeJS.Timer>();
  const [status, requestPermission] = Location.useForegroundPermissions();
  const [locations, setLocations] = useState([] as Location.LocationObject[]);
  const [path, setPath] = useState([] as Location.LocationObjectCoords[]);
  const [pins, setPins] = useState([] as PinLocationProps[]);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");

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
      if (description && timeLabel) {
        return createRoute({
          description: description,
          totalDuration: duration,
          locations: locations.map((location) => location.coords),
          pinnedLocations: pins.map((p) => p.id),
          totalDistance: 0,
          user_id: "",
          cities: city,
        });
      }
    },
  }));

  const handleStart = useCallback(() => {
    setRecording(true);
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
        setPath([res.coords]);
        getLocationData(res.coords.latitude, res.coords.longitude)
          .then((address) => {
            if (address?.city) {
              setCity(address.city);
            }
          })
          .catch((e) => {});

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
          if (data?.locations?.coords) {
            setLocations((oldLocations) => [
              ...oldLocations,
              ...data.locations,
            ]);
            setPath((oldPath) => [...oldPath, ...data.locations.coords]);
          }
        });
      })
      .catch(() => {
        setLocations([]);
        setPath([]);
      });
  }, [locations, timeLabel]);

  const handleStop = () => {
    setRecording(false);
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
            width: 160,
            height: 160,
            alignItems: "center",
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 5,
            borderRadius: 80,
          }}
          onPress={handleStart}
        >
          <View
            style={{
              backgroundColor: "black",
              height: 140,
              width: 140,
              borderRadius: 70,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 30 }}>
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
            paddingRight: 25,
            paddingLeft: 25,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: "black",
            }}
          >
            {recording ? "Recording" : "Recoreded"}
          </Text>
          <Text>{timeLabel}</Text>
        </View>
        {/* <MapView style={{ height: "50%", width: "100%"}}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomEnabled={true}>
          {pins.map((pin) => (
        <View key={pin.id}>
          <Marker description={pin.description} coordinate={pin.location} />
        </View>
      ))}
          {locations.length > 0 && <Polyline coordinates={path} strokeColor="#FF0000" strokeWidth={3} />}
        </MapView> */}
        <Input
          value={description}
          onChangeText={(text) => setDescription(text)}
          label="Description"
          multiline
          inputContainerStyle={{ borderBottomWidth: 0 }}
          containerStyle={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: "#aaa",
            marginStart: "5%",
            width: "90%",
            marginTop: 20,
            backgroundColor: "white",
          }}
        />
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
          <NewPinLocation handleSavePin={addNewPin} />
          {pins.map((p, index) => (
            <PinLocation key={index} details={p} />
          ))}
        </KeyboardAwareScrollView>
        {(recording) && (
          <Button
            title={"Stop"}
            radius={8}
            buttonStyle={{
              backgroundColor: "black",
              width: "80%",
              marginLeft: "10%",
              marginBottom: 20,
            }}
            onPress={handleStop}
          ></Button>
        )}
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

  const [cameraPermissions, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const { showActionSheetWithOptions } = useActionSheet();

  const openCamera = async () => {
    if (!cameraPermissions.granted) {
      const res = await requestCameraPermission();
      if (!res.granted) {
        Alert.alert("Missing camera permissions");
        return;
      }
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      setDetails((oldDetails) => ({ ...oldDetails, image: result.assets[0] }));
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      setDetails((oldDetails) => ({ ...oldDetails, image: result.assets[0] }));
    }
  };

  const onSave = async () => {
    if (!saving && details.description && details.image) {
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

  const onPress = () => {
    const options = ["Camera", "Image Gallery", "Cancel"];

    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex: number) => {
        switch (selectedIndex) {
          case 0:
            openCamera();
            break;
          case 1:
            pickImage();
            break;

          case 2:
            break;
        }
      }
    );
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
            onPress={onPress}
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
        <Button
          loading={saving}
          loadingProps={{ color: "blue" }}
          disabled={saving}
          title={"Save"}
          radius={50}
          onPress={onSave}
        />
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
