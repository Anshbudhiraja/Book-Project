import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async() => {
    try {
      const response = await fetch(`${API_URL}/api/auth/createUser`,{
      method:"post",
      body:JSON.stringify({name,email,password}),
      headers:{
        "Content-Type":"application/json"
      }
    })
    
    const result = await response.json()
    if(response.status===201){
      Alert.alert("Success", result.message)
      await AsyncStorage.setItem("auth",JSON.stringify({token:result.token}))
      navigation.navigate("Dashboard");
    }else{
      Alert.alert("Error Occured",result.message);
    }
    } catch (error) {
      Alert.alert("Error Occured","server is not responding") 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={handleSignup}>
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.btnText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  box: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  btn: {
    backgroundColor: "slateblue",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  btn2: {
    marginTop:"10",
    backgroundColor: "slateblue",
    padding:"10",
    alignItems:"center",
    borderRadius:8
  },
});
