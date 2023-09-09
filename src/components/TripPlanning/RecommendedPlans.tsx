import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import {
  Region,
  RouteDTO,
  getSuggestedRoutes,
} from "../../actions/tripActions";
import ReadMore from "@fawazahmed/react-native-read-more";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";
import { PostType } from "../../types/postTypes";
import { useEffect, useState } from "react";



export default function RecommendedPlansScreen({ route }) {
  const numOfDays = route.params.numOfDays;
  const city = route.params.city;
  
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [suggestions, setSuggestions] = React.useState([] as PostType[]);

  const showItem = ({ item }: { item: PostType }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Avatar
            source={{
              uri: item.UploadByProfilePictureUrl,
            }}
              avatarStyle={{borderWidth: 0}}
              rounded
              size={45}
            />
            <View style={{ marginLeft: 10,
                        width: "70%",
                        justifyContent: "space-evenly", }}>
              {item?.uploadedBy ? (
                <Text style={styles.username}>
                  {item?.uploadedBy?.includes("@")
                    ? item.uploadedBy.substring(0, item.uploadedBy.indexOf("@"))
                    : item.uploadedBy}
                </Text>
              ) : null}
              {item?.cities?.length ? (
                <View style={styles.row}>
                  <Icon name="location-on" size={14} type={"material"} />
                  <Text style={styles.location}>{city}</Text>
                </View>
               ) : null}
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
  // const tripLocations = route.params.tripLocations;
  // const totalTripLocations = route.params.totalTripLocations;
  // const path = route.params.path;
                let totalTripLocations = findTotalLocations(item.contentData.pinnedLocationsDTO)
                let tripLocations = item.contentData.pinnedLocationsDTO
                let path = item.contentData.locationsDTO
                let region = calculatedRegion(item.contentData)
                navigation.navigate("RouteDetails", {item})
              }}
            >
              <MaterialCommunityIcons
                name="map-search-outline"
                style={{color: "black",
                fontSize: 30,}}
              />
            </Button>
          </View>
        </View>
  
        <MapView
          style={{ height: 300, width: "100%", borderRadius: 8, marginTop: 10 }}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          scrollEnabled={false}
          region={calculatedRegion(item.contentData)}
        >
          {item.contentData.pinnedLocationsDTO[1].length > 0 &&
            item.contentData.pinnedLocationsDTO[1].map((pinnedLocation) => (
              <Marker
                coordinate={{
                  latitude: pinnedLocation?.contentData?.locationDTO.longitude,
                  longitude: pinnedLocation?.contentData?.locationDTO?.latitude,
                }}
                title={pinnedLocation?.contentData?.descriptionDTO}
              />
            ))}
          {
            <Polyline
              coordinates={item.contentData.locationsDTO[1] || []}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          }
        </MapView>
  
        {item.contentData.descriptionDTO ? (
          <ReadMore
            numberOfLines={3}
            style={styles.description}
            wrapperStyle={{ marginTop: 10 }}
            seeMoreStyle={{ color: Colors.main }}
            seeLessStyle={{ color: Colors.main }}
            seeMoreText={"Read More"}
          >
            {item.contentData.descriptionDTO}
          </ReadMore>
        ) : null}
  
        <View style={[styles.row, { marginTop: 10 }]}>
          <Text style={styles.location}>
            {item.contentData.totalDurationDTO || 0} hours | {item.contentData.totalDistanceDTO || 0} Km
          </Text>
        </View>
      </View>
    );
  };
  
  const calculatedRegion = (data: RouteDTO): Region => {
    if (!data.locationsDTO[1].length) return null;
    const minLatitude = Math.min(
      ...data.locationsDTO[1].map((coord) => coord.longitude)
    );
    const maxLatitude = Math.max(
      ...data.locationsDTO[1].map((coord) => coord.longitude)
    );
    const minLongitude = Math.min(
      ...data.locationsDTO[1].map((coord) => coord.latitude)
    );
    const maxLongitude = Math.max(
      ...data.locationsDTO[1].map((coord) => coord.latitude)
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

  const findTotalLocations = (pinnedLocations) => {
    let returnValue = [];

    for (let index = 1; index <= Object.keys(pinnedLocations).length; index++) {
      const dayLocations = pinnedLocations[index];

      for (let index = 0; index < dayLocations.length; index++) {
        const element = dayLocations[index];
        returnValue.push(element)
      }
    }

    return (returnValue)
  };

  useEffect(() => {
    const numOfDays = route.params?.numOfDays;
    const categories = route.params?.categories;
    const city = route.params?.city;
    getSuggestedRoutes(
      {
        numOfDays: numOfDays,
        category: categories,
        city: city,
      },
      (data) => {
        setIsLoading(false);
        if (data) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  return (
    <View style={styles.iphone1313Pro7}>
      {isLoading ? (
      <View style={{flex: 1, alignItems: "center", justifyContent: "center",}}>
      <ActivityIndicator size="small" color="#000" />
      </View>
    ) : (
      <><View style={styles.frame}>
            <View style={styles.frame1}>
              <Button
                radius={5}
                iconPosition="left"
                type="clear"
                color={Colors.Whitesmoke}
                onPress={() => navigation.goBack()}
                containerStyle={styles.arrowLeft1IconBtn}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  color={Colors.LightBlack}
                  size={30} />
              </Button>
              <Text style={styles.planATrip}>Plan a trip</Text>
            </View>
          </View>
          {suggestions.length == 0 &&
            <View style={styles.whereAreYouTravelingParent}>
              <MaterialCommunityIcons
              name= "emoticon-confused-outline"
              size={45}
            />
              <Text style={styles.planATripTypo}>No suggestions Found</Text>
              <Text style={styles.submessage}>Try planning your own trip!</Text>
            </View>
          }
          <FlatList
              data={suggestions}
              renderItem={({ item }) => showItem({ item })}
              keyExtractor={(item, index) => index.toString()} /></>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frameButtonBtn1: {
   height:"auto"
  },
  container: {
    width: "100%",
  },
  selectedIndicator: {
    position: "absolute",
    width: "100%",
    backgroundColor: "lightgray",
    borderRadius: 5,
    top: "50%",
  },
  scrollView: {
    overflow: "hidden",
    flex: 1,
  },
  option: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    zIndex: 100,
  },
  pickerContainer: {
    backgroundColor: "lightgray",
    width: "100%",
    height: 150,
  },
  frameButtonBtn: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  frameButtonBtn2: {
    borderRadius: 8,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowLeft1IconBtn: {
    position: "relative",
    color: Colors.Whitesmoke,
  },
  arrowLeft1IconBtn1: {
    width: 32,
    height: 32,
    overflow: "hidden",
  },
  frameLayout: {
    height: 36,
    left: 12,
    overflow: "hidden",
  },
  frame1Position: {
    top: 0,
    position: "absolute",
  },
  planATripTypo: {
    marginTop: 10,
    textAlign: "left",
    color: Colors.LightBlack,
    fontSize: 24,
    fontWeight: "500",
  },
  submessage: {
    marginTop: 10,
    textAlign: "left",
    color: Colors.LightBlack,
    fontSize: 16,
    fontWeight: "300",
  },
  frameChild: {
    borderRadius: 5,
    backgroundColor: "#FFF",
    borderStyle: "solid",
    borderColor: "#ddd",
    borderWidth: 1,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    paddingLeft: 24,
    paddingTop: 10,
    paddingRight: 24,
    paddingBottom: 10,
    fontSize: 12,
    marginTop: 12,
    fontWeight: "700",
    alignItems: "center",
  },
  whereAreYouTravelingParent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  planATrip: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.LightBlack,
    textAlign: "left",
    marginLeft: 81,
    marginTop: "2%",
  },
  frame: {
    width: "100%",
    height: "10%",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
  },
  frame1: {
    width: "100%",
    flexDirection: "row",
  },
  iphone1313Pro7: {
    backgroundColor: Colors.Whitesmoke,
    flex: 1,
    width: "100%",
    paddingHorizontal: "1%",
    paddingVertical: "5%",
    overflow: "hidden",
  },
  itemContainer: {
    margin: 10,
    padding: 10,
    height: "auto",
    backgroundColor: "white",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "black",
    fontWeight: "bold",
  },
  location: {
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 5,
  },
  description: {
    fontWeight: "600",
    flex: 1,
  },
  pinnedLocations: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});
