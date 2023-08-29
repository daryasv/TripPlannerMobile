import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { Avatar, Button, Icon } from "@rneui/themed";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Colors } from "../../theme/Colors";
import { useNavigation } from "@react-navigation/native";
import {
  Region,
  SuggestedRoute,
  getSuggestedRoutes,
} from "../../actions/tripActions";
import ReadMore from "@fawazahmed/react-native-read-more";
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from "react-native-maps";

const showItem = ({ item }: { item: SuggestedRoute }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={{ flexDirection: "row", alignContent: "center" }}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Avatar
            source={{
              uri: item?.UploadByProfilePictureUrl,
            }}
            rounded
            size={40}
          />
          <View style={{ marginLeft: 10 }}>
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
                <Text style={styles.location}>{item.cities.join(",")}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <MapView
        style={{ height: 300, width: "100%", borderRadius: 8, marginTop: 10 }}
        provider={PROVIDER_GOOGLE}
        showsCompass={true}
        toolbarEnabled={false}
        zoomEnabled={true}
        scrollEnabled={false}
        region={calculatedRegion(item)}
      >
        {item.pinnedLocations?.day1?.length > 0 &&
          item.pinnedLocations?.day1.map((pinnedLocation) => (
            <Marker
              coordinate={{
                latitude: pinnedLocation?.contentData?.locationDTO.latitude,
                longitude: pinnedLocation?.contentData?.locationDTO?.longitude,
              }}
              title={pinnedLocation?.contentData?.descriptionDTO}
            />
          ))}
        {
          <Polyline
            coordinates={item.locations?.day1 || []}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        }
      </MapView>

      {item.description ? (
        <ReadMore
          numberOfLines={3}
          style={styles.description}
          wrapperStyle={{ marginTop: 10 }}
          seeMoreStyle={{ color: Colors.main }}
          seeLessStyle={{ color: Colors.main }}
          seeMoreText={"Read More"}
        >
          {item.description}
        </ReadMore>
      ) : null}

      <View style={[styles.row, { marginTop: 10 }]}>
        <Text style={styles.location}>
          {item.totalDuration || 0} hours | {item.totalDistance || 0} Km |
        </Text>
      </View>
    </View>
  );
};

const calculatedRegion = (data: SuggestedRoute): Region => {
  if (!data.locations?.day1?.length) return null;
  const minLatitude = Math.min(
    ...data.locations?.day1?.map((coord) => coord.latitude)
  );
  const maxLatitude = Math.max(
    ...data.locations?.day1?.map((coord) => coord.latitude)
  );
  const minLongitude = Math.min(
    ...data.locations?.day1.map((coord) => coord.longitude)
  );
  const maxLongitude = Math.max(
    ...data.locations?.day1.map((coord) => coord.longitude)
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

export default function RecommendedPlansScreen({ route }) {
  const navigation = useNavigation();
  const [suggestions, setSuggestions] = React.useState([] as SuggestedRoute[]);

  React.useEffect(() => {
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
        if (data) {
          setSuggestions(data);
        }
      }
    );
  }, []);

  const buttonPressed = () => {};

  return (
    <View style={styles.iphone1313Pro7}>
      <View style={styles.frame}>
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
              size={30}
            />
          </Button>
          <Text style={styles.planATrip}>Plan a trip</Text>
        </View>
      </View>
      <FlatList
        data={suggestions}
        renderItem={({ item }) => showItem({ item })}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title="Next"
        radius={5}
        type="solid"
        color="#000"
        titleStyle={styles.frameButtonBtn}
        onPress={() => buttonPressed()}
        containerStyle={styles.frameButtonBtn1}
        buttonStyle={styles.frameButtonBtn2}
      />
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
    textAlign: "left",
    color: Colors.LightBlack,
    fontSize: 24,
    fontWeight: "700",
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
    marginTop: "10%",
    alignItems: "center",
    width: "100%",
    height: "100%",
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
