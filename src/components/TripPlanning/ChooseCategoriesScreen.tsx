import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Colors } from "../../theme/Colors";

export default function ChooseCategoriesScreen({ route }) {
  const city = route.params?.selectedValue;
  const key = route.params?.key;
  const numOfDays = route.params?.numOfDays;

  const navigation = useNavigation();

  const allCategories = [
    {
      label: "Coffee",
      icon: <Feather name="coffee" size={30} />,
      name: "coffee",
    },
    {
      label: "Restaurant",
      icon: <MaterialIcons name="restaurant" size={30} />,
      name: "restaurant",
    },
    {
      label: "Bars",
      icon: <MaterialIcons name="local-bar" size={30} />,
      name: "Bars",
    },
    {
      label: "Shopping",
      icon: <MaterialIcons name="shopping-bag" size={30} />,
      name: "shopping",
    },
    {
      label: "Sport",
      icon: <MaterialIcons name="sports-basketball" size={30} />,
      name: "sport",
    },
    {
      label: "Museums",
      icon: <MaterialIcons name="museum" size={30} />,
      name: "museums",
    },
    {
      label: "Tourist Sites",
      icon: <MaterialIcons name="location-city" size={30} />,
      name: "tourist_sites",
    },
    {
      label: "Other",
      icon: <Feather name="plus" size={30} />,
      name: "other",
    },
  ];

  const [categories, setCategories] = React.useState([]);

  const selectCategory = (categoryName: string) => {
    const newCategories = Array.from(categories); //Duplicate the array for state to notice changes and rerender
    if (newCategories.includes(categoryName)) {
      const index = newCategories.indexOf(categoryName);
      newCategories.splice(index);
    } else {
      newCategories.push(categoryName);
    }
    setCategories(newCategories);
  };

  const buttonPressed = () => {
    navigation.navigate("differentScreen", { city, numOfDays, currDay });
  };

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
      <View style={styles.whereAreYouTravelingParent}>
        <Text style={styles.planATripTypo}>What would you like to do?</Text>
        <View
          style={{
            justifyContent: "flex-start",
            flexWrap: "wrap",
            maxWidth: (maxItemWidth + itemMargin) * 3,
            gap: itemMargin,
            flexDirection: "row",
            alignSelf: "center",
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          {allCategories.map((category, index) => {
            const selected = categories.includes(category.name);

            return (
              <TouchableOpacity
                style={selected ? styles.selectedCube : styles.cube}
                key={index}
                onPress={() => selectCategory(category.name)}
              >
                <Text style={{ color: selected ? "white" : "black" }}>
                  {category.icon}
                </Text>

                <Text
                  style={selected ? styles.selectedCubeText : styles.cubeText}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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

const width = Dimensions.get("screen").width;
const itemWidth = (width - 20) / 3;
const itemMargin = 10;
const maxItemWidth = 100;

const styles = StyleSheet.create({
  frameButtonBtn1: {
    top: "90%",
    position: "absolute",
    width: "90%",
    height: "10%",
    marginLeft: "6%",
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
    height: "100%",
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
    marginBottom: "15%",
  },
  frame1: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    overflow: "hidden",
  },
  iphone1313Pro7: {
    backgroundColor: Colors.Whitesmoke,
    flex: 1,
    width: "100%",
    paddingHorizontal: "1%",
    paddingVertical: "5%",
    overflow: "hidden",
  },
  cube: {
    backgroundColor: "white",
    width: itemWidth,
    maxWidth: maxItemWidth,
    maxHeight: maxItemWidth,
    aspectRatio: 1,
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  selectedCube: {
    backgroundColor: "black",
    width: itemWidth,
    maxWidth: maxItemWidth,
    maxHeight: maxItemWidth,
    aspectRatio: 1,
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
  },
  cubeText: {
    marginTop: 5,
    fontWeight: "600",
    color: "black",
  },
  selectedCubeText: {
    marginTop: 5,
    fontWeight: "600",
    color: "white",
  },
});
