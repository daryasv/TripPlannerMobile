import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const CitiesPanel = ({ uniqueCities , cityImages, onCityClick }) => {
    const [activeCities, setActiveCities] = useState([]);

    const handleCityClick = (city) => {
        if (activeCities.includes(city)) {
            const newActiveCities = activeCities.filter(c => c !== city);
            setActiveCities(newActiveCities);
            onCityClick(newActiveCities);
        } else {
            const newActiveCities = [...activeCities, city];
            setActiveCities(newActiveCities);
            onCityClick(newActiveCities);
        }
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {uniqueCities.map((city) => (
                <View style={styles.buttonContainer} key={city}>
                    <TouchableOpacity
                        style={[styles.button, activeCities.includes(city) && styles.activeButton]}
                        onPress={() => {
                            handleCityClick(city)}}
                    >
                        <Image
                            source={{ uri: cityImages[city] }}
                            style={{ width: '100%', height: '100%', borderRadius: 8,marginTop:5 }}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.buttonTitle, activeCities.includes(city) && styles.activeButtonTitle]}>
                        {city}
                    </Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginRight: 10,
        padding: 10,
        margin:4,
        paddingTop:0,
        backgroundColor: 'white',
        borderRadius: 8,
        height:80
    },
    button: {
        width: 114,
        height: 54,
        
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    activeButton: {
        borderColor: 'red',
    },
    buttonTitle: {
        fontSize: 12,
        textAlign:"left",
        width:"100%",
        fontWeight:"600"
    },
    activeButtonTitle: {
        color: 'red',
    },
});

export default CitiesPanel;
