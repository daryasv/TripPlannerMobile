import * as React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import WheelPicker from 'react-native-wheely';
import { useState } from "react";
import { Colors } from "../../theme/Colors";

export default function ChooseDaysScreen({route}) {

  const city = route.params?.selectedValue;
  const key = route.params?.key;
  const currDay = 1;
  const [selectedIndex, setSelectedIndex] = useState(1);
  const navigation = useNavigation();

  const buttonPressed = () => {
    let numOfDays = selectedIndex + 1;

    if (key == 1) {
      navigation.navigate("PlanDaysScreen", {city, numOfDays, currDay})
    } else {
      navigation.navigate("ChooseCategoriesScreen", {city, numOfDays, currDay})
    }   
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
          ><MaterialCommunityIcons
          name="chevron-left"
          color={Colors.LightBlack}
          size={30}
        /></Button>
          <Text style={styles.planATrip}>Plan a trip</Text>
        </View>
      </View>
      <View style={styles.whereAreYouTravelingParent}>
        <Text style={styles.planATripTypo}>How many days is your trip?</Text>
        <View style={{ alignItems: 'center', margin: "10%", width: "100%"}}>
          <WheelPicker itemTextStyle= {{color: Colors.LightBlack, fontSize: 24 }} containerStyle={styles.container} selectedIndicatorStyle= {styles.selectedIndicator} visibleRest={1} itemHeight={60} itemStyle={{ }}
            selectedIndex={selectedIndex}
            options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
            onChange={(index) => setSelectedIndex(index)}
          />
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
};

const styles = StyleSheet.create({
  frameButtonBtn1: {
    top: "90%",
    position: "absolute",
    width: "90%",
    height: "10%",
    marginLeft: "6%"
  },
  container: {
    width: "100%"
  },
  selectedIndicator: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'lightgray',
    borderRadius: 5,
    top: '50%',
  },
  scrollView: {
    overflow: 'hidden',
    flex: 1,
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  pickerContainer: {
    backgroundColor: 'lightgray',
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
    color: Colors.Whitesmoke
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
    height: "100%"
  },
  planATrip: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.LightBlack,
    textAlign: "left",
    marginLeft: 81,
    marginTop: "2%"
  },
  frame: {
    width: "100%",
    height: "10%",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: "15%"
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
});
