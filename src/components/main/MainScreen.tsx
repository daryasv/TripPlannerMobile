import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../feed/FeedScreen";
import ProfileScreen from "../profile/ProfileScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Icon } from "@rneui/themed";

const Tab = createBottomTabNavigator();

const Empty = () => null;

export default function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#303C9A" }}>
        <Tab.Screen
          name="Explore"
          component={() => <FeedScreen navigation={navigation} />}
          options={{
            tabBarLabel: "Explore",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="compass"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="New"
          component={Empty}
          options={{
            tabBarButton: () => (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#303C9A",
                  borderRadius: 28,
                  width: 56,
                  height: 56,
                  marginTop: -10,
                }}
                onPress={() => navigation.navigate("NewPost")}
              >
                <Icon
                  name="map-marker"
                  type="material-community"
                  size={30}
                  color="white"
                />
                {/* <Text style={{ fontSize: 10}}>New Post</Text> */}
              </TouchableOpacity>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
