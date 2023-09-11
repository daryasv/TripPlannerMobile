import axios from "axios";
import { MAPS_KEY_IOS } from "../../actions/actionsConfig";

interface Address {
  city: string;
  state: string;
  country: string;
  zipcode: string;
  name: string;
}

export async function getLocationData(lat, lng) {
  var address: Address;
  try {
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?language=en&latlng=${lat},${lng}&key=AIzaSyAPwXe02EgSv0WmEHso2AjvE4VUhB-TOeU`;
    const response = await fetch(url)
      .then((response) => response.json())
      .then((responseJson) => responseJson);
    const result = response?.results[0];
    if (result) {
      var city = "";
      var state = "";
      var country = "";
      var zipcode = "";

      var address_components = result.address_components;

      for (var i = 0; i < address_components.length; i++) {
        if (
          address_components[i].types[0] === "administrative_area_level_1" &&
          address_components[i].types[1] === "political"
        ) {
          state = address_components[i].long_name;
        }
        if (
          address_components[i].types[0] === "locality" &&
          address_components[i].types[1] === "political"
        ) {
          city = address_components[i].long_name;
        }

        if (address_components[i].types[0] === "postal_code" && zipcode == "") {
          zipcode = address_components[i].long_name;
        }

        if (address_components[i].types[0] === "country") {
          country = address_components[i].long_name;
        }
      }
      address = {
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        name: result.formatted_address,
      };
    }
  } catch (e) {
    console.log("err", JSON.stringify(e));
  }

  return address;
}
