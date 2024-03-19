import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Platform } from 'react-native';
import { auth, firebase } from '../firebase';
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered in with: ', user.email);

        const db = firebase.firestore();
        db.collection('user').doc(user.uid).set({
          restaurantOwner: false
        })
          .then(() => {
            console.log('Benutzer-ID erfolgreich in Firestore gespeichert.');
          })
          .catch((error) => {
            console.error('Fehler beim Speichern der Benutzer-ID:', error);
          });
      })
      .catch(error => alert(error.message));
  };

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with: ', user.email);
      })
      .catch(error => alert(error.message));
  };

  const handleForgotPassword = () => {
    navigation.replace('ForgotPassword');
    console.log('Forgot Password clicked');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}
    >
    <View style={styles.logoContainer}>
                <Image
                    source={require('../logo/Logo1.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>  
    
    

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="E-Mail"
          value={email}
          onChangeText={text => setEmail(text)}
          style={[styles.input, { marginTop: 20 }]}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Passwort"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Anmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Registrieren</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'blue', // Anpassung: Farbe des Rahmens
    borderWidth: 1,
    padding: 15,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'blue', // Anpassung: Farbe des Rahmens
  },
  buttonOutlineText: {
    color: 'blue', // Anpassung: Farbe des Textes
    textAlign: 'center',
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },

  logoContainer: {
    marginTop: 20, // Abstand über dem Home-Button
},
logo: {
    width: 250, // Breite des Logos (anpassen nach Bedarf)
    height: 250, // Höhe des Logos (anpassen nach Bedarf)
},
});

export default LoginScreen;
