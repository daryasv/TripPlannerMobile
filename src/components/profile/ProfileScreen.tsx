
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ScrollView, Button, Pressable } from 'react-native';
import { Colors } from "../../theme/Colors";
import { USER_DETAILS_STORAGE_NAME, getUserEmail, getUserId } from "../../actions/security";
import { Link, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GetUserProfile } from '../../actions/profileActions';

const styles = StyleSheet.create({
    Avatar: {
        marginTop: 10,
        alignSelf: 'center',
        width: 75,
        height: 75,
        borderRadius: 50
    },
    UserName: {
      marginTop: 10,
      color: Colors.LightBlack,
      textAlign: 'center',
      fontSize: 24,
    },
    NoPostsMsg: {
        color: Colors.LightBlack,
        textAlign: 'center',
        fontSize: 16,
    },
    LocationsNum: {
        color: Colors.LightBlack,
        textAlign: 'left',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 15,
        borderRadius: 4,
        marginHorizontal: '20%',
        minWidth: '30%'
    },
    RoutesNum: {
        color: Colors.LightBlack,
        textAlign: 'right',
        fontSize: 20,
        paddingVertical: 15,
        fontWeight: 'bold'
    },
    row:{
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    LocationsText: {
        color: Colors.LightBlack,
        textAlign: 'left',
        fontSize: 18,
        borderRadius: 4,
        marginHorizontal: '17%',
        marginTop: -10,
        marginBottom: 20,
        minWidth: '31%'
    },
    RoutesText: {
        color: Colors.LightBlack,
        textAlign: 'right',
        fontSize: 18,
        marginTop: -10,
    },
    imageContainerStyle: {
        flex: 1,
        flexDirection: 'column',
        margin: 1,
    },
      imageStyle: {
        height: 120,
        width: '100%',
    },
    LocationsHeader: {
        color: Colors.main,
        textAlign: 'left',
        fontSize: 18,
        borderRadius: 4,
        marginHorizontal: '7%',
        minWidth: '31%',
        fontWeight: 'bold'
    },
    ViewAll: {
        color: Colors.LightBlack,
        textAlign: 'right',
        fontSize: 16,
        borderRadius: 4,
        marginHorizontal: '7%',
        minWidth: '41%',
    }
  });

  let allLocations = [];

  let routes = [];
  let numberOfRoutes = 4;
  for (let index = 0; index < numberOfRoutes; index++) {
    routes.push(
      <View key={index}>
        <View
          style={{
            width: 100,
            height: 100,
            marginVertical: 0.5,
            backgroundColor: 'black',
            opacity: 0.1,
            marginBottom: 15,
            marginHorizontal: 12,
            borderRadius: 10,
          }}></View>
      </View>,
    );
  }

  const Stack = createNativeStackNavigator();

export default function ProfileScreen(){
    return(
        <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="ProfileHome">
                <Stack.Screen name="ProfileHome" options={{headerShown: false}} component={ProfileHomeScreen} />
                <Stack.Screen name="Locations" component={ProfileLocationsScreen} />
                <Stack.Screen name="Routes" component={ProfileRoutesScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export function ProfileHomeScreen({ navigation }) {
    const [locations, setLocations] = useState([]);
    const [numLocations, setLocationsNum] = useState(0);
    type displayFields = "flex" | "none";
    const [showNoPosts, setShowNoPosts] = useState("none" as displayFields);

    function showViewAll() {
        if (showNoPosts == "flex") {
            return "none";
        } else {
            return "flex";
        }
    }

    useEffect(() => {
        GetUserProfile((success) => {
            if (success) {
                setLocations(success.allPosts.slice(-6));
                setLocationsNum(success.allPosts.length);
                success.allPosts.forEach(function (value) { 
                    allLocations.push(value);
                });
                setShowNoPosts(success.allPosts.length ? "none" : "flex");
            }
          });
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={true}>
            <Image style={styles.Avatar}
            source={{ uri: "https://randomuser.me/api/portraits/women/31.jpg" }}
            />
            <Text style={styles.UserName}>{getUserEmail()}</Text>
            <View style={styles.row}>
                <Text style={styles.LocationsNum}>{numLocations}</Text>
                <Text style={styles.RoutesNum}>10</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.LocationsText}>Locations</Text>
                <Text style={styles.RoutesText}>Routes</Text>
            </View>
            <View>
                <View style={styles.row}>
                    <Text style={styles.LocationsHeader}>Locations</Text>
                    <Pressable onPress={() => navigation.navigate('Locations')} style={{display : showViewAll()}}><Text style={styles.ViewAll}>View all</Text></Pressable>
                </View>
                <View
                style={{
                    borderBottomColor: Colors.LightBlack,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    margin:10,
                }}/>
                <View style={{
                            width: '100%',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            paddingVertical: 5,
                            justifyContent: 'space-between',
                            display: 'flex'
                        }}>
                        <View style={{display : showNoPosts}}>
                            <Text style={styles.NoPostsMsg}>no posts :(</Text>
                        </View>
                        {locations.map(location => (
                            <View key= {location.dataID}>
                            <Image
                            style={{
                                width: 100,
                                height: 100,
                                marginVertical: 0.5,
                                marginBottom: 15,
                                marginHorizontal: 12,
                                borderRadius: 10,
                            }}
                            source={{ uri: location.contentData.imageFileNameDTO }}/>
                            </View>
                        ))}
                    </View>
                </View>
            <View>
                <View style={styles.row}>
                    <Text style={styles.LocationsHeader}>Routes</Text>
                    <Pressable onPress={() => navigation.navigate('Routes')}><Text style={styles.ViewAll}>View all</Text></Pressable>
                </View>
                <View
                style={{
                    borderBottomColor: Colors.LightBlack,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    margin:10,
                }}/>
                    <View style={{
                            width: '100%',
                            flexWrap: 'wrap',
                            flexDirection: 'row',
                            paddingVertical: 5,
                            justifyContent: 'space-between',
                        }}>
                        {routes}
                    </View>
                </View>
        </ScrollView>
    )
}

export function ProfileLocationsScreen(){
    return (
        <ScrollView showsVerticalScrollIndicator={true}>
            <View style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                }}>
                {allLocations.map(location => (
                            <View key= {location.dataID}>
                            <Image
                            style={{
                                width: 100,
                                height: 100,
                                marginVertical: 0.5,
                                marginBottom: 15,
                                marginHorizontal: 12,
                                borderRadius: 10,
                            }}
                            source={{ uri: location.contentData.imageFileNameDTO }}/>
                            </View>
                        ))}
            </View>
        </ScrollView>
    )
}

export function ProfileRoutesScreen() {
    return (
        <ScrollView showsVerticalScrollIndicator={true}>
            <View style={{
                    width: '100%',
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    paddingVertical: 5,
                    justifyContent: 'space-between',
                }}>
                {routes}
            </View>
        </ScrollView>
    )
}