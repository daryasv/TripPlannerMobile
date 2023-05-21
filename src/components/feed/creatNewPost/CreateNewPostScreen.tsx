import { Tab, TabView } from "@rneui/themed";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";
import Toast from "react-native-toast-message";

import { Colors } from "../../../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native";
import LocationTab from "./LocationTab";

export default function CreateNewPostScreen() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [saving, setSaving] = useState(false as boolean);
  const createLocationRef = useRef();

  const nav = useNavigation();

  const save = () => {
    if (createLocationRef?.current && !saving) {
      setSaving(true);
      (createLocationRef.current as any)
        .save()
        .then((r) => {
          setSaving(false);
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Post created successfully",
          });
          DeviceEventEmitter.emit("update_feed");
          nav.goBack();
        })
        .catch((e) => {
          Toast.show({
            type: "error",
            text1: "Failed",
            text2: "Failed to create post",
          });
          setSaving(false);
        });
    }
  };

  useEffect(() => {
    nav.setOptions({
      headerRight: () =>
        saving ? (
          <ActivityIndicator color={"primary"} />
        ) : (
          <Button title="Create" onPress={save} />
        ),
    });
  }, [saving]);

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
          <LocationTab ref={createLocationRef} />
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
