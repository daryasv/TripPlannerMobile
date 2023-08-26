import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function CategoriesSelect() {
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
  const [categories, setCategories] = useState([]);

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

  return (
    <View style={{ width: "100%" }}>
      <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 17 }}>
        What would you like to do?
      </Text>
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
  );
}

const width = Dimensions.get("screen").width;
const itemWidth = (width - 20) / 3;
const itemMargin = 10;
const maxItemWidth = 100;

const styles = StyleSheet.create({
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
