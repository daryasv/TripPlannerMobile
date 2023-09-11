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
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  getExploreFeed, getFreshExploreFeedPosts,
  saveLocation,
  unSaveLocation,
} from "../../actions/feedActions";
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
import { RouteDTO } from "../../actions/tripActions";
import {getCitiesToImages} from "../../actions/cityPanelActions";

export const Item = ({ data, type }: { data: PostType; type: "image" | "route" }) => {
  const [saved, setSaved] = useState(data.isSavedByUser);
  const onSaveLocation = () => {
    if (saved) {
      unSaveLocation(data.dataID)
          .then(() => {
            setSaved(false);
          })
          .catch((e) => {});
    } else {
      saveLocation(data.dataID)
          .then((response) => {
            setSaved(true);
          })
          .catch((e) => {});
    }
  };
  if (type === "route") {
  }

  return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Avatar
                source={{
                  uri: data.UploadByProfilePictureUrl,
                }}
                rounded
                size={40}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.username}>
                {data.uploadedBy.includes("@")
                    ? data.uploadedBy.substring(0, data.uploadedBy.indexOf("@"))
                    : data.uploadedBy}
              </Text>
              {data.cities?.length ? (
                  <View style={styles.row}>
                    <Icon name="location-on" size={14} type={"material"} />
                    <Text style={styles.location}>{data.cities.join(",")}</Text>
                  </View>
              ) : null}
            </View>
          </View>
          <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={30}
              onPress={() => onSaveLocation()}
          />
        </View>

        {type === "route" ? (
            <MapView
                style={{ height: 300, width: "100%", borderRadius: 8, marginTop: 10 }}
                provider={PROVIDER_GOOGLE}
                showsCompass={true}
                toolbarEnabled={false}
                zoomEnabled={true}
                scrollEnabled={false}
                region={calculatedRegion(data.contentData)}
            >
              {data.contentData?.pinnedLocationsDTO[1].length > 0 &&
                  data.contentData.pinnedLocationsDTO[1].map((pinnedLocation) => (
                      <Marker
                          coordinate={{
                            latitude: pinnedLocation?.contentData?.locationDTO.latitude,
                            longitude: pinnedLocation?.contentData?.locationDTO?.longitude,
                          }}
                          title={pinnedLocation?.contentData?.descriptionDTO}
                      />
                  ))}
              {
                <Polyline
                    coordinates={data.contentData?.locationsDTO[1].map(item => ({ latitude: item.latitude, longitude: item.longitude }))}
                    strokeColor="#FF0000"
                    strokeWidth={3}
                />
              }
            </MapView>
        ) : (
            <Image
                source={{
                  uri: data?.contentData?.imageFileNameDTO,
                }}
                style={{
                  width: "100%",
                  aspectRatio: 1.5,
                  marginTop: 15,
                  borderRadius: 8,
                  resizeMode: "cover",
                }}
            />
        )}

        {data.contentData?.descriptionDTO ? (
            <ReadMore
                numberOfLines={3}
                style={styles.description}
                wrapperStyle={{ marginTop: 10 }}
                seeMoreStyle={{ color: Colors.main }}
                seeLessStyle={{ color: Colors.main }}
                seeMoreText={"Read More"}
            >
              {data.contentData.descriptionDTO}
            </ReadMore>
        ) : null}

        {type === "route" ? (
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={styles.location}>
                {data.contentData?.totalDurationDTO || 0} hours |{" "}
                {data.contentData?.totalDistanceDTO || 0} Km | Created at{" "}
                {data.dateUploaded}
              </Text>
            </View>
        ) : (
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={styles.location}>{data.categories.join(" | ")}</Text>
            </View>
        )}
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
              region={calculatedRegion(data.contentData)}
          >
            {data.contentData?.pinnedLocationsDTO?.length > 0 &&
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
          {data.contentData.pinnedLocationsDTO[1].map((item) => (
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

export const calculatedRegion = (data: RouteDTO): Region => {
  //console.log(data.locationsDTO[1])

  if (!data.locationsDTO[1].length) return null;
  const minLatitude = Math.min(
      ...data.locationsDTO[1].map((coord) => coord.latitude)
  );
  const maxLatitude = Math.max(
      ...data.locationsDTO[1].map((coord) => coord.latitude)
  );
  const minLongitude = Math.min(
      ...data.locationsDTO[1].map((coord) => coord.longitude)
  );
  const maxLongitude = Math.max(
      ...data.locationsDTO[1].map((coord) => coord.longitude)
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
  const [filteredPosts, setFilteredPosts] = useState<PostType[] | null>(null);
  const [isFiltering,setIsFiltering] = useState(false);
  const [filteringPage, setFilteringPage] = useState(1);
  const [postsPage, setPostsPage] = useState(1 as number);
  const [prevActiveCities, setPrevActiveCities] = useState([]);
  const [loading, setLoading] = useState(true as boolean);
  const [loadingMore, setLoadingMore] = useState(false as boolean);
  const [hasMore, setHasMore] = useState(true as boolean);
  const [uniqueCities, setCities] = useState([] as string[]);
  const [cityImages, setCityImages] = useState(new Map<string, string>());
  const [finishedFetchCities,setFinishedFetchCities] = useState(false);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0);


  // ----------------------------- POSTS AND FILTERING START ------------------------------//

  const getPosts = (page) => {
    setLoading(true);
    setIsFiltering((prevState)=> false);
    getExploreFeed({ page: page }, (data) => {
      if (data?.allPosts) {
        setPosts(data.allPosts);
        setLoading(false);
        setPostsPage((page)=>page+1);
        setHasMore(true);
      }
    });
  };

  const handleCityFilter = (activeCities) => {
    console.log("Inside parent handleCityFilter");
    console.log(`!!! WE ARE IN HANDLE CITY FILTER WITH ACTIVECITIES = ${activeCities}`);

    if (activeCities.length > 0) {
      setIsFiltering(true);


      // Check if activeCities has changed from the previous value
      if (JSON.stringify(prevActiveCities) !== JSON.stringify(activeCities)) {
        setFilteringPage((prevState) => 1); // Reset the page to 1
        setPrevActiveCities(activeCities); // Update the previous state with the current value

        setFilteredPosts(prevPosts => {
          if (prevPosts) {
            return prevPosts.filter(post =>
                post.cities.some(city => activeCities.includes(city))
            );
          }
          return null; // or return an empty array [] based on your application's needs
        });
      }

      getExploreFeed({ page: filteringPage, cities: activeCities }, (data) => {
        if (data.allPosts !== null) {
          console.log(`!!! WE ARE IN HANDLE CITY THATS THE FILTERED POSTS WE GOT = ${JSON.stringify(data?.allPosts)}`);
          const postsToAdd = data?.allPosts || []; // Default to empty array if null or undefined

          setFilteredPosts((prevPosts) => [...(prevPosts || []), ...postsToAdd]);
          setPosts((prevPosts) => [...(prevPosts || []), ...postsToAdd]);
          setFilteringPage((prevState)=> prevState+1);
          setLoading(false);
          setHasMore(true);
          console.log('WE ARE DONE WITH THE FILTERED POSTS WE GOT!!');
        } else {
          console.log(`!!! WE ARE IN HANDLE CITY if (data?.allPosts)`);
          resetToDefault();
        }
      });
    } else {
      console.log(`!!! WE ARE IN HANDLE CITY  } else {`);
      resetToDefault();
    }
  };

  const resetToDefault = () => {
    setIsFiltering(false);
    setFilteringPage(()=> 1);
    setPostsPage(()=> 1);
    setPrevActiveCities(()=> []);
  }

  const handleRefresh = () => {
    console.log("WE ARE IN handleRefresh");
    if (!loading && !loadingMore) {
      setLoading(true);
      setPosts([]);
      setFilteredPosts([]);
      getUniqueCitiesAndImages();
      resetToDefault();
      getFreshExploreFeedPosts({ page: 1 }, (data) => {
        if (data?.allPosts) {
          console.log(JSON.stringify(data.allPosts));
          setPosts(data.allPosts);
          setLoading(false);
          setPostsPage(2);  // Assuming you want to load the second page next.
        }
      });
    }
  };


  const handleLoadMore = () => {
    if (isFetchingPosts) return;

    setIsFetchingPosts(true);
    console.log("Loading more posts...");

    // Increment the page number to fetch the next set of posts.
    setPostsPage(prevPage => prevPage + 1);

    getExploreFeed({ page: postsPage, cities: prevActiveCities }, (data) => {
      if (data.allPosts !== null) {
        console.log(`Loaded more posts: ${JSON.stringify(data?.allPosts)}`);
        const postsToAdd = data?.allPosts || []; // Default to an empty array if null or undefined

        // Add the new posts to the existing posts.
        setFilteredPosts((prevPosts) => [...(prevPosts || []), ...postsToAdd]);
        setPosts((prevPosts) => [...(prevPosts || []), ...postsToAdd]);

        // Check if there are fewer posts than expected, indicating it may be the last page.
        if (data.sentAllPostsIndicator == true) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        setIsFetchingPosts(false); // Reset the fetching flag
      } else {
        console.log("No more posts to load.");
        setHasMore(false);
        setIsFetchingPosts(false); // Reset the fetching flag
      }
    });
  };



  // ----------------------------- POSTS AND FILTERING END ------------------------------//



  const getUniqueCitiesAndImages = useCallback(async () => {
    setRefreshKey(prevKey => prevKey + 1);
    try {
      const citiesToImageArr = await getCitiesToImages();
      const uniqueCitiesSet = new Set<string>();
      const cityImagesMap: Map<string, string> = new Map<string, string>();
      citiesToImageArr.forEach(cityImage => {
        uniqueCitiesSet.add(cityImage.cityName);
        cityImagesMap[cityImage.cityName] = cityImage.imageUrl;
      });

      setCities(Array.from(uniqueCitiesSet));
      setCityImages(cityImagesMap);
      setFinishedFetchCities(true);
    } catch (error) {
      console.error('Error updating unique cities and images:', error);
      // Optionally set an error state here
    }
  }, []); // Empty dependency list, because we aren't using any external variables

  useEffect(() => {
    getUniqueCitiesAndImages();
  }, [getUniqueCitiesAndImages]); // Make sure to include getUniqueCitiesAndImages in the dependency list


  //initial
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    const updateEvent = DeviceEventEmitter.addListener("update_feed", getPosts);
    getPosts(postsPage);
    return () => {
      updateEvent.remove();
    };
  }, []);


  const ListFooter = () => {
    if ((!loading) && (loadingMore || hasMore)) {
      return <ActivityIndicator />;
    }
    return null;
  };

  if (!posts?.length) {
    return(
      <View
        style={{
          flex: 1,
          paddingBottom: 20,
          paddingTop:20
        }}
      >
        {loading ? <ActivityIndicator size={"large"} color={"black"} /> : <Text>No posts found</Text>}
      </View>
    );
  }

  function showItem({ item }) {
    if (item.postGenre == postGenreEnum.Location) {
      return <Item type="image" data={item} />;
    } else {
      return (
          <Pressable
              onPress={() => {
                navigation.navigate("RouteDetails", { item });
              }}
          >
            <Item data={item} type="route" />
          </Pressable>
      );
    }
  }


  return (
      <View
          style={{
            flex: 1,
            paddingBottom: 20,
          }}
      >
        <FlatList
        ListHeaderComponent={
          loading ? null
            :
              <View style={{ padding: 10 }}>
                {!finishedFetchCities ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <CitiesPanel
                        key={refreshKey}
                        uniqueCities={uniqueCities}
                        cityImages={cityImages}
                        onCityClick={handleCityFilter}
                    />
                )}
              </View>
            }
            data={ isFiltering? filteredPosts : posts}
            renderItem={({ item }) => showItem({ item })}
            keyExtractor={(item, index) => item.dataID + "_" + index}
            // refreshControl={<ActivityIndicator />}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={()=> {handleRefresh()}}/>
            }
            onEndReached={() => {
              if (!loading && !isFetchingPosts) {
                handleLoadMore();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={<ListFooter />}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    margin: 10,
    padding: 10,
    height: "auto",
    backgroundColor: "white",
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    color: "black",
    fontWeight: "bold",
  },
  location: {
    fontSize: 11,
    fontWeight: "300",
    marginLeft: 5,
  },
  description: {
    fontWeight: "600",
    flex: 1,
  },
  pinnedLocations: {
    marginTop: 20,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 18,
  },
});
