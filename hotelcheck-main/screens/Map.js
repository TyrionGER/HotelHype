import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

const MapScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    const getLocationAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        // Hier den Städtenamen abrufen
        const cityName = await getCityName(currentLocation.coords.latitude, currentLocation.coords.longitude);
        setCity(cityName);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocationAsync();
  }, []);

  const sendLocation = () => {
    if (city) {
      console.log('Standort übertragen:', city);
    } else {
      console.warn('Städtenamen nicht verfügbar');
    }
  };

  const getCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      console.log('API-Antwort:', data); // Hinzugefügt, um die API-Antwort zu überprüfen

      if (data && data.address && (data.address.city || data.address.village)) {
        return data.address.city || data.address.village;
      } else {
        return 'Unbekannt';
      }
    } catch (error) {
      console.error('Fehler beim Abrufen des Städtenamens:', error);
      return 'Unbekannt';
    }
  };

  const navigateToMainMenu = () => {
    navigation.navigate('MainMenu');
  };

  return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="light-content" />
        <View style={styles.logoContainer}>
          <Image
              source={require('../logo/Logo1.jpg')}
              style={styles.logo}
              resizeMode="contain"
          />
        </View>
        <View style={styles.topMenu}>
          <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
            <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
              Main Menu
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, color: 'white' }}>Karte</Text>
          <TouchableOpacity onPress={sendLocation} style={styles.menuButton}>
            <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
              Standort übertragen
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.mapContainer}>
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                >
                  <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                      title="Current Location"
                      description="You are here"
                  />
                </MapView>
            )}
          </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'blue',
    height: 70,
  },
  menuButton: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'green', // Hier die gewünschte Hintergrundfarbe für den MainMenu-Container
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
    marginTop: 0, // Hier kannst du den oberen Abstand anpassen
  },
  logo: {
    width: 120, // Breite des Logos (anpassen nach Bedarf)
    height: 100, // Höhe des Logos (anpassen nach Bedarf)
  },
  mapContainer: {
    flex: 2, // Ändere dies nach Bedarf, um das Verhältnis zwischen MainMenu und Kartencontainer zu steuern
  },
  map: {
    flex: 1,
  },
});
export default MapScreen;
