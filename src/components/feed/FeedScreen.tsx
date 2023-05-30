import { Avatar, Card, Icon, Image } from "@rneui/themed";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ReadMore from "@fawazahmed/react-native-read-more";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getExploreFeed } from "../../actions/feedActions";
import { Colors } from "../../theme/Colors";
import { postGenreEnum, PostType } from "../../types/postTypes";
import CitiesPanel from "./CitiesPanel";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

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

const RouteItem = ({ data }: { data: PostType }) => {
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

      {data.contentData.descriptionDTO ? (
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

      <MapView
        style={{ height: 300, width: "100%", borderRadius: 15 }}
        provider={PROVIDER_GOOGLE}
        showsCompass={true}
        toolbarEnabled={false}
        zoomEnabled={true}
        scrollEnabled={false}
        region={calculatedRegion(data)}
      >
        {data.contentData.pinnedLocationsDTO.length > 0 &&
          data.contentData.pinnedLocationsDTO.map((pinnedLocation) => (
            <Marker
              coordinate={{
                latitude: pinnedLocation.locationDTO.latitude,
                longitude: pinnedLocation.locationDTO.longitude,
              }}
              title={pinnedLocation.descriptionDTO}
            />
          ))}
        {
          <Polyline
            coordinates={data.contentData.locationsDTO}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        }
      </MapView>
      <View style={[styles.row, { marginTop: 10, marginStart: 10 }]}>
        <Icon name="routes" type={"material-community"} size={18} />
        <Text style={styles.location}>
          {" "}
          {data.contentData.totalDurationDTO} hours |{" "}
          {data.contentData.totalDistanceDTO} Km | Created at{" "}
          {data.dateUploaded}
        </Text>
      </View>
    </View>
  );
};

function RouteDetailsScreen({ route }) {
  const data = route.params.item;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
      <View style={styles.itemContainer}>
        {/* <Text>Item ID: {data}</Text> */}
        <MapView
          style={{ height: "100%", width: "100%", borderRadius: 15 }}
          provider={PROVIDER_GOOGLE}
          showsCompass={true}
          toolbarEnabled={false}
          zoomEnabled={true}
          region={calculatedRegion(data)}
        >
          {data.contentData.pinnedLocationsDTO.length > 0 &&
            data.contentData.pinnedLocationsDTO.map((pinnedLocation) => (
              <Marker
                coordinate={{
                  latitude: pinnedLocation.locationDTO.latitude,
                  longitude: pinnedLocation.locationDTO.longitude,
                }}
                title={pinnedLocation.descriptionDTO}
              />
            ))}
          {
            <Polyline
              coordinates={data.contentData.locationsDTO}
              strokeColor="#FF0000"
              strokeWidth={3}
            />
          }
        </MapView>
        <View style={[styles.row, { marginTop: 10, marginStart: 10 }]}>
          <Icon name="routes" type={"material-community"} size={18} />
          <Text style={styles.location}>
            {" "}
            {data.contentData.totalDurationDTO} hours |{" "}
            {data.contentData.totalDistanceDTO} Km | Created at{" "}
            {data.dateUploaded}
          </Text>
        </View>
        <Text style={styles.pinnedLocations}>Pinned Locations:</Text>
        {data.contentData.pinnedLocationsDTO.map((item) => (
          <View>
            <Image
              source={{
                uri: data.contentData.pinnedLocationsDTO.imageFileNameDTO,
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
                name="map-marker"
                type={"material-community"}
                size={18}
                color={"#FF0000"}
              />
              <Text style={styles.location}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const calculatedRegion = (data: PostType): Region => {
  const minLatitude = Math.min(
    ...data.contentData.locationsDTO.map((coord) => coord.latitude)
  );
  const maxLatitude = Math.max(
    ...data.contentData.locationsDTO.map((coord) => coord.latitude)
  );
  const minLongitude = Math.min(
    ...data.contentData.locationsDTO.map((coord) => coord.longitude)
  );
  const maxLongitude = Math.max(
    ...data.contentData.locationsDTO.map((coord) => coord.longitude)
  );

  const padding = 0.01; // Adjust the padding as needed

  const calculatedRegion: Region = {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.abs(maxLatitude - minLatitude) + padding,
    longitudeDelta: Math.abs(maxLongitude - minLongitude) + padding,
  };

  return calculatedRegion;
};

export default function FeedScreen({ navigation }) {
  const [posts, setPosts] = useState([] as PostType[]);
  const [loading, setLoading] = useState(true as boolean);
  const [loadingMore, setLoadingMore] = useState(false as boolean);
  const [hasMore, setHasMore] = useState(true as boolean);
  const [page, setPage] = useState(1 as number);
  const [uniqueCities, setCities] = useState([] as string[]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[] | null>(null);
  const [cityImages, setCityImages] = useState(new Map<string, string>());

  const getData = () => {
    setLoading(true);
    getExploreFeed({ page: 1 }, (data) => {
      if (data?.allPosts) {
        setPosts(data.allPosts);
        setLoading(false);
        setPage(1);
        setHasMore(true);
      }
    });
  };

  //todo: change pull list from BE
  const getUniqueCities = useCallback(() => {
    let citySet = new Set<string>();
    let cityImageMap = new Map<string, string>();
    posts.forEach((post) => {
      post.cities.forEach((city) => {
        if (city && !citySet.has(city)) {
          citySet.add(city);
          cityImageMap.set(city, post.contentData.imageFileNameDTO);
        }
      });
    });
    setCities(Array.from(citySet));
    setCityImages(cityImageMap);
  }, [posts]);

  useEffect(() => {
    getUniqueCities();
  }, [getUniqueCities]);
  const handleCityFilter = (activeCities) => {
    if (activeCities.length > 0) {
      //todo: change filter from frontend to backend
      const filtered = posts.filter((post) =>
        post.cities.some((city) => activeCities.includes(city))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(null);
    }
  };
  const handleRefresh = () => {
    if (!loading && !loadingMore) {
      setLoading(true);
      getData();
    }
  };

  //initial
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const updateEvent = DeviceEventEmitter.addListener("update_feed", getData);
    getData();

    return () => {
      updateEvent.remove();
    };
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

  function showItem({ item }) {
    if (item.postGenre == postGenreEnum.Location) {
      return <Item data={item} />;
    } else {
      return (
        <Pressable
          onPress={() => {
            navigation.navigate("RouteDetails", { item });
          }}
        >
          <RouteItem data={item} />
        </Pressable>
      );
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 20,
      }}
    >
      <CitiesPanel
        uniqueCities={uniqueCities}
        cityImages={cityImages}
        onCityClick={handleCityFilter}
      />
      <FlatList
        data={posts}
        renderItem={({ item }) => showItem({ item })}
        keyExtractor={(item, index) => item.dataID + "_" + index}
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
  pinnedLocations: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});
