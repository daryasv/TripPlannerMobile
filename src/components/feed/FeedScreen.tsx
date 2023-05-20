import { Avatar, Card, Icon, Image } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ReadMore from "@fawazahmed/react-native-read-more";

import { getExploreFeed } from "../../actions/feedActions";
import { Colors } from "../../theme/Colors";
import { postGenreEnum, PostType } from "../../types/postTypes";

const Item = ({ data }: { data: PostType }) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.row}>
        <Avatar
          source={{
            uri: null,
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

      {data.contentData?.descriptionDTO ? (
        <ReadMore
          numberOfLines={3}
          style={styles.description}
          seeMoreStyle={{ color: Colors.main }}
          seeLessStyle={{ color: Colors.main }}
          seeMoreText={"Read More"}
        >
          {data.contentData.descriptionDTO}
        </ReadMore>
      ) : null}

      <Image
        source={{
          uri: data?.contentData?.imageFileNameDTO,
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

export default function FeedScreen() {
  const [posts, setPosts] = useState([] as PostType[]);
  const [loading, setLoading] = useState(true as boolean);
  const [loadingMore, setLoadingMore] = useState(false as boolean);
  const [hasMore, setHasMore] = useState(true as boolean);
  const [page, setPage] = useState(1 as number);

  const getData = useCallback(() => {
    getExploreFeed({ page }, (data) => {
      if (data?.allPosts) {
        setPosts(data.allPosts);
        setLoading(false);
        setPage(1);
        setHasMore(true);
      }
    });
  }, []);

  const handleRefresh = () => {
    if (!loading && !loadingMore) {
      setLoading(true);
      getData();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      setLoadingMore(true);
      getExploreFeed({ page: page + 1 }, (data) => {
        if (data?.allPosts?.length) {
          const newPosts = [...posts].concat(data.allPosts);
          setPosts(newPosts);
          setPage(page + 1);
          setLoadingMore(false);
        } else {
          setHasMore(false);
          setLoadingMore(false);
        }
      });
    }
  };

  const ListFooter = () => {
    if (loadingMore || hasMore) {
      return <ActivityIndicator />;
    }
    return null;
  };

  if (!posts) {
    return <RefreshControl refreshing={loading} />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 40,
      }}
    >
      <FlatList
        data={posts}
        renderItem={({ item }) => <Item data={item} />}
        keyExtractor={(item) => item.dataID}
        // refreshControl={<ActivityIndicator />}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={<ListFooter />}
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
