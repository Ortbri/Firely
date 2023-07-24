import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { getAuth } from "firebase/auth";

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const router = useRouter();
  const handleButtonClick = async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userId = user.uid;
        const docRef = await addDoc(collection(FIRESTORE_DB, "job-posts"), {
          jobTitle,
          description,
          location,
          userId,
        });
        console.log("Job post created with ID: ", docRef.id);
        resetForm();
        router.back();
      } else {
        console.error("User not authenticated.");
      }
    } catch (error) {
      console.error("Error creating job post: ", error);
    }
  };

  const resetForm = () => {
    setJobTitle("");
    setDescription("");
    setLocation("");
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Create Job</Text> */}
      <TextInput
        placeholder="Job Title"
        value={jobTitle}
        onChangeText={setJobTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline={true}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />
      <Button title="Create Job" onPress={handleButtonClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 180,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 10,
    paddingLeft: 10,
    padding: 12,
  },
});

export default CreateJob;
