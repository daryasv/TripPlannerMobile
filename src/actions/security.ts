import AsyncStorage from "@react-native-async-storage/async-storage";

export const USER_DETAILS_STORAGE_NAME = "user_details";

let token;
let userId;
let userEmail;

export async function initUser(callback: (success: boolean) => void) {
  let data: any = await AsyncStorage.getItem(USER_DETAILS_STORAGE_NAME);
  if (data) {
    data = JSON.parse(data);
    if (data.token) {
      setToken(data.token);
      setUsetId(data._id);
      setUserEmail(data.userEmail)
      callback(true);
    }
  }

  callback(false);
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
