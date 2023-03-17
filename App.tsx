import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/components/login/LoginScreen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { initUser } from "./src/actions/security";
import MainScreen from "./src/components/main/MainScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initRoute, setInitRoute] = useState(null);

  useEffect(() => {
    const exist = initUser();
    setInitRoute(exist ? "Main" : "Login");
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {initRoute ? (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
            initialRouteName={initRoute}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      ) : (
        <ActivityIndicator />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
