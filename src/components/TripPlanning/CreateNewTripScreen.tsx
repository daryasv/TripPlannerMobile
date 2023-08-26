import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../theme/Colors";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const styles = StyleSheet.create({
    arrow: {
      position: "relative",
    },
    arrowLeft1IconBtn1: {
      width: 32,
      height: 32,
      overflow: "hidden",
    },
    planYourOwnTrip: {
      color: "#000",
      fontSize: 24,
      fontWeight: "700",
    },
    yourOwnTripContainer: {
      padding: 10,
      width: "100%",
      height: "45%",
    },
    yourOwnTripButton: {
      borderWidth: 1,
      borderColor: Colors.LightBlack,
      color: Colors.Whitesmoke,
      borderRadius: 8,
      width: "100%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.Whitesmoke,
    },
    recommendedRoutes: {
      padding: 10,
      color: "#000",
      fontSize: 24,
      fontWeight: "700",
    },
    recommendedRoutesContainer: {
      padding: 10,
      width: "100%",
      height: "45%",
    },
    recommendedRoutesButton: {
      borderWidth: 1,
      backgroundColor: Colors.Whitesmoke,
      borderColor: Colors.LightBlack,
      borderRadius: 8,
      borderStyle: "solid",
      width: "100%",
      height: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    planATrip: {
      fontSize: 24,
      fontWeight: "700",
      color: Colors.LightBlack,
      textAlign: "left",
      marginLeft: "23%",
      marginTop: "2%"
    },
    top: {
        width: "100%",
        height: "10%",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: "15%"
      },
    topRow: {
      width: "100%",
      height: "100%",
      flexDirection: "row",
      overflow: "hidden",
    },
    frameChild: {
      marginTop: "1%",
    },
    mainFrame: {
      marginTop: "%",
    },
    screen: {
      backgroundColor: Colors.Whitesmoke,
      flex: 1,
      width: "100%",
      paddingHorizontal: "1%",
      paddingVertical: "5%",
      overflow: "hidden",
    },
  });

  export default function CreateNewTripScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <View style={styles.topRow}>
          <Button
            radius={5}
            iconPosition="left"
            type="solid"
            color={Colors.Whitesmoke}
            onPress={() => navigation.goBack()}
            containerStyle={styles.arrow}
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
      <View style={styles.mainFrame}>
        <Button
          title="Plan your own trip"
          radius={5}
          iconPosition="left"
          titleStyle={styles.planYourOwnTrip}
          // onPress={() => navigation.navigate("ChooseCountryScreen")}
          containerStyle={styles.yourOwnTripContainer}
          buttonStyle={styles.yourOwnTripButton}
        />
        <Button
          style={styles.frameChild}
          title="Recommended routes"
          radius={5}
          iconPosition="left"
          loading={false}
          titleStyle={styles.recommendedRoutes}
          containerStyle={styles.recommendedRoutesContainer}
          buttonStyle={styles.recommendedRoutesButton}
        />
      </View>
    </View>
  );
};
