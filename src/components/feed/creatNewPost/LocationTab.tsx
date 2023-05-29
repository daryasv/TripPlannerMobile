import { Image, Input, ListItem } from "@rneui/themed";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import {} from "react-native-google-places-autocomplete";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SaveLocationData, saveLocation } from "../../../actions/feedActions";
import { getLocationData } from "../../utils/LocationsUtils";

const LocationTab = forwardRef((props, ref) => {
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

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    requestPermission();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];

      MediaLibrary.getAssetInfoAsync({
        id: asset.assetId,
        filename: asset.fileName,
        uri: asset.uri,
        mediaType: "photo",
        width: asset.width,
        height: asset.height,
        creationTime: null,
        modificationTime: null,
        duration: asset.duration,
      })
        .then((extraData) => {
          if (extraData?.location) {
            setData({
              ...data,
              locationLat: extraData.location.latitude.toString(),
              locationLong: extraData.location.longitude.toString(),
            });
            getLocationData(
              extraData.location.latitude,
              extraData.location.longitude
            ).then((address) => {
              if (address?.city) {
                setData({ ...data, cities: address.city });
              }
            });
          }
        })
        .catch((e) => {});

      setImage(asset);
    }
  };

  useImperativeHandle(ref, () => ({
    save() {
      return saveLocation(data, image);
    },
  }));

  return (
    <KeyboardAwareScrollView>
      <View style={{ width: "100%", alignItems: "center", marginBottom: 30 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#aaa",
            width: "50%",
            aspectRatio: 1,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 30,
          }}
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{
                uri: image?.uri,
              }}
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
          ) : (
            <Text style={{ fontWeight: "600", fontSize: 18, color: "white" }}>
              + Add Photo
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ListItem topDivider>
        <ListItem.Content>
          <ListItem.Title>Description</ListItem.Title>
          <TextInput
            placeholder="Write description..."
            style={{ marginTop: 10, fontSize: 16, margin: 5 }}
            multiline
            underlineColorAndroid={"transparent"}
            onChangeText={(text) => setData({ ...data, description: text })}
            value={data.description}
          />
        </ListItem.Content>
      </ListItem>
      <ListItem.Accordion
        topDivider
        bottomDivider
        isExpanded={locationsOpen}
        onPress={() => setLocationsOpen(!locationsOpen)}
        content={
          <ListItem.Content>
            <ListItem.Title>Location</ListItem.Title>
          </ListItem.Content>
        }
      >
        <Input></Input>
      </ListItem.Accordion>
    </KeyboardAwareScrollView>
  );
});

export default LocationTab;
