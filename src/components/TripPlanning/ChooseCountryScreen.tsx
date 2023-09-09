import * as React from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useState, useMemo, useEffect } from 'react'
import { GetCountries } from "../../actions/tripActions";
import AutocompleteInput from 'react-native-autocomplete-input';
import { Colors } from "../../theme/Colors";

export default function ChooseCountryScreen({route}) {
const key = route.params?.key

const [query, setQuery] = useState('');
const [selectedValue, setSelectedValue] = useState("");
const [options, setOptions] = useState([]);
const [fullOptions, setFullOptions] = useState([]);
const [isNextDisabled, setNextDisabled] = useState(true);

const handleInputChange = (text) => {
  setQuery(text);
  if(text == "") {
    setOptions([])
  }
  else if (fullOptions) {
    setOptions(fullOptions.filter(option =>
      option.toLowerCase().includes(text.toLowerCase())))
  }
};

const handleSelectItem = (item) => {
  setSelectedValue(item);
  setQuery(item);
  setOptions([]);

  if (item != "") {
    setNextDisabled(false);
  }
};

  const navigation = useNavigation();

  useEffect(() => {
    GetCountries((success) => {
      if (success) {
        setFullOptions(success.data.map(item => item.name));
      }
    });
  }, []);

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
        <Text style={styles.planATripTypo}>Where are you traveling?</Text>
        <AutocompleteInput
        data={options}
        defaultValue={query}
        onChangeText={handleInputChange}
        style={styles.frameChild}
        inputContainerStyle={styles.frameChild1}
        placeholder="Search"
        placeholderTextColor="#ababab"
        containerStyle={{borderWidth: 0,}}
        flatListProps={{
          style: styles.optionsContainer,
          contentContainerStyle: styles.flatListContentContainer,
          contentInsetAdjustmentBehavior: "automatic",
          keyboardShouldPersistTaps: 'always',
            renderItem: ( ({item}) => (
              <TouchableOpacity style={{height: 30, paddingTop: 8, paddingLeft: 8}}
                onPress={() => handleSelectItem(item)}>
                <Text style={{fontSize:16}}> 
                    {item}
                </Text>
              </TouchableOpacity>
            ))
        }}
      />
      </View>
        <Button
          disabled = {isNextDisabled}
          title="Next"
          radius={5}
          type="solid"
          color="#000"
          titleStyle={styles.frameButtonBtn}
          onPress={() => navigation.navigate("ChooseCityScreen", {selectedValue, key})}
          containerStyle={styles.frameButtonBtn1}
          buttonStyle={styles.frameButtonBtn2}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  frameButtonBtn2: {
    borderRadius: 8,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContentContainer: {
    paddingBottom: 10, // Adjust as needed for space at the bottom
  },
  optionsContainer: {
    top: 15,
    maxHeight: 300, // Adjust the height as needed
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  frameButtonBtn: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  frameButtonBtn1: {
    top: "90%",
    position: "absolute",
    width: "90%",
    height: "10%",
    marginLeft: "6%"
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
    borderColor: "#ddd",
    borderWidth: 2,
    width: "98%",
    height: "100%",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    marginTop: 12,
    marginRight: "4%",
    fontSize: 16,
    fontWeight: "700",
    alignItems: "center",
  },
  frameChild1: {
    borderRadius: 5,
    backgroundColor: Colors.Whitesmoke,
    borderWidth: 0,
    width: "100%",
    height: "35%",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  whereAreYouTravelingParent: {
    top: "10%",
    alignItems: "center",
    left: 12,
    position: "absolute",
    width: "100%",
    height: "70%",
    borderWidth: 0,
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
