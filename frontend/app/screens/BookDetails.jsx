import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, SafeAreaView} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState({});
  const [avgRating, setAvgRating] = useState(0)
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [token, setToken] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("auth");
      const auth = JSON.parse(data) || null;
      if (!auth || !auth.token) return navigation.navigate("Home");
      setToken(auth.token);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBookDetails(); 
      fetchBook();
    }
  }, [token]);

  const fetchBookDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${bookId}`, {
        method:"get",
        headers: { "Authorization": token,"Content-Type":"application/json" }, 
      });
      const result = await response.json();
      if (response.status === 200) {
        setReviews(result.reviews || []);
      } else {
        Alert.alert("Error occured", result.message || "Failed to fetch reviews");
      }
    } catch (error) {
      Alert.alert("Error occured", "Something went wrong");
    }
  };

  const fetchBook = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/getBook/${bookId}`, {
        method:"get",
        headers: { "Authorization": token,"Content-Type":"application/json" }, 
      });
      const result = await response.json();
      if (response.status === 200) {
        setBook(result.data);
        setAvgRating(result.avgRating)
      } else {
        await AsyncStorage.removeItem("auth")
        navigation.navigate("Home")
        Alert.alert("Error occured", result.message || "Failed to fetch reviews");
      }
    } catch (error) { 
      Alert.alert("Error occured", "Something went wrong");
    }
  };

  const handleAddReview = async () => {
    if (!rating) return Alert.alert("Error occured", "Please select a star rating");
    if (!reviewText.trim()) return Alert.alert("Error occured", "Review cannot be empty");
    
    try {
      const response = await fetch(`${API_URL}/api/reviews/addReview/${bookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ rating, text: reviewText }),
      });

      const result = await response.json();
      if (response.status === 201) {
        Alert.alert("Success", result.message);
        setReviewText("");
        setRating(0);
        fetchBookDetails();
        fetchBook();
      } else {
        Alert.alert("Error occured", result.message || "Failed to add review");
      }
    } catch (err) {
      Alert.alert("Error occured", "Something went wrong");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/deleteReview/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: token,"Content-Type":"application/json" },
      });
      const result = await response.json();
      if (response.status === 200) {
        Alert.alert("Success",result.message)
        await fetchBookDetails();
      } else {
        Alert.alert("Error occured", result.message);
      }
    } catch (err) {
      Alert.alert("Error occured", "Failed to delete review");
    }
  };

  const renderStars = (count) => {
    return (
      <View style={{ flexDirection: "row" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Icon key={i} name={i <= count ? "star" : "star-outline"} size={20} color="#FFD700"/>
        ))}
      </View>
    );
  };

  const handleStarPress = (val) => {
    setRating(val);
  };

  const handleUpdateReview = async () => {
  if (!rating) return Alert.alert("Error", "Please select a star rating");
  if (!reviewText.trim()) return Alert.alert("Error", "Review cannot be empty");

  try {
    const response = await fetch(`${API_URL}/api/reviews/updateReview/${editingReviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ rating, text: reviewText }),
    });
    const result = await response.json();
    if (response.status === 200) {
      Alert.alert("Success", result.message);
      setReviewText("");
      setRating(0);
      setEditingReviewId(null);
      fetchBookDetails();
    } else {
      Alert.alert("Error occured", result.message || "Failed to update review");
    }
  } catch (err) {
    Alert.alert("Error occured", "Something went wrong");
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{book.title || "Book Details"}</Text>
      <Text>Author: {book.author}</Text>
      <Text>Genre: {book.genre}</Text>
      <Text>Year: {book.publishedYear}</Text>
      <Text style={styles.desc}>{book.description}</Text>
      <Text style={styles.header}>⭐ Reviews (Average Rating:- {avgRating})</Text>

      <FlatList data={reviews} keyExtractor={(item) => item._id} renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={{ flex: 1 }}>
              {renderStars(item.rating)}
              <Text style={styles.reviewText}>{item.text}</Text>
              <Text style={styles.userInfo}>
                by {item.user?.name || "Anonymous"}
              </Text>
            </View>

            {item.user?._id && (
        <View style={{ flexDirection: "row" }}>
    <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: "#FFA500", marginRight: 5 }]} onPress={() => { setEditingReviewId(item._id); setReviewText(item.text); setRating(item.rating);}}>
      <Text style={{ color: "#fff" }}>Edit</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteReview(item._id)}>
      <Text style={{ color: "#fff" }}>Delete</Text>
    </TouchableOpacity>
  </View>
)}
          </View>
        )}
      />

      <Text style={styles.addHeader}>Add Your Review</Text>
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
            <Icon name={i <= rating ? "star" : "star-outline"} size={28} color="#FFD700" style={{ marginHorizontal: 3 }} />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input} placeholder="Write your review..." value={reviewText} onChangeText={setReviewText} multiline/>

  <TouchableOpacity style={styles.addButton} onPress={editingReviewId ? handleUpdateReview : handleAddReview}>
  <Text style={styles.btnText}>{editingReviewId ? "Update Review" : "Submit Review"}</Text>
</TouchableOpacity>

    </SafeAreaView>
  );
};

export default BookDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  desc: { color: "#666", marginBottom: 10 },
  header: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  reviewCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteBtn: { backgroundColor: "#ff3b30", padding: 6, borderRadius: 5 },
  reviewText: { fontSize: 15, marginVertical: 4 },
  userInfo: { color: "#666", fontSize: 12 },
  starContainer: { flexDirection: "row", marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    minHeight: 60,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  addHeader: { fontSize: 16, fontWeight: "600", marginTop: 15 },
});
