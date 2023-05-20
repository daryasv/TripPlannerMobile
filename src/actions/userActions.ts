import Axios from "axios";
import { BASE_URL } from "./actionsConfig";

export interface RegisterData {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  password: string;
}

export const postUserRegister = (
  data: RegisterData,
  callback: (success: boolean) => void
) => {
  Axios.post(BASE_URL + "/users/register", { ...data })
    .then((res) => {
      console.log("success", JSON.stringify(res.data));
      callback(true);
    })
    .catch((e) => {
      console.log("error", JSON.stringify(e));
      //todo: Return errors from BE
      callback(false);
    });
};

export interface LoginData {
  userEmail: string;
  password: string;
}

export interface UserLoginData {
  _id: string;
  userEmail: string;
  token: string;
}

export const postUserLogin = (
  data: LoginData,
  callback: (success: UserLoginData | false) => void
) => {
  Axios.post(BASE_URL + "/users/login", { ...data })
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

