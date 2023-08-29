import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  Alert
} from "react-native";
import { Avatar, Button, Icon, Image } from "@rneui/themed";
import { Colors } from "../../theme/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { saveRoute, getRouteId } from "../../actions/tripActions";

export default function TripOverViewScreen({ route }) {

  const numOfDays = route.params.numOfDays;
  const region = route.params.region;
  const tripLocations = route.params.tripLocations;
  const totalTripLocations = route.params.totalTripLocations;
  const path = route.params.path;
  const city = route.params.city;

  const [daySelected, setDaySelected] = useState("Day 1")
  const [categorySelected, setCategorySelected] = useState("")
  const [shownLocations, setShownLocations] = useState([]);
  const [shownPath, setShownPath] = useState(path[1]);
  const [description, setDescription] = React.useState("");
  
  const navigation = useNavigation();

  const createDaysArray = (num) => {
    const dayArray: string[] = [];

    for (let i = 1; i <= num; i++) {
      dayArray.push("Day " + i.toString());
    }

    return dayArray;
  };

  const days = createDaysArray(numOfDays);

  const clickedCategory = (title) => {
    if (categorySelected != title) {
      setCategorySelected(title)
      updateFilter(daySelected, title)
    } else {
      setCategorySelected("")
      updateFilter(daySelected, "")
    }
  };

  const clickedSave = () => {
    saveRoute({routeId: getRouteId(), description: description,cities: city},(success) => {
      if (success) {
        Alert.alert('Your new trip is saved!', '', [
          {text: 'OK', onPress: () => navigation.navigate("Main")},
        ]);
      }
    });
  };

  const clickedDay= (item) => {
    setDaySelected(item)
    updateFilter(item, categorySelected)
  };

  const findLocations = (idList) => {
    let returnValue = []
    idList.forEach(element => {
      totalTripLocations.filter(location => location.dataID == element).forEach(location => {returnValue.push(location)})
    });

    return (returnValue)
  };

  const updateFilter = (day, category) => {
    if (category != "") {
      setShownLocations(findLocations(tripLocations[parseInt(day.slice(4))]).filter(location => location.categories.includes(category.toLowerCase())))
    } else {
      setShownLocations(findLocations(tripLocations[parseInt(day.slice(4))]))
    }

    setShownPath(path[parseInt(day.slice(4))].map(item => ({ latitude: item.longitude, longitude: item.latitude })))
  };

  useEffect(() => {
    setShownLocations(findLocations(tripLocations[1]))
    setShownPath(path[1].map(item => ({ latitude: item.longitude, longitude: item.latitude })))
  }, []);

  return (
    <View style={styles.iphone1313Pro16}>
      <View style={[styles.frameParent]}>
        <View>
          <View style={styles.days}>
            <FlatList
              horizontal= {true}
              style={styles.frameChild}
              data={days}
              renderItem={({ item }) => <Text style={[styles.day, daySelected == item && styles.selectedDay]} onPress={() => {clickedDay(item)}}>{item}</Text>}
              contentContainerStyle={styles.frameFlatListContent}
              extraData={daySelected}
            />
            </View>
            <View style={styles.mapView}>
            <MapView
          style={styles.image29Icon}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          region={region}
        >
          {shownLocations.length > 0 &&
            shownLocations.map((pinnedLocation) => (
              <Marker
                coordinate={{
                  latitude: pinnedLocation.contentData.locationDTO.longitude,
                  longitude: pinnedLocation.contentData.locationDTO.latitude,
                }}
                title={pinnedLocation.contentData.descriptionDTO}
              />
            ))}
          {shownPath.length > 1 &&
            <Polyline
              coordinates={shownPath}
              strokeColor="#FF0000"
              strokeWidth={5}
            />
          }
        </MapView>
          </View>
          <View style={styles.foodDrinksCoffeeMugCoffeeParent}>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.leftButton}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Coffee Shops" && styles.buttonPressed]}
              onPress={() => clickedCategory("Coffee Shops")}
            >
            <MaterialCommunityIcons
              name= "coffee-outline"
              size={30}
              style={[styles.icon, categorySelected == "Coffee Shops" && styles.iconPressed]}
            />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.travelAirportBaggageCheckBtn}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Resturants" && styles.buttonPressed]}
              onPress={() => clickedCategory("Resturants")}
            >
              <MaterialCommunityIcons
              name= "silverware-fork-knife"
              size={30}
              style={[styles.icon, categorySelected == "Resturants" && styles.iconPressed]}
            />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.travelAirportBaggageCheckBtn}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Shopping" && styles.buttonPressed]}
              onPress={() => clickedCategory("Shopping")}
            >
              <MaterialCommunityIcons
                name= "shopping-outline"
                size={30}
                style={[styles.icon, categorySelected == "Shopping" && styles.iconPressed]}
              />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.travelAirportBaggageCheckBtn}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Bars" && styles.buttonPressed]}
              onPress={() => clickedCategory("Bars")}
            >
              <MaterialCommunityIcons
                name= "glass-cocktail"
                size={30}
                style={[styles.icon, categorySelected == "Bars" && styles.iconPressed]}
              />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.travelAirportBaggageCheckBtn}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Tourist Sites" && styles.buttonPressed]}
              onPress={() => clickedCategory("Tourist Sites")}
            >
              <MaterialCommunityIcons
                name= "pillar"
                size={30}
                style={[styles.icon, categorySelected == "Tourist Sites" && styles.iconPressed]}
              />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.travelAirportBaggageCheckBtn}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Museums" && styles.buttonPressed]}
              onPress={() => clickedCategory("Museums")}
            >
              <MaterialCommunityIcons
                name= "bank"
                size={30}
                style={[styles.icon, categorySelected == "Museums" && styles.iconPressed]}
              />
            </Button>
            <Button
              radius="5"
              iconPosition="left"
              type="outline"
              color="#fff"
              containerStyle={styles.rightButton}
              buttonStyle={[styles.travelAirportBaggageCheckBtn1, categorySelected == "Hotels" && styles.buttonPressed]}
              onPress={() => clickedCategory("Hotels")}
            >
              <MaterialCommunityIcons
                name= "bed"
                size={30}
                style={[styles.icon, categorySelected == "Hotels" && styles.iconPressed]}
              />
            </Button>
          </View>
          <View style={styles.inputText}>
              <TextInput placeholder="Write trip description here..." onChangeText={text => setDescription(text)}></TextInput>
          </View>
        </View>
      </View>
      <ScrollView style={styles.frameParent2} contentContainerStyle={{ paddingBottom: 180 }}>
      {shownLocations.map((item, index) => (
          <View key={index} style={styles.locationFrame}>
          <View style={{ flexDirection: "row"}}>
            <Avatar
              source={{
                uri: item.UploadByProfilePictureUrl,
              }}
              rounded
              size={40}
              containerStyle={{paddingTop: 5, paddingLeft: 5}}
            />
            <View style={{ marginLeft: 8, width: "70%", justifyContent: "space-evenly"}}>
              <Text style={styles.username}>
                {item.uploadedBy.includes("@")
                  ? item.uploadedBy.substring(0, item.uploadedBy.indexOf("@"))
                  : item.uploadedBy}
              </Text>
            </View>
          </View>
          <Image
            source={{
              uri: item.contentData.imageFileNameDTO,
            }}
            style={{
              marginTop: 8,
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
            <Text style={styles.location}>{item.contentData.descriptionDTO}</Text>
          </View>
        </View>
        ))}
      </ScrollView>
      <View style={[styles.frame, styles.foodFlexBox]}>
        <View style={styles.frame1}>
        <Button
            radius={5}
            iconPosition="left"
            type="clear"
            color={Colors.Whitesmoke}
            onPress={() => navigation.goBack()}
            containerStyle={styles.arrowLeft1Icon}
          ><MaterialCommunityIcons
          name="chevron-left"
          color={Colors.LightBlack}
          size={30}
        /></Button>
          <View style={styles.frame2}>
            <Text style={[styles.yourTrip, styles.saveFlexBox]}>Your Trip</Text>
            <Text style={[styles.save, styles.saveFlexBox]} onPress={() => clickedSave()}>Save</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  locationFrame: {
    borderWidth: 0,
    borderColor: Colors.main,
    padding: 10,
    backgroundColor: "#fff",
    marginHorizontal: "2%",
    borderRadius: 10,
    width: "96%"
  },
  username: {
    color: "black",
    fontWeight: "bold",
  },
  iconPressed: {
    color: "#fff",
  },
  icon: {
    color: Colors.LightBlack,
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
    top: "20%",
    height: "100%",
    width: "100%",
  },
  leftButton: {
    padding: 1,
    paddingLeft: 10,
  },
  rightButton: {
    padding: 1,
    paddingRight: 10,
  },
  mapView:
  {
    width: "100%",
    height: "60%",
  },
  day: {
    width: 70,
    height: 30,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500"
  },
  selectedDay: {
    width: 70,
    height: 30,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "700"
  },
  days: {
    width: "100%",
    height: 40,
  },
  frameFlatListContent: {
    flexDirection: "row",
    width: "100%",
    height: "50%",
    alignContent: "center",
    justifyContent: "center"
  },
  foodDrinksCoffeeMugCoffeeBtn: {
    paddingLeft: 8,
  },
  foodDrinksCoffeeMugCoffeeBtn1: {
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 0,
    width: "100%",
    height: "10%",
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  travelAirportBaggageCheckBtn: {
    padding: 1,
  },
  buttonPressed: {
    borderRadius: 4,
    width: 48,
    height: 48,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    borderWidth: 0,
  },
  travelAirportBaggageCheckBtn1: {
    borderRadius: 4,
    width: 48,
    height: 48,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 0,
  },
  travelHotelOneStarOneStaBtn: {
    padding: 1,
  },
  travelHotelOneStarOneStaBtn1: {
    borderRadius: 4,
    width: 48,
    height: 48,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    marginLeft: "2%"
  },
  foodKitchenwareForkSpoonF: {
    paddingHorizontal: 2,
    alignItems: "center",
    paddingVertical: 1,
    justifyContent: "center",
    height: 48,
    width: 48,
    flexDirection: "row",
    borderRadius: 4,
  },
  foodDrinksCocktailGlassCo: {
    paddingHorizontal: 3,
    alignItems: "center",
    paddingVertical: 1,
    justifyContent: "center",
    height: 48,
    width: 48,
    flexDirection: "row",
    borderRadius: 4,
  },
  travelPlacesColumn1Pillar: {
    paddingHorizontal: 1,
    paddingVertical: 2,
    alignItems: "center",
    height: 48,
    width: 48,
    justifyContent: "center",
    borderRadius: 4,
  },
  foodDrinksCoffeeMugCoffeeParent: {
    justifyContent: "space-between",
    marginTop: 10,
    flexDirection: "row",
    width: "100%",
    height: 50,
  },
  inputText: {
    justifyContent: "space-between",
    marginTop: 10,
    flexDirection: "row",
    width: "96%",
    marginLeft: "2%",
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 5
  },
  frameItem: {
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 8,
    marginTop: 12,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  frameParent: {
    top: "10%",
    height: "40%",
    width: "100%",
  },
  arrowLeft1Icon: {
    width: 50,
    height: 50,
    overflow: "hidden",
  },
  yourTrip: {
    fontSize: 24,
    fontWeight: "700",
  },
  save: {
    fontSize: 18,
    fontWeight: "800",
    marginLeft: "35%",
  },
  frame2: {
    width: "65%",
    height: "80%",
    marginLeft: "24%",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  frame1: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    overflow: "hidden",
  },
  frame: {
    top: "2%",
    width: "100%",
    alignItems: "flex-end",
    position: "absolute",
  },
  iphone1313Pro16: {
    backgroundColor: Colors.Whitesmoke,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    flex: 1,
  },
});
