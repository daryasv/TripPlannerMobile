import axios from "axios";
import { getToken } from "./security";

export function getExploreFeed() {
  axios
    .get("/posts/explore", { headers: { Authorization: getToken() } })
    .then((res) => {
      console.log(res.data);
    })
    .catch((e) => {});
}
