import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
} from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Colors } from "../../theme/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { GetSavedLocations, StartPlanRoute, getRegion, getRouteId } from "../../actions/tripActions";

const DATA = [
  {
    id: '1',
    title: 'Coffee Shops',
    icon: 'coffee-outline',
  },
  {
    id: '2',
    title: 'Restaurants',
    icon: 'silverware-fork-knife',
  },
  {
    id: '3',
    title: 'Shopping',
    icon: 'shopping-outline',
  },
  {
    id: '4',
    title: 'Bars',
    icon: 'glass-cocktail',
  },
  {
    id: '5',
    title: 'Tourist Sites',
    icon: 'pillar',
  },
  {
    id: '6',
    title: 'Museums',
    icon: 'bank',
  },
  {
    id: '7',
    title: 'Hotels',
    icon: 'bed',
  },
];

type ItemProps = {title: string, icon: string};

export default function PlanDaysScreen({route}) {

  const city = route.params.city;
  let numOfDays = route.params.numOfDays;
  // let currDay = route.params.currDay;
  const updatedRoute = route.params.updatedRoute;

  const [region, setRegion] = useState({ latitude: 37.7749, longitude: -122.4194, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  const [currDay, setDay] = useState(route.params.currDay);
  const [totalPath, setTotalPath] = useState([]);
  const [path, setPath] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [tripLocations, setTripLocations] = useState([]);
  const [totalTripLocations, setTotalTripLocations] = useState([]);
  const [frameFlatListData, setFrameFlatListData] = useState(DATA);
  const [buttonTitle, setButtonTitle] = useState("Next Day");
  const navigation = useNavigation();
  const test = useRoute();

  useEffect(() => {
    // const updatedParameter = test.params?.updatedRoute;
    if (getRouteId() == "") {
      StartPlanRoute((success) => {
        if (success) {
          // setRoute(success)
        }
      });

      GetSavedLocations(city, (success) => {
        if (success) {
          setSavedLocations(success)
          console.log("Saved locations:" + {success});
        }
      });
    }

    getRegion(city, (success) => {
      if (success) {
        setRegion(success)
      }
    });

    const unsubscribe = navigation.addListener('focus', ListenerFunc);
    return unsubscribe;
  }, [test.params]);

  const ListenerFunc = () => {
    FindTripLocationsAndTotalPath()
    // CheckDays()
  };

  const FindTripLocationsAndTotalPath = () => {
    let newTripLocations = [];
    let newTotalPath = [];
      if (updatedRoute) {

        for (let index = 1; index <= Object.keys(updatedRoute.pinnedLocations).length; index++) {
          const dayLocations = updatedRoute.pinnedLocations[index];

          for (let index = 0; index < dayLocations.length; index++) {
            const element = dayLocations[index];
            savedLocations.filter(location => location.dataID == element).forEach(location => {newTripLocations.push(location)})
          }
        }
        // updatedRoute.pinnedLocations.foreach(dayLocations => { dayLocations.forEach(element => {
        // (savedLocations.filter(location => location.dataID == element).forEach(location => {newTripLocations.push(location)}))})});
      
        for (let index = 1; index <= Object.keys(updatedRoute.locations).length; index++) {
          const dayPath = updatedRoute.locations[index];

          for (let index = 0; index < dayPath.length; index++) {
            const element = dayPath[index];
            newTotalPath.push(element)
          }
        }
        // updatedRoute.locations.forEach(dayPath => dayPath.forEach(position => newTotalPath.push(position)));

        setTotalTripLocations(newTripLocations)
        setTotalPath(newTotalPath)
        setTripLocations(updatedRoute.pinnedLocations)
        setPath(updatedRoute.locations)
    }
  };

  const CheckDays = () => {
    if (currDay == numOfDays) {
      setButtonTitle("Done")
    }
  };

  const ChooseLocations = (title) => {
    let categoryLocations = savedLocations.filter(location => location.categories.includes(title.toLowerCase()))
    navigation.navigate("LocationsSelectionScreen", {city, title, categoryLocations, region, currDay, numOfDays})
  };

  const buttonPressed = () => {
    if (currDay == numOfDays) {
      navigation.navigate("TripOverviewScreen", {numOfDays, region, tripLocations, totalTripLocations, path, city})
    } else {
      if (currDay + 1 == numOfDays) {
        setButtonTitle("Done")
      }

      setDay(currDay + 1);
    }
  };

  const Item = ({title, icon}: ItemProps) => (
    <Button
      title= {title}
      radius={5}
      iconPosition="left"
      type="outline"
      color="#000"
      containerStyle={styles.itemContainer}
      buttonStyle={styles.frameButtonBtn2}
      onPress={() => ChooseLocations(title)}
    >
      <View style={styles.itemRow}>
        <Text style= {styles.listButton}>{title}</Text>
        <MaterialCommunityIcons style= {{left: "30%"}}
          name={icon}
          color={Colors.LightBlack}
          size={30}
        />
      </View>
    </Button>
  );

  return (
    <View style={styles.iphone1313Pro13}>
      <View style={styles.frame}>
        <View style={styles.frame1}>
          <Button
            radius={5}
            iconPosition="left"
            type="clear"
            color={Colors.Whitesmoke}
            onPress={() => navigation.goBack()}
            containerStyle={styles.arrowLeft1IconBtn}
          ><MaterialCommunityIcons
          name="chevron-left"
          color={Colors.LightBlack}
          size={30}
        /></Button>
          <Text style={styles.day1}>Day {currDay}</Text>
        </View>
      </View>
      <View style={styles.frame2}>
      <MapView
          style={styles.image27Icon}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          region={region}
        >
          {totalTripLocations.length > 0 &&
            totalTripLocations.map((pinnedLocation) => (
              <Marker
                coordinate={{
                  latitude: pinnedLocation.contentData.locationDTO.longitude,
                  longitude: pinnedLocation.contentData.locationDTO.latitude,
                }}
                title={pinnedLocation.contentData.descriptionDTO}
              />
            ))}
          {totalPath.length > 0 &&
            <Polyline
              coordinates={totalPath}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          }
        </MapView>
      </View>
      <View style={styles.frame3}>
          <FlatList
            style={styles.frameChild}
            data={frameFlatListData}
            renderItem={({item}) => <Item title={item.title} icon={item.icon}/>}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.frameFlatListContent}
          />
      </View>
      <Button
        title={buttonTitle}
        radius={5}
        iconPosition="left"
        type="solid"
        color="#000"
        titleStyle={styles.doneButtonTitle}
        containerStyle={styles.frameButtonBtn1}
        buttonStyle={styles.doneButton}
        onPress={() => buttonPressed()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  itemRow: {
    flexDirection: "row",
  },
  itemContainer: {
    top: "2%",
    width: "94%",
    height: 70,
    marginLeft: "3%",
    paddingBottom: "4%",
  },
  arrowLeft1IconBtn: {
    position: "relative",
    color: Colors.Whitesmoke
  },
  arrowLeft1IconBtn1: {
    width: 32,
    height: 32,
    overflow: "hidden",
  },
  frameFlatListContent: {
    flexDirection: "column",
    textAlign: "left",
    alignContent: "stretch",
  },
  frameButtonBtn: {
    color: Colors.LightBlack,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "left"
  },
  listButton: {
    color: Colors.LightBlack,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
    width: "88%"
  },
  frameButtonBtn1: {
    top: "89.5%",
    position: "absolute",
    width: "90%",
    height: "10%",
    marginLeft: "5%",
  },
  frameButtonBtn2: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    borderColor: Colors.LightBlack,
    borderWidth: 0,
    backgroundColor: "#fff",
    textAlign: "left",
    justifyContent: "flex-start"
  },
  frameLayout: {
    height: 36,
    position: "absolute",
    overflow: "hidden",
  },
  day1: {
    marginLeft: "42%",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.LightBlack,
    textAlign: "left",
    top: "1%",
    position: "absolute",
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
  },
  image27Icon: {
    borderRadius: 4,
    height: "100%",
    width: "98%",
    marginLeft: "1%"
  },
  frameChild: {
    width: "100%",
    height: "100%",
    textAlign: "left"
  },
  frame2: {
    top: "10%",
    height: "28%",
    width: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  frame3: {
    top: "39%",
    height: "50%",
    width: "100%",
    position: "absolute",
    overflow: "hidden",
  },
  iphone1313Pro13: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    flex: 1,
    backgroundColor: Colors.Whitesmoke,
  },
});
