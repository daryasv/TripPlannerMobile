import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const CitiesPanel = ({ uniqueCities , cityImages, onCityClick }) => {
    const [activeCities, setActiveCities] = useState([]);
    const handleCityClick = (city) => {
        // Check if the city is already active
        if (activeCities.includes(city)) {
            // If the city is active, remove it from the active cities
            setActiveCities(activeCities.filter(c => c !== city));
            onCityClick(activeCities.filter(c => c !== city));
        } else {
            // If the city is not active, add it to the active cities
            setActiveCities([...activeCities, city]);
            onCityClick([...activeCities, city]);
        }
    };

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {uniqueCities.map((city) => (
                <View style={styles.buttonContainer} key={city}>
                    <TouchableOpacity
                        style={[styles.button, activeCities.includes(city) && styles.activeButton]}
                        onPress={() => handleCityClick(city)}
                    >
                        <Image
                            source={{ uri: cityImages.get(city) }}
                            style={{ width: '100%', height: '100%', borderRadius: 35 }}
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
        backgroundColor: '#fff',
        padding: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        marginRight: 10,
        padding: 10,
        margin:4,
        paddingTop:0,
    },
    button: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    activeButton: {
        borderColor: 'red',
    },
    buttonTitle: {
        fontSize: 12,
        textAlign: 'center',
    },
    activeButtonTitle: {
        color: 'red',
    },
});

export default CitiesPanel;