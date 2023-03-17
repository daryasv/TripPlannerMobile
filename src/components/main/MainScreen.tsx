import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedScreen from "../feed/FeedScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function MainScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen
          name="Explore"
          component={FeedScreen}
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
          name="Home"
          component={FeedScreen}
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
      </Tab.Navigator>
    </View>
  );
}
