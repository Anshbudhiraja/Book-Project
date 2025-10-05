import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DashboardScreen from "../screens/Dashboard";
import AllBooksScreen from "../screens/AllBooks";
import LoginScreen from "../screens/Login";

const Tab = createBottomTabNavigator();

const DashboardTabs = ({navigation}) => {
  return (
    <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
          paddingBottom: 5,
        }}}>
      <Tab.Screen name="AllBooks" component={AllBooksScreen} options={{
          tabBarLabel: "Books",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-outline" color={color} size={size} />
          ),}}/>

      <Tab.Screen name="DashboardScreen" component={DashboardScreen} options={{
          tabBarLabel: "Your Books",
          tabBarIcon: ({ color, size }) => (
            <Icon name="add-circle-outline" color={color} size={size} />
          ),}}/>

      <Tab.Screen name="HomeTab" component={LoginScreen}  options={{
          tabBarLabel: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Icon name="log-out-outline" color={color} size={size} />
          ),}} listeners={{ tabPress: async(e) => { e.preventDefault();  await AsyncStorage.removeItem("auth"); navigation.navigate("Home"); },}}/>
    </Tab.Navigator>
  );
};

export default DashboardTabs;
