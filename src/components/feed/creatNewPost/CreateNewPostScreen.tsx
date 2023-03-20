import { Tab, TabView } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../theme/Colors";

export default function CreateNewPostScreen() {
  const [currentTab, setCurrentTab] = React.useState(0);

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
      >
        <TabView.Item>
          <Text>Location</Text>
        </TabView.Item>
        <TabView.Item>
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
