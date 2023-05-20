import axios from "axios";
import { getToken } from "./security";
import { BASE_URL } from "./actionsConfig";
import { PostType } from "../types/postTypes";
import { ImagePickerAsset } from "expo-image-picker";

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

export const saveLocation = (image: ImagePickerAsset) => {
  const body = new FormData();

  body.append("files", {
    uri: image.uri,
    type: image.type,
    name: image.fileName,
  });

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Content-Disposition': 'form-data',
      'Authorization': getToken()
    }
  }

  const response = axios.post(POSTS_URL+"/createLocation", body, config).then(r=>{
    console.log("success",r.data);
  }).catch(e=>{
    console.log("err",JSON.stringify(e));
  })
};
