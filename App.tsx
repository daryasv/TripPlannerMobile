import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  DeviceEventEmitter,
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
import CreateNewPostScreen from "./src/components/feed/creatNewPost/CreateNewPostScreen";
import Toast from "react-native-toast-message";
import RouteDetailsScreen from "./src/components/feed/RouteDetailsScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initRoute, setInitRoute] = useState(null);

  const init = () => {
    setInitRoute(null);
    initUser((success) => {
      console.log("initUser", success);
      setInitRoute(success ? "Main" : "Login");
    });
  };

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("token_changed", init);
    init();
    return () => listener.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ActionSheetProvider>
        {initRoute ? (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                contentStyle: { backgroundColor: "white" },
              }}
              initialRouteName={initRoute}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Main"
                component={MainScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NewPost"
                component={CreateNewPostScreen}
                options={{ headerTitle: "New Post" }}
              />
              <Stack.Screen
                name="RouteDetails"
                component={RouteDetailsScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        ) : (
          <ActivityIndicator />
        )}
      </ActionSheetProvider>
      <Toast />
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
