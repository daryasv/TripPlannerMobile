import { Button, Image, Input, ListItem } from "@rneui/themed";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SaveLocationData, saveLocation } from "../../../actions/feedActions";
import { ScrollView } from "react-native-gesture-handler";

const RouteTab = forwardRef((props, ref) => {
  const [time, setTime] = useState("" as string);
  const timerRef = useRef<NodeJS.Timer>();

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

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  if (!time) {
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
          }}
        >
          <Text>{time}</Text>
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
