import { Image, Input, ListItem } from "@rneui/themed";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SaveLocationData, saveLocation } from "../../../actions/feedActions";

const RouteTab = forwardRef((props, ref) => {
  const [locationsOpen, setLocationsOpen] = React.useState(false as boolean);

  const [data, setData] = useState({
    description: "",
    locationLat: "100",
    locationLong: "200",
    postGen: "0",
    cities: "",
  } as SaveLocationData);

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

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  useImperativeHandle(ref, () => ({
    save() {
      return saveLocation(data, image);
    },
  }));

  return (
    <KeyboardAwareScrollView>
      
        
    </KeyboardAwareScrollView>
  );
});

export default RouteTab;
