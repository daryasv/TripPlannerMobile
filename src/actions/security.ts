import AsyncStorage from "@react-native-async-storage/async-storage";
import { DevSettings } from "react-native";

export const USER_DETAILS_STORAGE_NAME = "user_details";


let token;
let userId;
let userEmail;
let userFirstName;
let userLastName;
let profilePictureId;

export async function initUser(callback: (success: boolean) => void) {
  let data: any = await AsyncStorage.getItem(USER_DETAILS_STORAGE_NAME);
  if (data) {
    data = JSON.parse(data);
    if (data.token) {
      setToken(data.token);
      setUsetId(data._id);
      setUserEmail(data.userEmail);
      setUserFirstName(data.userFirstName);
      setUserLastName(data.userLastName);
      setprofilePictureId(data.profilePictureId);
      callback(true);
    }
  }

  callback(false);
}

function setUserFirstName(newFirstName) {
  userFirstName = newFirstName;
}

function setUserLastName(newLastName) {
  userLastName = newLastName;
}

function setprofilePictureId(newPictureId) {
  profilePictureId = newPictureId;
}

function setToken(newToken) {
  token = newToken;
}

function setUserEmail(newUserEmail) {
  userEmail = newUserEmail;
}

function setUsetId(newId) {
  userId = newId;
}

export function getToken() {
  return token;
}

export function getUserId() {
  return userId;
}

export function getUserEmail() {
  return userEmail;
}

export function getUserFirstName() {
  return userFirstName;
}

export function getUserLastName() {
  return userLastName;
}

export function getProfilePictureId() {
  return profilePictureId;
}

export async function Logout() {
  AsyncStorage.clear().then(() => {
    DevSettings.reload();
  });
}