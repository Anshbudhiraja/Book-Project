import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);

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
    if(token){
    try {
      const response = await fetch(`${API_URL}/api/books?page=${page}`,{
        method:"get",
        headers:{
          "Content-Type":"application/json",
          "Authorization":token
        }
      });
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
  }
};

  useEffect(() => {
    fetchBooks();
  }, [page,token]);  

  const handleAddBook = async () => {
    if(!token) return navigation.navigate("Home")

    try {
      const response = await fetch(`${API_URL}/api/books/add`, {method: "POST",headers: {"Content-Type": "application/json",Authorization: `${token}`,},
        body: JSON.stringify({title,author,description,genre,publishedYear}),
      });

      const result = await response.json();
      if (response.status===201) {
        Alert.alert("Success", result.message);
        setTitle("");setAuthor("");setDescription("");setGenre("");setPublishedYear("");fetchBooks();
      } else {
        Alert.alert("Error occured", result.message || "Failed to add book");
      }
    } catch (error) {
      Alert.alert("Error occured", "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      if(!token) return navigation.navigate("Home")
      const response = await fetch(`${API_URL}/api/books/delete/${id}`, {
        method: "Delete",
        headers: { Authorization: `${token}` },
      });
      const result = await response.json();
      if (response.status===200) {
        Alert.alert("Deleted", result.message);
        fetchBooks();
      } else {
        Alert.alert("Error occured", result.message);
      }
    } catch (err) {
      Alert.alert("Error occured", "Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setEditMode(true);
    setEditingBookId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.description);
    setGenre(book.genre);
    setPublishedYear(String(book.publishedYear));
  };

  const handleUpdateBook = async () => {
    if (!token || !editingBookId) return;

    try {
      const response = await fetch(`${API_URL}/api/books/update/${editingBookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${token}`,
        },
        body: JSON.stringify({title,author,description, genre, publishedYear}),
      });

      const result = await response.json();
      if (response.status === 200) {
        Alert.alert("Updated", result.message);
        resetForm();
        fetchBooks();
      } else {
        Alert.alert("Error occurred", result.message || "Failed to update");
      }
    } catch (error) {
      Alert.alert("Error occurred", "Something went wrong");
    }
  };

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setGenre("");
    setPublishedYear("");
    setEditMode(false);
    setEditingBookId(null);
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>📚 Book Management</Text>

      {/* Add Book Form */}
      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Author"
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          placeholder="Description"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          placeholder="Genre"
          style={styles.input}
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          placeholder="Published Year"
          style={styles.input}
          keyboardType="numeric"
          value={publishedYear}
          onChangeText={setPublishedYear}
        />

        {editMode ? (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: "#28a745", flex: 1, marginRight: 5 }]} onPress={handleUpdateBook}>
              <Text style={styles.btnText}>Update Book</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: "#6c757d", flex: 1 }]} onPress={resetForm}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
            <Text style={styles.btnText}>Add Book</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList data={books}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text>Author: {item.author}</Text>
            <Text>Genre: {item.genre}</Text>
            <Text>Year: {item.publishedYear}</Text>
            <Text style={styles.desc}>{item.description}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#007bff" }]} onPress={() => handleEdit(item)}>
                <Text style={{ color: "#fff" }}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#ff3b30" }]} onPress={() => handleDelete(item._id)}>
                <Text style={{ color: "#fff" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}/>

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={prevPage}
          disabled={page === 1}
          style={[styles.pageBtn, page === 1 && { backgroundColor: "#ccc" }]}
        >
          <Text>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.pageText}>
          Page {page} / {totalPages}
        </Text>
        <TouchableOpacity
          onPress={nextPage}
          disabled={page === totalPages}
          style={[styles.pageBtn, page === totalPages && { backgroundColor: "#ccc" }]}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

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