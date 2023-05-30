import Axios from "axios";
import { BASE_URL } from "./actionsConfig";
import { getToken, getUserEmail, getUserId } from "./security";

export interface UserLocation {
  "contentData": {
    "location": {
      "longitude": number,
      "latitude": number
    },
    "_id": string,
    "imageFileNameDTO": string,
    "description": string,
    "__v": number },
    "postGenre": number,
    "dateUploaded": string,
    "uploadedBy": string,
    "cities": Array<string>,
    "categories": Array<string>,
    "comments": Array<string>,
    "views": number,
    "dataID": string
}

export interface User {
  "_id": string,
  "userFirstName": string,
  "userLastName": string,
  "userEmail": string,
  "password": string,
  "profilePictureId": string,
  "userPicturesIds": string[],
  "savedPicturesIds": string[],
  "savedRoutes": string[],
  "createdAt": string,
  "updatedAt": string,
  "__v": number
}

export interface ProfileData {
  "user": User,
  "posts": Array<UserLocation>
}

export const GetUserProfile = (
  callback: (success: ProfileData | false) => void
) => {
  const headers = {
    'Authorization': getToken()
  };
  const params = {
    'userName' : getUserEmail()
  };
  Axios.get(BASE_URL + "/posts/profile", { params, headers })
    .then((res) => {
      console.log("success", JSON.stringify(res.data));
      callback(res.data);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};
