import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../theme/Colors";
import { Logout } from "../../actions/security";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GetUserProfile, User } from "../../actions/profileActions";
import { postGenreEnum } from "../../types/postTypes";
import { Item } from "../feed/FeedScreen";
import { Button } from "@rneui/base";

const styles = StyleSheet.create({
  Avatar: {
    marginTop: 10,
    alignSelf: "center",
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 1,
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
    marginVertical: 15,
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
const locationsToSlice = 6;

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
  const [numOfSaved, setNumOfSaved] = useState(0);
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
    GetUserProfile((success) => {
      if (success) {
        allLocations = [];
        success.posts.forEach(function (value) {
          allLocations.push(value);
        });
        setLocations(allLocations.slice(-locationsToSlice));
        setLocationsNum(allLocations.length);
        setShowNoPosts(success.posts.length ? "none" : "flex");
        setNumOfSaved(success.user.savedRoutes?.length || 0);
        setUser(success.user);
      }
    });
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
        <TouchableOpacity>
          <Text style={styles.LocationsNum}>{numLocations}</Text>
          <Text style={styles.LocationsText}>My Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.RoutesNum}>{numOfSaved}</Text>
          <Text style={styles.RoutesText}>Saved</Text>
        </TouchableOpacity>
      </View>
      {locations.map((location) => {
        return (
          <Item
            data={location}
            type={
              location.postGenre == postGenreEnum.Location ? "image" : "route"
            }
          />
        );
      })}
      {allLocations.length > locationsToSlice ? (
        <Button
          title={"View all"}
          containerStyle={{ margin: 20, borderRadius: 8 }}
          onPress={() => navigation.navigate("Locations")}
        />
      ) : null}
    </ScrollView>
  );
}

export function ProfileLocationsScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={true}>
      {allLocations.map((location) => {
        return (
          <Item
            data={location}
            type={
              location.postGenre == postGenreEnum.Location ? "image" : "route"
            }
          />
        );
      })}
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
