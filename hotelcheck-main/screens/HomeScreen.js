import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, ScrollView, Linking } from 'react-native';
import { firestore } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as Location from 'expo-location';
import Modal from "react-native-modal";
import * as appconfig from "../config/secrets";



const HotelHomeScreen = () => {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [sortType, setSortType] = useState(null);


  useEffect(() => {
    const unsubscribe = firestore.collection('hotels').onSnapshot((snapshot) => {
      const hotelsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHotels(hotelsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);


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

      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocationAsync();
  }, []);


  const getCityName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
  
      console.log('API-Antwort:', data);
  
      let cityName;
  
      if (data && data.address && (data.address.city || data.address.village)) {
        cityName = data.address.city || data.address.village;
      } else if (data && data.address && data.address.county) {
        // Extrahiere den Stadtnamen aus "Stadt Landkreis Reutlingen"
        const countyParts = data.address.county.split(' ');
        cityName = countyParts[countyParts.length - 1];
      } else {
        cityName = 'Unbekannt';
      }
  
      console.log(cityName);
      searchHotelsByCity(cityName);
    } catch (error) {
      console.error('Fehler beim Abrufen des Städtenamens:', error);
      return 'Unbekannt';
    }
  };


  const sendLocation = async () => {
    try {
      await getLocationAsync();
      if (location) {
        console.log('Standort übertragen:', location);
        const cityName = await getCityName(location.latitude, location.longitude);
         console.log('Städtenamen:', cityName);
      } else {
        console.warn('Standort nicht verfügbar');
      }
    } catch (error) {
      console.error('Fehler beim Übertragen des Standorts:', error);
    }
  };


  const searchHotelsByCity = async (cityName) => {
    console.log('Location:', cityName);
    try {

      const currentDate = new Date();//Aktuelles Datum holen
      const checkinDate = currentDate.toISOString().split("T")[0];
      const checkoutDate = new Date(currentDate);
      checkoutDate.setDate(currentDate.getDate() + 1);
      const checkoutDateString = checkoutDate.toISOString().split("T")[0];

      const response = await axios.get('https://airbnb13.p.rapidapi.com/search-location', {
        params: {
          location: cityName,
          checkin: checkinDate,
          checkout: checkoutDateString,
          adults: '1',
          children: '0',
          infants: '0',
          pets: '0',
          page: '1',
          currency: 'EUR',
        },
        headers: {
          'X-RapidAPI-Key': appconfig.AIRBNB_API_KEY,
          'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com',
        },
      });

      const hotelsData = response.data.results;
      setFilteredHotels(hotelsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      await sendLocation();  // Warte auf die Standortbestimmung
      if (location) {
        const cityName = await getCityName(location.latitude, location.longitude);
        setCity(cityName);
        searchHotelsByCity(filter);
      } else {
        console.warn('Standort nicht verfügbar');
      }
    } catch (error) {
      console.error('Fehler beim Suchen von Hotels:', error);
    }
  };

  
  const sortHotels = (sortType) => {

    if (filteredHotels && filteredHotels.length > 0) {
      let sortedHotels = [...filteredHotels]; // Erstelle eine Kopie der Hotels zum Sortieren

      if (sortType === 'priceAsc') {
        sortedHotels = sortedHotels.sort((a, b) => a.price.total - b.price.total);
      } else if (sortType === 'priceDesc') {
        sortedHotels = sortedHotels.sort((a, b) => b.price.total - a.price.total);
      } else if (sortType === 'ratingAsc') {
        sortedHotels = sortedHotels.sort((a, b) => (a.rating || 0) - (b.rating || 0));
      } else if (sortType === 'ratingDesc') {
        sortedHotels = sortedHotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setFilteredHotels(sortedHotels); // Setze die sortierten Hotels
    }
  };

  const handleSortChange = (sortType) => {
    console.log('Sortierung geändert:', sortType);
    setSortType(sortType);
    sortHotels(sortType);
  };





  const SortingDropdown = ({ isVisible, onSortChange }) => {
    const [sortMenuVisible, setSortMenuVisible] = useState();
    const handleSortPress = (sortType) => {
      setModalVisible(false);
      onSortChange(sortType);
    };
    
    return (
      <>
        {isVisible && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={isVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => handleSortPress('priceAsc')} style={styles.sortOption}>
                  <Text style={[styles.sortOptionText, { fontSize: 18, color: 'white'}]}>Preis aufsteigend</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSortPress('priceDesc')} style={styles.sortOption}>
                  <Text style={[styles.sortOptionText, { fontSize: 18, color: 'white' }]}>Preis absteigend</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSortPress('ratingAsc')} style={styles.sortOption}>
                  <Text style={[styles.sortOptionText, { fontSize: 18, color: 'white' }]}>Bewertung aufsteigend</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSortPress('ratingDesc')} style={styles.sortOption}>
                  <Text style={[styles.sortOptionText, { fontSize: 18, color: 'white' }]}>Bewertung absteigend</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </>
    );
  };

  


  const handleMapPress = () => {
    navigation.navigate("Map");
  }; 
  const navigateToDetails = (hotel) => {
    navigation.navigate('HotelDetailsScreen', { hotel });
  };

  const navigateToMainMenu = () => {
    navigation.navigate('MainMenu');
  };

  const handleSearchInputChange = (text) => {
    setSearchInput(text);
  };

  const handleSearchbar = () => {
    searchHotelsByCity(searchInput);
  }

  const openAirbnbUrl = (url) => {
    Linking.openURL(url)
      .then(() => console.log("Url geöffnet"))
      .catch((error) => console.error("Fehler beim Öffnen der URL:",error))
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../logo/Logo1.jpg')}
          style={styles.headerImage}
        />
      </View>
  
      <View style={styles.topMenu}>
        <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
          <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>Main Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearch} style={styles.menuButton}>
        <Icon name="hotel" size={20} color="white"/>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBarContainer}>
  <TextInput
    style={styles.searchBar}
    placeholder="Center City"
    onChangeText={handleSearchInputChange}
  />

  <TouchableOpacity onPress={() => handleSearchbar(searchInput)} style={styles.searchButton}>
    <Icon name="arrow-right" size={20} color="white" />
  </TouchableOpacity>
  </View>
  
      <ScrollView style={styles.hotelList}>
        
        {filteredHotels && filteredHotels.map((hotel) => (
          <TouchableOpacity
            key={hotel.id}
            style={styles.hotelContainer}
            onPress={() => navigateToDetails(hotel)}
          >
            
            <Image source={{ uri: hotel.images[0] }} style={styles.hotelImage} />
            <View style={styles.hotelInfo}>
              <Text style={styles.hotelName}>{hotel.name}</Text>
              <Text style={styles.hotelDescription}>{hotel.type}</Text>
              <Text style={styles.hotelDescription}>City: {hotel.city}</Text>
              <Text style={styles.hotelAvgRating}>
                Rating: {hotel.rating ? hotel.rating.toFixed(1) : 'N/A'} ☆ ({hotel.reviewsCount || 0} reviews)
              </Text>
              <Text style={styles.hotelNumRatings}>Price: {hotel.price.total} {hotel.price.currency}</Text>
            </View>
            <View style={styles.hotelContent}>
              <TouchableOpacity onPress={() => openAirbnbUrl(hotel.url)} style={styles.viewButton}>
              <Icon name="globe" size={20} color="blue" />
              </TouchableOpacity>
                
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
  
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.reservationButton} onPress={handleMapPress}>
          <Icon name="map" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.reservationButton} onPress={() => setModalVisible(!modalVisible)}>
          <Icon name="sort" size={20} color="white" />
        </TouchableOpacity>
        <SortingDropdown isVisible={modalVisible} onSortChange={handleSortChange} />
      </View>
    </View>
  );
}  


const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
  },
  sortOption: {
    paddingVertical: 10,
  },
  sortOptionText: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 10,
  },

  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    height: 70,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 20,
  },
  additionalIcon: {
    padding: 10,
    marginRight: 15,
  },

  hotelContent:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewButton:{
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  topMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'blue',
    height: 70,
  },

    hotelList: {
      flex: 1,
      padding: 15,
    },
    hotelContainer: {
      flexDirection: 'row',
      alignItems: "center",
      marginBottom: 20,
      borderRadius: 10,
      padding: 10,
    },
    hotelImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    hotelInfo: {
      flex: 1,
      marginLeft: 10,
    },
    hotelName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: 'blue', 
    },
    hotelDescription: {
      marginBottom: 5,
      color: 'blue', 
    },
    hotelAvgRating: {
      marginBottom: 5,
      color: 'blue', 
    },
    hotelNumRatings: {
      color: 'blue', 
    },
    
    
    bottomMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 15,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      backgroundColor: 'blue',
    },
    
  });
export default HotelHomeScreen;