import axios from "axios";
import { getToken } from "./security";
import { BASE_URL } from "./actionsConfig";
import { PostType } from "../types/postTypes";

const POSTS_URL = BASE_URL + "/posts";

export function getExploreFeed(
  callback: (data?: { allPosts: PostType[] }) => void
) {
  axios
    .get(POSTS_URL + "/explore", { headers: { Authorization: getToken() } })
    .then((res) => {
      callback(res.data);
    })
    .catch((e) => {
      callback(null);
    });
}
