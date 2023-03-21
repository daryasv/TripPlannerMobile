import {  Image, Input, ListItem, Tab, TabView } from "@rneui/themed";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Colors } from "../../../theme/Colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";

const LocationTab = () => {
  const [locationsOpen, setLocationsOpen] = React.useState(false as boolean);
  const [image, setImage] = React.useState(null);

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
      setImage(result.assets[0].uri);
    }
  };

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
                uri: image,
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
            //onChangeText={(text) => setData({ ...data, userEmail: text })}
            //value={data.userEmail}
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
};

export default function CreateNewPostScreen() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerRight: () => (
        <Button title="Create"/>
      ),
    });
  });

  return (
    <View style={{ flex: 1 }}>
      <Tab
        value={currentTab}
        onChange={setCurrentTab}
        indicatorStyle={{ backgroundColor: Colors.main }}
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: "#E6E7F2" }}
      >
        <Tab.Item
          titleStyle={{
            color: currentTab === 0 ? Colors.main : Colors.LightBlack,
            ...styles.tabTitle,
          }}
          title={"Location"}
        />
        <Tab.Item
          titleStyle={{
            color: currentTab === 1 ? Colors.main : Colors.LightBlack,
            ...styles.tabTitle,
          }}
          title={"Route"}
        />
      </Tab>
      <TabView
        value={currentTab}
        onChange={setCurrentTab}
        animationType="spring"
        containerStyle={{ flex: 1 }}
      >
        <TabView.Item style={{ flex: 1 }}>
          <LocationTab />
        </TabView.Item>
        <TabView.Item style={{ flex: 1 }}>
          <Text>Route</Text>
        </TabView.Item>
      </TabView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabTitle: {
    fontSize: 16,
    height: 30,
    fontWeight: "600",
  },
});
