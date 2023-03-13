import Axios from "axios";
import { BASE_URL } from "./actionsConfig";

export interface RegisterData {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  password: string;
}

export const postUserRegister = (data: RegisterData) => {
  Axios.post(BASE_URL + "/users/register", { ...data })
    .then((res) => {
      console.log("success", JSON.stringify(res.data));
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
    });
};
