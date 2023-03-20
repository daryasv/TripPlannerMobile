import { Avatar, Card, Icon, Image } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ReadMore from "@fawazahmed/react-native-read-more";

import { getExploreFeed } from "../../actions/feedActions";
import { Colors } from "../../theme/Colors";
import { postGenreEnum, PostType } from "./types/postTypes";

const Item = ({ data }: { data: PostType }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Avatar
          source={{
            uri: "https://yt3.googleusercontent.com/ytc/AL5GRJUlB_Htyl0G7YujVNVaOYOTeLz3b85bvu76MVngGWM=s900-c-k-c0x00ffffff-no-rj",
          }}
          rounded
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.username}>{data.uploadedBy}</Text>
          <View style={styles.row}>
            <Icon name="location-on" size={14} type={"material"} />
            <Text style={styles.location}>{data.cities.join(",")}</Text>
          </View>
        </View>
      </View>

      {data.description ? (
        <ReadMore
          numberOfLines={3}
          style={styles.description}
          seeMoreStyle={{ color: Colors.main }}
          seeLessStyle={{ color: Colors.main }}
          seeMoreText={"Read More"}
        >
          {data.description}
        </ReadMore>
      ) : null}

      <Image
        source={{
          uri: "https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX27761367.jpg",
        }}
        style={{
          width: "100%",
          aspectRatio: 1.5,
          marginTop: 15,
          borderRadius: 15,
          resizeMode: "cover",
        }}
      />
      <View style={[styles.row, { marginTop: 10, marginStart: 10 }]}>
        <Icon
          name="silverware-fork-knife"
          type={"material-community"}
          size={18}
        />
        <Text style={styles.location}>{data.categories.join(" | ")}</Text>
      </View>
    </View>
  );
};

const temp: PostType[] = [
  {
    dataID: "1",
    postGenre: postGenreEnum.Location,
    dateUploaded: "2022/12/12",
    uploadedBy: "Darya Svirsky",
    categories: ["Food"],
    cities: ["London"],
    userIdLiked: [],
    comments: [],
    views: 10,
    description: "The best pizza place in London!",
  },
  {
    dataID: "2",
    postGenre: postGenreEnum.Location,
    dateUploaded: "2022/12/12",
    uploadedBy: "Darya Svirsky",
    categories: ["Fashion"],
    cities: ["Los Angeles, USA"],
    userIdLiked: [],
    comments: [],
    views: 10,
    description: "",
  },
];

export default function FeedScreen() {
  const [posts, setPosts] = useState(null as PostType[]);

  useEffect(() => {
    //getExploreFeed();
    setPosts(temp);
  });

  if (!posts) {
    return <ActivityIndicator />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <FlatList
        data={posts}
        renderItem={({ item }) => <Item data={item} />}
        keyExtractor={(item) => item.dataID}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 20,
    height: "auto",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: Colors.Orange,
    fontWeight: "bold",
  },
  location: {
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 5,
  },
  description: {
    marginTop: 10,
  },
});
