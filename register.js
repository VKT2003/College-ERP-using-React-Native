import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from './firebase';

import { LinearGradient } from "expo-linear-gradient";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleRegister = async () => {
    try {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile with the provided name
      await updateProfile(userCredential.user, { displayName: name });

      navigation.navigate('Login');
    } catch (error) {
      // Handle registration error
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('Email already exists. Please use a different email.');
      } else {
        setErrorMessage('Registration failed. Please try again later.');
      }
    }
  };

  return (
    <LinearGradient
    colors={["rgba(200,255,243,1)", "rgba(255,144,213,1)"]}
    start={{ x: 0, y: 0.5 }}
    end={{ x: 1, y: 0.5 }}
      style={styles.container}
    >
    <View style={styles.container}>
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go to Attendance Dashboard</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: 'black',
    borderWidth:1.5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
    padding: 10,

  },
  button: {
    width: 250,
    backgroundColor: '#008099',
    padding: 12,
    borderRadius: 15,
    margin: 3,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Register;
