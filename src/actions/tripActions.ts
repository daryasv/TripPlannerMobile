import Axios from "axios";
import { BASE_URL, MAPS_KEY_IOS } from "./actionsConfig";
import { getToken, getUserEmail, getUserId } from "./security";
import { LocationDay, PinnedLocationsDto, PostType } from "../types/postTypes";

let newRouteId = "";

export function getRouteId() {
  return newRouteId;
}

export function setRouteId(newId) {
  newRouteId = newId;
}

export interface UserLocation {
  contentData: {
    location: {
      longitude: number;
      latitude: number;
    };
    _id: string;
    imageFileNameDTO: string;
    description: string;
    __v: number;
  };
  postGenre: number;
  dateUploaded: string;
  uploadedBy: string;
  cities: Array<string>;
  categories: Array<string>;
  comments: Array<string>;
  views: number;
  dataID: string;
}

export interface User {
  _id: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  password: string;
  profilePictureId: string;
  userPicturesIds: string[];
  savedPicturesIds: string[];
  savedRoutes: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AuthData {
  auth_token: string;
}

export interface CountryData {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
}

export interface CountriesData {
  error: boolean;
  msg: string;
  data: CountryData[];
}

export interface CityData {
  error: boolean;
  msg: string;
  data: String[];
}

export interface updateRouteData {
  routeId: string;
  day: string;
  newPinnedLocationId: string;
}

export interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface StartPlanRouteResp {
  description: string;
  totalDistance: number;
  totalDuration: number;
  completed: boolean;
  _id: string;
  __v: number;
}

export interface AddToRouteResp {
  updatedRoute: UpdatedRoute;
}

export interface DayPath {
  longitude: 38.69176782905242;
  latitude: -9.215870030539243;
}

export interface TotalPath {
  day1: DayPath[];
}

export interface TotalPinnedLocations {
  day1: string[];
}

export interface saveRoutePlan {
  routeId: string;
  description: string;
  cities: string;
}

export interface UpdatedRoute {
  _id: string;
  description: string;
  totalDistance: number;
  totalDuration: number;
  completed: boolean;
  __v: number;
  locations: { [day: string]: DayPath[] };
  pinnedLocations: { [day: string]: string[] };
}

export const GetCities = (
  country,
  callback: (success: CityData | false) => void
) => {
  Axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
    country: country,
  })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const GetCountries = (
  callback: (success: CountriesData | false) => void
) => {
  Axios.get("https://countriesnow.space/api/v0.1/countries/flag/images")
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const GetSavedLocations = (
  city,
  callback: (success: PostType[] | false) => void
) => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0OTlhNTQzZWY2YWU2YWQ5MjUyNDYiLCJlbWFpbCI6Im9maXJAZ21haWwuY29tIiwiaWF0IjoxNjkzMDU4MzkzfQ.A68j4XPrFo7mRdtckwbCCo_8wLFjpy_kxPx_kD5UkkM",
  };
  const params = {
    city: city,
  };
  Axios.get(BASE_URL + "/posts/getSaveLocation", { params, headers })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const StartPlanRoute = (
  callback: (success: StartPlanRouteResp | false) => void
) => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0OTlhNTQzZWY2YWU2YWQ5MjUyNDYiLCJlbWFpbCI6Im9maXJAZ21haWwuY29tIiwiaWF0IjoxNjkzMDU4MzkzfQ.A68j4XPrFo7mRdtckwbCCo_8wLFjpy_kxPx_kD5UkkM",
  };
  Axios.post(BASE_URL + "/routes/startRoutePlan", null, { headers })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      setRouteId(res.data._id);
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const AddLocationToRoute = (
  data: updateRouteData,
  callback: (success: RouteDTO | false) => void
) => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0OTlhNTQzZWY2YWU2YWQ5MjUyNDYiLCJlbWFpbCI6Im9maXJAZ21haWwuY29tIiwiaWF0IjoxNjkzMDU4MzkzfQ.A68j4XPrFo7mRdtckwbCCo_8wLFjpy_kxPx_kD5UkkM",
  };
  Axios.post(BASE_URL + "/routes/addLocationToPlanedRoute", data, { headers })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const saveRoute = (
  data: saveRoutePlan,
  callback: (success: PostType[] | false) => void
) => {
  const headers = {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0OTlhNTQzZWY2YWU2YWQ5MjUyNDYiLCJlbWFpbCI6Im9maXJAZ21haWwuY29tIiwiaWF0IjoxNjkzMDU4MzkzfQ.A68j4XPrFo7mRdtckwbCCo_8wLFjpy_kxPx_kD5UkkM",
  };
  Axios.post(BASE_URL + "/routes/savePlanedRoute", data, { headers })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export const getRegion = (
  city,
  callback: (success: Region | false) => void
) => {
  Axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      city +
      "&key=" +
      MAPS_KEY_IOS
  )
    .then((res) => {
      console.log("success", JSON.stringify(res));
      const data = res.data;
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        callback({
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export interface SuggestedRoutesParams {
  numOfDays: number | string;
  category: string[];
  city: string;
}

// export interface SuggestedRoute {
//   cities: any;
//   uploadedBy: any;
//   UploadByProfilePictureUrl: string;
//   _id: string;
//   description: string;
//   totalDistance: number;
//   totalDuration: number;
//   completed: boolean;
//   __v: number;
//   locations: Locations;
//   pinnedLocations: PinnedLocationsDto;
//   pinnedLocationcategories: PinnedLocationcategories;
// }

export interface RouteDTO {
  descriptionDTO: string;
  totalDistanceDTO: number;
  totalDurationDTO: number;
  locationsDTO: { [day: string]: GeolocationCoordinates[] };
  pinnedLocationsDTO: { [day: string]: PostType[] };
}

export interface PinnedLocationcategories {
  [day: string]: string;
}

export const getSuggestedRoutes = (
  data: SuggestedRoutesParams,
  callback: (data?: RouteDTO[]) => void
) => {
  const headers = {
    Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU0OTlhNTQzZWY2YWU2YWQ5MjUyNDYiLCJlbWFpbCI6Im9maXJAZ21haWwuY29tIiwiaWF0IjoxNjkzMDU4MzkzfQ.A68j4XPrFo7mRdtckwbCCo_8wLFjpy_kxPx_kD5UkkM",
  };

  let url = BASE_URL + "/routes/suggestedRoutes?";
  if (data.category) {
    data.category.forEach((c) => {
      url += "&category=" + c;
    });
  }
  if (data.numOfDays) {
    url += "&numOfDays=" + data.numOfDays;
  }
  if (data.city) {
    url += "&city=" + data.city;
  }

  url = url.replace("?&", "?");

  Axios.get(url, { headers })
    .then((res) => {
      console.log("success", JSON.stringify(res));
      callback(res.data?.suggestedRoutesDTOS);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(null);
    });
};
