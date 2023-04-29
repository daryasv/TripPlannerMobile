import Axios from "axios";
import { BASE_URL } from "./actionsConfig";

export interface ProfileData {
  userFirstName: string;
  userLastName: string;
}

export const GetUserProfile = (
  data: ProfileData,
  callback: (success: ProfileData | false) => void
) => {
  Axios.get(BASE_URL + "posts/" + "/wall")
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
