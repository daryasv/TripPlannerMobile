import { Button } from "@rneui/themed";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import MapView, { PROVIDER_GOOGLE, Marker, LatLng, Region, Polyline } from "react-native-maps"
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";

let i = 0;

const RouteTab = forwardRef((props, ref) => {
  const [time, setTime] = useState("" as string);
  const timerRef = useRef<NodeJS.Timer>();
  const [currentPosition, setCurrentPosition] = useState<LatLng | undefined>(undefined);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [path, setPath] = useState<LatLng[]>([]);

  const [image, setImage] = React.useState(
    null as ImagePicker.ImagePickerAsset
  );

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

  const handleStart = () => {
    const start = moment();
    setTime("00:00:00");
    timerRef.current = setInterval(() => {
      const label = moment
        .utc(moment.duration(moment().diff(start)).asMilliseconds())
        .format("HH:mm:ss");
      setTime(label);
    }, 1000);
  };

  const handleStop = () => {
    if (timerRef?.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTime(null);
    }
  };

  const sendPositionToServer = (position: LatLng) => {
    console.log('Sending position to server:', position);
  };

  useEffect(() => {
    let positionTimer: NodeJS.Timeout;
    let polylineTimer: NodeJS.Timeout;
    
    handleStop();
    
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      const currentPosition: LatLng = { latitude, longitude };
      setCurrentPosition(currentPosition);
      setRegion((prevRegion) => ({
        ...prevRegion,
        latitude,
        longitude,
      }));

      positionTimer = setInterval(() => {
        sendPositionToServer(currentPosition);
      }, 15000);

      polylineTimer = setInterval(() => {
        const newPosition: LatLng = {
          latitude: currentPosition.latitude - i,
          longitude: currentPosition.longitude - 0.001 - i,
        };
        setPath((prevPath) => [...prevPath, newPosition]);
        i += 0.002;
      }, 5000);

    })();

    return () => {
      clearInterval(positionTimer);
      clearInterval(polylineTimer);
    };
  }, []);

  if (false) {
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
      <><ScrollView>
        <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        justifyContent: "space-between",
      }}
    >
      <Text>{time}</Text>
      <Button
        title={"Stop"}
        buttonStyle={{ backgroundColor: "black", width: 100 }}
        onPress={handleStop}
      ></Button>
    </View>

      </ScrollView><MapView style={{ height: "50%", width: "100%" }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        region={region}>
          {currentPosition && <Marker coordinate={currentPosition} />}
          {path.length > 0 && <Polyline coordinates={path} strokeColor="#FF0000" strokeWidth={3} />}
        </MapView>
        </>
    );
  }
});

export default RouteTab;
