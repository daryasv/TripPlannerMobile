import { Avatar, Card, Icon, Image } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReadMore from "@fawazahmed/react-native-read-more";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getExploreFeed } from "../../actions/feedActions";
import { Colors } from "../../theme/Colors";
import { postGenreEnum, PostType } from "../../types/postTypes";
import CitiesPanel from "./CitiesPanel";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function RouteDetailsScreen({ route }) {
  const data = route.params.item;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
      <View style={styles.itemContainer}>
        {/* <Text>Item ID: {data}</Text> */}
        <MapView
          style={{
            height: Dimensions.get("window").height / 2,
            width: "100%",
            borderRadius: 15,
          }}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          region={calculatedRegion(data)}
        >
          {data.contentData.pinnedLocationsDTO.length > 0 &&
            data.contentData.pinnedLocationsDTO.map((pinnedLocation) => (
              <Marker
                coordinate={{
                  latitude: pinnedLocation.locationDTO.latitude,
                  longitude: pinnedLocation.locationDTO.longitude,
                }}
                title={pinnedLocation.descriptionDTO}
              />
            ))}
          {
            <Polyline
              coordinates={data.contentData.locationsDTO}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          }
        </MapView>
        <View style={[styles.row, { marginTop: 10, marginStart: 10 }]}>
          <Icon name="routes" type={"material-community"} size={18} />
          <Text style={styles.location}>
            {" "}
            {data.contentData.totalDurationDTO} hours |{" "}
            {data.contentData.totalDistanceDTO} Km | Created at{" "}
            {data.dateUploaded}
          </Text>
        </View>
        <Text style={styles.pinnedLocations}>Pinned Locations:</Text>
        {data.contentData.pinnedLocationsDTO.map((item) => (
          <View>
            <Image
              source={{
                uri: data.contentData.pinnedLocationsDTO.imageFileNameDTO,
              }}
              style={{
                width: "100%",
                aspectRatio: 1.5,
                marginTop: 15,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
            <View style={[styles.row, { marginTop: 10, marginStart: 10 }]}>
              <Icon
                name="map-marker"
                type={"material-community"}
                size={18}
                color={"#FF0000"}
              />
              <Text style={styles.location}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const calculatedRegion = (data: PostType): Region => {
  const minLatitude = Math.min(
    ...data.contentData.locationsDTO.map((coord) => coord.latitude)
  );
  const maxLatitude = Math.max(
    ...data.contentData.locationsDTO.map((coord) => coord.latitude)
  );
  const minLongitude = Math.min(
    ...data.contentData.locationsDTO.map((coord) => coord.longitude)
  );
  const maxLongitude = Math.max(
    ...data.contentData.locationsDTO.map((coord) => coord.longitude)
  );

  const padding = 0.01; // Adjust the padding as needed

  const calculatedRegion: Region = {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.abs(maxLatitude - minLatitude) + padding,
    longitudeDelta: Math.abs(maxLongitude - minLongitude) + padding,
  };

  return calculatedRegion;
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    height: "auto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: Colors.Orange,
    fontWeight: "bold",
  },
  location: {
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 5,
  },
  description: {
    marginTop: 10,
  },
  pinnedLocations: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});
