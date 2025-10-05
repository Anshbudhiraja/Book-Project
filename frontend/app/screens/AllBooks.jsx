import React, { useEffect, useState } from "react";
import { View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,Alert,SafeAreaView } from "react-native";
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AllBooksScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    const getUser = async () => {
      const data = await AsyncStorage.getItem("auth")  
      const auth = JSON.parse(data) || null
      if(!auth || !auth.token) return navigation.navigate("Home")
      setToken(auth.token);
    };
    getUser();
  }, [navigation]);

const fetchBooks = async () => {
try {
    const response = await fetch(`${API_URL}/api/books/getAllBooks?page=${page}`);
    const result = await response.json();
    if(response.status===200) {
        setBooks(result.data);
        setTotalPages(result.totalPages);
    } else {
        setBooks([])
        setTotalPages(1)
    }
} catch (error) {
    Alert.alert("Error occured", "Failed to fetch books");
}
};

  useEffect(() => {
    fetchBooks();
  }, [page,token]);  

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📚 Book Management</Text>

      <FlatList data={books} keyExtractor={(item) => item._id} renderItem={({ item }) => (
         <TouchableOpacity onPress={() => navigation.navigate("BookDetails", { bookId: item._id })}>
            <View style={styles.bookCard}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text>Author: {item.author}</Text>
              <Text>Genre: {item.genre}</Text>
              <Text>Year: {item.publishedYear}</Text>
              <Text style={styles.desc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}/>

      <View style={styles.pagination}>
        <TouchableOpacity onPress={prevPage} disabled={page === 1} style={[styles.pageBtn, page === 1 && { backgroundColor: "#ccc" }]}>
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}> Page {page} / {totalPages}</Text>
        <TouchableOpacity onPress={nextPage} disabled={page === totalPages} style={[styles.pageBtn, page === totalPages && { backgroundColor: "#ccc" }]}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AllBooksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  form: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  bookCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  bookTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  desc: { color: "#666", marginTop: 4 },
  actionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pageBtn: {
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 6,
  },
  pageText: { fontSize: 16 },
});