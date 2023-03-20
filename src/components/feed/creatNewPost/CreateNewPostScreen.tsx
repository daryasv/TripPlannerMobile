import { Input, ListItem, Tab, TabView } from "@rneui/themed";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Colors } from "../../../theme/Colors";

export default function CreateNewPostScreen() {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [locationsOpen, setLocationsOpen] = React.useState(
    false as boolean
  );

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
          <ScrollView>
            <View
              style={{ width: "100%", alignItems: "center", marginBottom: 30 }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#aaa",
                  width: "40%",
                  aspectRatio: 1,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 30,
                }}
              >
                <Text
                  style={{ fontWeight: "600", fontSize: 18, color: "white" }}
                >
                  + Add Photo
                </Text>
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
            <ListItem.Chevron />
          </ScrollView>
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
