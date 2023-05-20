import axios from "axios";
import { getToken } from "./security";
import { BASE_URL } from "./actionsConfig";
import { PostType } from "../types/postTypes";
import { ImagePickerAsset } from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const POSTS_URL = BASE_URL + "/posts";

export function getExploreFeed(
  callback: (data?: { allPosts: PostType[] }) => void
) {
  axios
    .get(POSTS_URL + "/explore", { headers: { Authorization: getToken() } })
    .then((res) => {
      callback(res.data);
    })
    .catch((e) => {
      callback(null);
    });
}

export interface SaveLocationProps {
  description: string;
  locationLong: string;
  locationLat: string;
  postGen: string;
  cities: string;
  image: ImagePickerAsset;
}

export const saveLocation = (props: SaveLocationProps) => {

  FileSystem.uploadAsync(POSTS_URL + "/createLocation", props.image.uri, {
    fieldName: "imageFile",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    headers: { Authorization: getToken() },
    parameters: {
      description: props.description,
      "location.longitude": props.locationLong,
      "location.latitude": props.locationLat,
      "cities": props.cities,
      "postGenre": props.postGen,
      "user_id": "D@gmail.com"
    },
  });

};
