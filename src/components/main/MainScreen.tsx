import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../feed/FeedScreen";
import ProfileScreen from "../profile/ProfileScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CreateNewTripScreen from "../TripPlanning/CreateNewTripScreen";

const Tab = createBottomTabNavigator();

const Empty = () => null;

export default function MainScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#303C9A"}}>
        <Tab.Screen
          name="Explore"
          component={Empty}
          options={{
            headerTintColor: "black",
            tabBarLabel: "Explore",
            tabBarIcon: ({focused, color, size }) => (
              <MaterialCommunityIcons
                name="compass"
                color={focused ? "blue" : "black"}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="New"
          component={Empty}
          options={{
            tabBarLabel: "Add Post",
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus" color={"black"} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default action
              e.preventDefault();

              // Do something with the `navigation` object
              navigation.navigate("NewPost");
            },
          })}
        />
        <Tab.Screen
          name="plan"
          component={CreateNewTripScreen}
          options={{
            headerShown: false,
            tabBarLabel: "New Trip",
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons name="airplane" color={"black"} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons
                name="account-circle"
                color={focused ? "blue" : "black"}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
}
