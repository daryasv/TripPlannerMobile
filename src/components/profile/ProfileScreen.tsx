import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { Colors } from "../../theme/Colors";
import { Logout } from "../../actions/security";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GetUserProfile, User } from "../../actions/profileActions";
import { postGenreEnum } from "../../types/postTypes";

const styles = StyleSheet.create({
  Avatar: {
    marginTop: 10,
    alignSelf: "center",
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  UserName: {
    marginTop: 10,
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 24,
  },
  NoPostsMsg: {
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 16,
  },
  LocationsNum: {
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 4,
  },
  RoutesNum: {
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  LocationsText: {
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 18,
    borderRadius: 4,
    marginBottom: 20,
  },
  RoutesText: {
    color: Colors.LightBlack,
    textAlign: "center",
    fontSize: 18,
  },
  imageContainerStyle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
  },
  imageStyle: {
    height: 120,
    width: "100%",
  },
  LocationsHeader: {
    color: Colors.main,
    textAlign: "left",
    fontSize: 18,
    borderRadius: 4,
    marginHorizontal: "7%",
    fontWeight: "bold",
  },
  ViewAll: {
    color: Colors.LightBlack,
    textAlign: "right",
    fontSize: 16,
    borderRadius: 4,
    marginHorizontal: "7%",
  },
  Logout: {
    color: Colors.main,
    textAlign: "right",
    fontSize: 16,
    marginHorizontal: "2%",
    marginTop: "2%",
    fontWeight: "bold",
  },
});

let allLocations = [];
let allRoutes = [];

const Stack = createNativeStackNavigator();

export default function ProfileScreen() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="ProfileHome">
        <Stack.Screen
          name="ProfileHome"
          options={{ headerShown: false }}
          component={ProfileHomeScreen}
        />
        <Stack.Screen name="Locations" component={ProfileLocationsScreen} />
        <Stack.Screen name="Routes" component={ProfileRoutesScreen} />
        <Stack.Screen name="Saved" component={ProfileRoutesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function ProfileHomeScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [numLocations, setLocationsNum] = useState(0);
  const [numRoutes, setRoutesNum] = useState(0);
  type displayFields = "flex" | "none";
  const [showNoPosts, setShowNoPosts] = useState("none" as displayFields);

  const defaultUser: User = {
    _id: "",
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    password: "",
    profilePictureId: "",
    userPicturesIds: [],
    savedPicturesIds: [],
    savedRoutes: [],
    createdAt: "",
    updatedAt: "",
    __v: 0,
  };

  const [user, setUser] = useState<User>(defaultUser);

  function showViewAll() {
    if (showNoPosts == "flex") {
      return "none";
    } else {
      return "flex";
    }
  }

  useEffect(() => {
    // GetUserProfile((success) => {
    //   if (success) {
    //     success.posts.forEach(function (value) {
    //       if (value.postGenre == postGenreEnum.Location) {
    //         allLocations.push(value);
    //       } else {
    //         allRoutes.push(value);
    //       }
    //     });
    //     setLocations(allLocations.slice(-6));
    //     setLocationsNum(allLocations.length);
    //     setRoutes(allRoutes.slice(-6));
    //     setRoutesNum(success.posts.length - allLocations.length);
    //     setShowNoPosts(success.posts.length ? "none" : "flex");
    //     setUser(success.user);
    //   }
    // });
  }, []);

  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      <Text style={styles.Logout} onPress={() => Logout()}>
        Logout
      </Text>
      <Image style={styles.Avatar} source={{ uri: user.profilePictureId }} />
      <Text style={styles.UserName}>
        {user.userFirstName + " " + user.userLastName}
      </Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.LocationsNum}>{numLocations}</Text>
          <Text style={styles.LocationsText}>Locations</Text>
        </View>
        <View>
          <Text style={styles.RoutesNum}>{numRoutes}</Text>
          <Text style={styles.RoutesText}>Routes</Text>
        </View>
      </View>
      <View>
        <View style={styles.actionRow}>
          <Text style={styles.LocationsHeader}>Locations</Text>
          <Pressable
            onPress={() => navigation.navigate("Locations")}
            style={{ display: showViewAll() }}
          >
            <Text style={styles.ViewAll}>View all</Text>
          </Pressable>
        </View>
        <View
          style={{
            borderBottomColor: Colors.LightBlack,
            borderBottomWidth: StyleSheet.hairlineWidth,
            margin: 10,
          }}
        />
        <View
          style={{
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row",
            paddingVertical: 5,
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <View style={{ display: showNoPosts }}>
            <Text style={styles.NoPostsMsg}>no posts :(</Text>
          </View>
          {locations.map((location) => (
            <View key={location.dataID}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  marginVertical: 0.5,
                  marginBottom: 15,
                  marginHorizontal: 12,
                  borderRadius: 10,
                }}
                source={{ uri: location.contentData.imageFileNameDTO }}
              />
            </View>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.actionRow}>
          <Text style={styles.LocationsHeader}>Routes</Text>
          <Pressable onPress={() => navigation.navigate("Routes")}>
            <Text style={styles.ViewAll}>View all</Text>
          </Pressable>
        </View>
        <View
          style={{
            borderBottomColor: Colors.LightBlack,
            borderBottomWidth: StyleSheet.hairlineWidth,
            margin: 10,
          }}
        />
        <View
          style={{
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row",
            paddingVertical: 5,
            justifyContent: "space-between",
          }}
        >
          {routes.map((route) => (
            <View
              style={{
                width: 100,
                height: 100,
                marginVertical: 0.5,
                backgroundColor: "black",
                opacity: 0.1,
                marginBottom: 15,
                marginHorizontal: 12,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>
                {route.cities.join(",")}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <View style={styles.actionRow}>
          <Text style={styles.LocationsHeader}>Saved Locations</Text>
          <Pressable onPress={() => navigation.navigate("Saved")}>
            <Text style={styles.ViewAll}>View all</Text>
          </Pressable>
        </View>
        <View
          style={{
            borderBottomColor: Colors.LightBlack,
            borderBottomWidth: StyleSheet.hairlineWidth,
            margin: 10,
          }}
        />
        <View
          style={{
            width: "100%",
            flexWrap: "wrap",
            flexDirection: "row",
            paddingVertical: 5,
            justifyContent: "space-between",
          }}
        >
          {[].map((route) => (
            <View
              style={{
                width: 100,
                height: 100,
                marginVertical: 0.5,
                backgroundColor: "black",
                opacity: 0.1,
                marginBottom: 15,
                marginHorizontal: 12,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>
                {route.cities.join(",")}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export function ProfileLocationsScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      <View
        style={{
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
          paddingVertical: 5,
          justifyContent: "space-between",
        }}
      >
        {allLocations.map((location) => (
          <View key={location.dataID}>
            <Image
              style={{
                width: 100,
                height: 100,
                marginVertical: 0.5,
                marginBottom: 15,
                marginHorizontal: 12,
                borderRadius: 10,
              }}
              source={{ uri: location.contentData.imageFileNameDTO }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export function ProfileRoutesScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      <View
        style={{
          width: "100%",
          flexWrap: "wrap",
          flexDirection: "row",
          paddingVertical: 5,
          justifyContent: "space-between",
        }}
      >
        {allRoutes.map((route) => (
          <View
            style={{
              width: 100,
              height: 100,
              marginVertical: 0.5,
              backgroundColor: "black",
              opacity: 0.1,
              marginBottom: 15,
              marginHorizontal: 12,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {route.cities.join(",")}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
