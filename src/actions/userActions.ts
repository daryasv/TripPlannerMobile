import Axios from "axios";
import { BASE_URL } from "./actionsConfig";
import * as FileSystem from "expo-file-system";

export interface RegisterData {
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  password: string;
}

export const postUserRegister = (
  data: RegisterData,
  image,
  callback: (success: boolean) => void
) => {
  FileSystem.uploadAsync(BASE_URL + "/users/register", image?.uri, {
    fieldName: "imageFile",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    parameters: {
      "userFirstName": data.userFirstName,
      "userLastName": data.userLastName,
      "userEmail": data.userEmail,
      "password": data.password
    },
  }).then(res => {
    console.log(res);
    if (res.status === 201 || res.status === 200) {
      callback(JSON.parse(res.body));
    } else {
      callback(false);
    }
  }).catch(e => {
    console.log(e);
    callback(false);
  });
  // Axios.post(BASE_URL + "/users/register", { ...data })
  //   .then((res) => {
  //     console.log("success", JSON.stringify(res.data));
  //     callback(true);
  //   })
  //   .catch((e) => {
  //     console.log("error", JSON.stringify(e));
  //     //todo: Return errors from BE
  //     callback(false);
  //   });
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

