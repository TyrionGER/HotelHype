import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';



const CompareScreen = () => {
    const navigation = useNavigation();
    const navigateToMainMenu = () => {
        navigation.navigate('MainMenu');
    };

    return (
        <View style={styles.container}>
          <View style={styles.topMenu}>
            <TouchableOpacity onPress={navigateToMainMenu} style={styles.menuButton}>
              <Text style={[styles.buttonText, { fontSize: 18, color: 'white' }]}>
                Main Menu
              </Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 20, color: 'white' }}>Compare Hotels</Text>
          </View>
    
          
        </View>
      );
    };
    
export default CompareScreen;

const styles = StyleSheet.create({
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
  
});

