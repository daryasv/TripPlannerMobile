import { Tab, TabView } from "@rneui/themed";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import RouteTab from "./RouteTab";

export default function CreateNewPostScreen() {
  const [currentTab, setCurrentTab] = React.useState(0 as number);
  const [saving, setSaving] = useState(false as boolean);
  const createLocationRef = useRef();
  const createRouteRef = useRef();

  const nav = useNavigation();

  const onCreate = () => {
    if (currentTab === 0) {
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
    } else {
      if (createRouteRef?.current && !saving) {
        setSaving(true);
        (createRouteRef.current as any)
          .save()
          .then(() => {
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
    }
  };

  useEffect(() => {
    nav.setOptions({
      headerRight: () =>
        saving ? (
          <ActivityIndicator color={"primary"} />
        ) : (
          <Button title="Create" onPress={onCreate} />
        ),
    });
  }, [saving, currentTab, createRouteRef, createLocationRef]);

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
        onChange={(n) => setCurrentTab(n)}
        animationType="spring"
        containerStyle={{ flex: 1 }}
      >
        <TabView.Item style={{ flex: 1 }}>
          {currentTab === 0 && <LocationTab ref={createLocationRef} />}
        </TabView.Item>
        <TabView.Item style={{ flex: 1 }}>
          {currentTab === 1 && <RouteTab ref={createRouteRef} />}
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
