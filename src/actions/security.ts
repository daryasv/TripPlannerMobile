import AsyncStorage from "@react-native-async-storage/async-storage";

export const USER_DETAILS_STORAGE_NAME = "user_details";

let token;

export async function initUser(callback: (success: boolean) => void) {
  let data: any = await AsyncStorage.getItem(USER_DETAILS_STORAGE_NAME);
  if (data) {
    data = JSON.parse(data);
    if (data.token) {
      setToken(data.token);
      callback(true);
    }
  }

  callback(false);
}

function setToken(newToken) {
  token = newToken;
}

export function getToken() {
  return token;
}
