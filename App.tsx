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
import CreateNewTripScreen from "./src/components/TripPlanning/CreateNewTripScreen";
import Toast from "react-native-toast-message";
import RouteDetailsScreen from "./src/components/feed/RouteDetailsScreen";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import ChooseCountryScreen from "./src/components/TripPlanning/ChooseCountryScreen";
import ChooseCityScreen from "./src/components/TripPlanning/ChooseCityScreen";
import ChooseDaysScreen from "./src/components/TripPlanning/ChooseDaysScreen";
import PlanDaysScreen from "./src/components/TripPlanning/PlanDaysScreen";
import LocationsSelectionScreen from "./src/components/TripPlanning/LocationsSelectionScreen";
import TripOverviewScreen from "./src/components/TripPlanning/TripOverviewScreen";


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
    <SafeAreaView style={{ flex: 1}}>
      <ActionSheetProvider>
        {initRoute ? (
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                contentStyle: { backgroundColor: "#F2F2F2" },
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
              <Stack.Screen
                name="TripPlanning"
                component={CreateNewTripScreen}
              />
              <Stack.Screen
                name="ChooseCountryScreen"
                component={ChooseCountryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChooseCityScreen"
                component={ChooseCityScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ChooseDaysScreen"
                component={ChooseDaysScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PlanDaysScreen"
                component={PlanDaysScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="LocationsSelectionScreen"
                component={LocationsSelectionScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TripOverviewScreen"
                component={TripOverviewScreen}
                options={{ headerShown: false }}
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
