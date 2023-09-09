import Axios from "axios";
import { BASE_URL } from "./actionsConfig";
import { getToken, getUserEmail, getUserId } from "./security";
import { ContentData } from "../types/postTypes";

export interface UserLocation {
  contentData: ContentData;
  postGenre: number;
  dateUploaded: string;
  uploadedBy: string;
  cities: string[];
  categories: string[];
  numOfSaves: number;
  comments: any[];
  views: number;
  dataID: string;
  UploadByProfilePictureUrl: string;
}

export interface User {
  _id: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  password: string;
  profilePictureId: string;
  userPicturesIds: any[];
  savedPicturesIds: string[];
  savedRoutes: UserLocation[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProfileData {
  user: User;
  posts: Array<UserLocation>;
}

export const GetUserProfile = (
  callback: (success: ProfileData | false) => void
) => {
  const headers = {
    Authorization: getToken(),
  };
  const params = {
    userName: getUserEmail(),
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

export const getSavedRoutes = (callback: (success) => void) => {
  Axios.get(BASE_URL + "/routes/getSavedRoutes", {
    headers: { Authorization: getToken() },
  })
    .then((res) => {
      callback(res.data);
    })
    .catch((e) => {
      callback(false);
    });
};
