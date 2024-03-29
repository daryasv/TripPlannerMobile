import { Image, Input, ListItem } from "@rneui/themed";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Text, TouchableOpacity, View, TextInput, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  CreateLocationData,
  createLocation,
} from "../../../actions/feedActions";
import { getLocationData } from "../../utils/LocationsUtils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import AutocompleteInput from "react-native-autocomplete-input";
import { MAPS_KEY_IOS } from "../../../actions/actionsConfig";

const LocationTab = forwardRef((props, ref) => {
  const [locationsOpen, setLocationsOpen] = React.useState(false as boolean);
  const [loadingImage, setLoadingImage] = useState(false);
  const [data, setData] = useState({
    description: "",
    locationLat: "0",
    locationLong: "0",
    postGen: "0",
    cities: "",
  } as CreateLocationData);

  const [image, setImage] = React.useState(
    null as ImagePicker.ImagePickerAsset
  );

  const [libraryPermissions, requestGalleryPermission] =
    MediaLibrary.usePermissions();
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
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      selectionLimit: 1,
      exif: false,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setLoadingImage(true);
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
          console.log("extra", extraData);
          if (extraData?.location) {
            setData((prev) => ({
              ...prev,
              locationLat: extraData.location.latitude.toString(),
              locationLong: extraData.location.longitude.toString(),
            }));
            window.setTimeout(() => {
              getLocationData(
                extraData.location.latitude,
                extraData.location.longitude
              ).then((address) => {
                const city = address?.city || address?.state || "";
                if (city) {
                  setData((prev) => ({ ...prev, cities: city }));
                }
              });
            }, 200);
          }
        })
        .catch((e) => {});

      setImage(asset);
    }
  };

  const pickImage = async () => {
    if (!libraryPermissions.granted) {
      const res = await requestGalleryPermission();
      if (!res.granted) {
        Alert.alert("Missing gallery permissions");
        return;
      }
    }
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
            setData((prev) => ({
              ...prev,
              locationLat: extraData.location.latitude.toString(),
              locationLong: extraData.location.longitude.toString(),
            }));
            window.setTimeout(() => {
              getLocationData(
                extraData.location.latitude,
                extraData.location.longitude
              ).then((address) => {
                console.log(address);
                const city = address?.city || address?.state || "";
                if (city) {
                  setData((prev) => ({ ...prev, cities: city }));
                }
              });
            }, 300);
          } else {
            setLocationsOpen(true);
          }
        })
        .catch((e) => {});

      setImage(asset);
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

  useImperativeHandle(ref, () => ({
    save() {
      if (
        !image ||
        !data.description ||
        !data.locationLat ||
        !data.locationLong
      ) {
        return;
      }
      console.log(data);
      return createLocation(data, image);
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
          onPress={onPress}
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

      <ListItem
        containerStyle={{
          borderRadius: 8,
          margin: 10,
        }}
      >
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "600" }}>
            Description
          </ListItem.Title>
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
        containerStyle={{
          borderRadius: 8,
          margin: 10,
          marginBottom: 0,
        }}
        topDivider
        bottomDivider
        isExpanded={locationsOpen}
        onPress={() => setLocationsOpen(!locationsOpen)}
        content={
          <ListItem.Content style={{ backgroundColor: "white" }}>
            <ListItem.Title style={{ fontWeight: "600" }}>
              Location
            </ListItem.Title>
          </ListItem.Content>
        }
      >
        <View style={{ backgroundColor: "white", margin: 10, marginTop: 0 }}>
          {locationsOpen ? (
            <GooglePlacesAutocomplete
              fetchDetails={true}
              placeholder="Search"
              enablePoweredByContainer={false}
              onPress={(geoData, geoDetails = null) => {
                const newData = { ...data };
                newData.locationLong =
                  geoDetails.geometry?.location?.lng.toString() || "0";
                newData.locationLat =
                  geoDetails.geometry?.location?.lat.toString() || "0";
                setData(newData);
                getLocationData(newData.locationLat, newData.locationLong)
                  .then((address) => {
                    const city =
                      address?.city || address?.state || address.country;
                    if (city) {
                      setData((prev) => ({ ...prev, cities: city }));
                    }
                  })
                  .catch((e) => {});
                // 'details' is provided when fetchDetails = true
              }}
              query={{
                key: MAPS_KEY_IOS,
                language: "en",
              }}
            />
          ) : null}
        </View>
      </ListItem.Accordion>
    </KeyboardAwareScrollView>
  );
});

export default LocationTab;
