import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const MainMenuScreen = ({ navigation }) => {
    const handleSearchPress = () => {
        // Aktion für Suche-Button
    };

    const handleSavedPress = () => {
        navigation.navigate("Saved");
    };

    const handleComparePress = () => {
        navigation.navigate("Compare");
    };

    const handleMapPress = () => {
        navigation.navigate("Map");
    };

    const navigateToHome = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            {/* Logo Platzhalter */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../logo/Logo1.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.menuButton} onPress={navigateToHome}>
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleSavedPress}>
                <Text style={styles.buttonText}>Gespeichert</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleComparePress}>
                <Text style={styles.buttonText}>Vergleich</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={handleMapPress}>
                <Text style={styles.buttonText}>Karte</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
    },
    logoContainer: {
        marginTop: 20, // Abstand über dem Home-Button
    },
    logo: {
        width: 100, // Breite des Logos (anpassen nach Bedarf)
        height: 100, // Höhe des Logos (anpassen nach Bedarf)
    },
    menuButton: {
        padding: 20,
        marginBottom: 20,
        backgroundColor: 'blue',
        width: '80%',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MainMenuScreen;
