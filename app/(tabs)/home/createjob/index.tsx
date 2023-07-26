import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";

interface ImageObject {
  uri: string;
  id: string;
}
interface Params {
  jobTitle: string;
  description: string;
  location: string;
  imageUri: ImageObject[];
}

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState("a");
  const [description, setDescription] = useState("b");
  const [location, setLocation] = useState("c");
  const [images, setImages] = useState<ImageObject[]>([]);

  const router = useRouter();

  const nextpage = () => {
    router.push({
      pathname: "/(tabs)/home/createjob/123",
      params: { jobTitle, description, location, imageUri: images },
    });
  };
  console.log("not passed over: ", jobTitle, description, location, images);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,

      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled && result.assets.length > 0) {
      // Map the selected assets to objects containing uri and id
      const selectedImages = result.assets.map((asset, index) => ({
        uri: asset.uri,
        id: index.toString(), // Use the index as the id for simplicity
      })) as ImageObject[];
      setImages((prevImages: ImageObject[]) => [
        ...prevImages,
        ...selectedImages,
      ]);
    }
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>Create Job</Text> */}
      <ScrollView horizontal>
        {images.map((image) => (
          <Image
            key={image.id}
            source={{ uri: image.uri }}
            style={styles.image}
          />
        ))}
      </ScrollView>
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
      {/* <Button title="Create Job" onPress={} /> */}
      <Button title="Pick an image from camera roll" onPress={pickImage} />

      <Button title="nxt page" onPress={nextpage} />
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
  image: {
    width: 200,
    height: 200,
    margin: 5,
    borderRadius: 10,
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

// const handleButtonClick = async () => {
//   try {
//     const user = getAuth().currentUser;
//     if (user) {
//       const userId = user.uid;
//       const docRef = await addDoc(collection(FIRESTORE_DB, "job-posts"), {
//         jobTitle,
//         description,
//         location,
//         userId,
//       });
//       console.log("Job post created with ID: ", docRef.id);
//       resetForm();
//       router.back();
//     } else {
//       console.error("User not authenticated.");
//     }
//   } catch (error) {
//     console.error("Error creating job post: ", error);
//   }
// };
// const resetForm = () => {
//   setJobTitle("");
//   setDescription("");
//   setLocation("");
// };
