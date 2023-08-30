import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text, ScrollView } from "react-native";
import { Avatar, Button, Icon, Image } from "@rneui/themed";
import { Colors } from "../../theme/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import ReadMore from "@fawazahmed/react-native-read-more";
import { AddLocationToRoute, getRouteId } from "../../actions/tripActions";

export default function LocationsSelectionScreen({ route }) {
  const category = route.params.title;
  const currDay = route.params.currDay;
  const city = route.params.city;
  const locations = route.params.categoryLocations;
  const selectedLocations = route.params.selectedLocations;
  const region = route.params.region;
  const numOfDays = route.params.numOfDays;

  const [updatedRoute, setNewRoute] = useState(null);
  const [selected, setSelected] = useState([]);
  const navigation = useNavigation();
  const temp = new Date();

  const iconPressed = (item) => {
    if (selected.includes(item.dataID)) {
      setSelected(selected.filter((id) => id !== item.dataID));
    } else {
      setSelected([...selected, item.dataID]);
    }

    AddLocationToRoute(
      {
        routeId: getRouteId(),
        day: currDay,
        newPinnedLocationId: item.dataID,
      },
      (success) => {
        if (success) {
          setNewRoute(success.RouteDto);
        }
      }
    );
  };

  const handleGoBack = () => {
    navigation.navigate("PlanDaysScreen", {
      updatedRoute,
      city,
      currDay,
      region,
      numOfDays,
    });
  };

  return (
    <View style={styles.iphone1313Pro16}>
      <View style={styles.frame1}>
        <View style={{ alignItems: "flex-start" }}>
          <Button
            radius={5}
            iconPosition="left"
            type="clear"
            color={Colors.Whitesmoke}
            onPress={() => handleGoBack()}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              color={Colors.LightBlack}
              size={30}
            />
          </Button>
        </View>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={[styles.yourTrip]}>{category}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={{paddingBottom: 20}}>
          <View style={[styles.frameParent]}>
            <MapView
              style={styles.image29Icon}
              provider={PROVIDER_GOOGLE}
              showsCompass={true}
              toolbarEnabled={false}
              zoomEnabled={true}
              region={region}
            >
              {locations.length > 0 &&
                locations.map((pinnedLocation) => (
                  <Marker
                    key={pinnedLocation.dataID + temp.getTime()}
                    coordinate={{
                      longitude:
                        pinnedLocation.contentData.locationDTO.latitude,
                      latitude:
                        pinnedLocation.contentData.locationDTO.longitude,
                    }}
                    title={pinnedLocation.contentData.descriptionDTO}
                    pinColor={
                      selected.includes(pinnedLocation.dataID)
                        ? Colors.main
                        : "#FF000"
                    }
                  />
                ))}
            </MapView>
          </View>
          <View style={styles.frameParent2}>
            {locations.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.locationFrame,
                  selected.includes(item.dataID) &&
                    styles.selectedLocationFrame,
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <Avatar
                    source={{
                      uri: item.UploadByProfilePictureUrl,
                    }}
                    rounded
                    size={40}
                    containerStyle={{ paddingTop: 5, paddingLeft: 5 }}
                  />
                  <View
                    style={{
                      marginLeft: 8,
                      width: "70%",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Text style={styles.username}>
                      {item.uploadedBy.includes("@")
                        ? item.uploadedBy.substring(
                            0,
                            item.uploadedBy.indexOf("@")
                          )
                        : item.uploadedBy}
                    </Text>
                  </View>
                  <Button
                    type="clear"
                    style={{
                      width: 48,
                      height: 48,
                      borderColor: "black",
                      alignContent: "flex-end",
                    }}
                    onPress={() => {
                      iconPressed(item);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="plus-circle-outline"
                      style={[
                        styles.addToTrip,
                        selected.includes(item.dataID) && styles.selectedIcon,
                      ]}
                    />
                  </Button>
                </View>
                <Image
                  source={{
                    uri: item.contentData.imageFileNameDTO,
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: 1.5,
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
                  <Text style={styles.location}>
                    {item.contentData.descriptionDTO}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    color: "black",
    fontWeight: "bold",
  },
  description: {
    fontWeight: "600",
  },
  locationFrameTop: {
    width: "100%",
    height: 55,
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedIcon: {
    color: Colors.main,
    fontSize: 30,
  },
  addToTrip: {
    color: "black",
    fontSize: 30,
  },
  selectedLocationFrame: {
    borderWidth: 2,
    borderColor: Colors.main,
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: "2%",
    borderRadius: 10,
    width: "96%",
  },
  locationFrame: {
    borderWidth: 0,
    borderColor: Colors.main,
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: "2%",
    borderRadius: 10,
    width: "96%",
    marginBottom: 5,
  },
  frameButtonBtn1: {
    top: "88%",
    position: "absolute",
    width: "90%",
    height: "10%",
    marginLeft: "5%",
  },
  doneButtonTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "left",
  },
  doneButton: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    // width: "100%",
    // flexGrow: 1,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 5,
  },
  frameParent2: {
    top: 12,
    width: "100%",
  },
  frameFlatList1Content: {
    flexDirection: "column",
  },
  framePosition: {
    position: "absolute",
  },
  foodFlexBox: {
    justifyContent: "center",
    overflow: "hidden",
  },
  saveFlexBox: {
    textAlign: "left",
    color: Colors.LightBlack,
  },
  frameChild: {
    width: "100%",
    flex: 1,
  },
  image29Icon: {
    height: "100%",
    borderRadius: 5,
    width: "96%",
    marginLeft: "2%",
  },
  frameItem: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 2,
    marginTop: 8,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  frameParent: {
    height: 400,
    width: "100%",
  },
  arrowLeft1Icon: {
    alignItems: "flex-start",
  },
  yourTrip: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 48,
  },
  save: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: "35%",
  },
  frame2: {
    width: "65%",
    height: "80%",
    marginLeft: "18%",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  frame1: {
    width: "100%",
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  frame: {
    width: "100%",
    alignItems: "flex-end",
    position: "absolute",
    height: "10%",
  },
  iphone1313Pro16: {
    backgroundColor: Colors.Whitesmoke,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});
