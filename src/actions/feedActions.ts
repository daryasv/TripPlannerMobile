import axios from "axios";
import { getToken } from "./security";
import { BASE_URL } from "./actionsConfig";
import { PostType } from "../types/postTypes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const POSTS_URL = BASE_URL + "/posts";

export function getExploreFeed(
  params: { page?: number; cities?: string },
  callback: (data?: { allPosts: PostType[] }) => void
) {
  axios
    .get(POSTS_URL + "/explore", {
      params: params,
      headers: { Authorization: getToken() },
    })
    .then((res) => {
      callback(res.data);
    })
    .catch((e) => {
      callback(null);
    });
}

export interface SaveLocationData {
  description: string;
  locationLong: string;
  locationLat: string;
  postGen: string;
  cities: string;
}

export const saveLocation = (
  data: SaveLocationData,
  image: ImagePickerAsset
) => {
  return FileSystem.uploadAsync(POSTS_URL + "/createLocation", image.uri, {
    fieldName: "imageFile",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    headers: { Authorization: getToken() },
    parameters: {
      description: data.description,
      "location.longitude": data.locationLong,
      "location.latitude": data.locationLat,
      cities: data.cities,
      postGenre: data.postGen,
      user_id: "D@gmail.com",
    },
  });
};

export interface NewPinnedLocationProps {
  "location.longitude": string;
  "location.latitude": string;
  description: string;
}

export const uploadNewPinnedLocation = (
  image: ImagePickerAsset,
  data: NewPinnedLocationProps,
  callback: (id: string) => void
) => {
  return FileSystem.uploadAsync(POSTS_URL + "/addPinnedLocation", image.uri, {
    fieldName: "imageFile",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    headers: { Authorization: getToken() },
    parameters: {
      description: data.description,
      "location.longitude": data["location.longitude"],
      "location.latitude": data["location.latitude"],
    },
  })
    .then((res) => {
      console.log(JSON.parse(res.body)?._id);
      callback(JSON.parse(res.body)?._id);
    })
    .catch(() => {
      callback(null);
      console.log("error");
    });
};

export interface CreateRouteData {
  description: string;
  user_id: string;
  totalDistance: number;
  totalDuration: number;
  pinnedLocations: string[];
  locations: Location[];
  cities: string
}

export interface Location {
  latitude: number;
  longitude: number;
}

export const createRoute = (data: CreateRouteData) => {
  return axios.post(POSTS_URL + "/createRouteRec", data, {
    headers: { Authorization: getToken() },
  });
};
