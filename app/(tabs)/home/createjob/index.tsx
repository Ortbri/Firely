import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Platform,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { getAuth } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";

interface ImageObject {
  uri: string;
  id: string;
}
// interface Params {
//   jobTitle: string;
//   description: string;
//   location: string;
//   imageUri: ImageObject[];
// }

const CreateJob = () => {
  const [jobTitle, setJobTitle] = useState("a");
  const [description, setDescription] = useState("b");
  const [location, setLocation] = useState("c");
  const [images, setImages] = useState<ImageObject[]>([]);

  const router = useRouter();

  const nextpage = () => {
    // const imageUris = images.map((image) => image.uri);
    const imageUris = images.map((image) => image.uri);
    const imagesJSON = JSON.stringify(images);
    router.push({
      pathname: "/(tabs)/home/createjob/123",
      params: {
        jobTitle,
        description,
        location,
        // images: images.map((image) => image.uri),
        // images: imageUris,
        imagesJSON,
        // images,
        // imageUri: images.length > 0 ? images[0].uri : null,
        // imageUri: images.length > 1 ? imageUris : imageUris[0],
      },
    });
    console.log("passing params images imageURIS");
  };
  console.log("not passed over: ", jobTitle, description, location, images);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "ios") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          // eslint-disable-next-line no-alert
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const pickImage = async () => {
    try {
      const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        // allowsEditing: true,
        aspect: [4, 3],
        selectionLimit: 3,
        orderedSelection: true,
        quality: 1,
        allowsMultipleSelection: true,
        base64: true, // Add this option to get the base64 data for the images
      });

      if (!canceled && assets.length > 0) {
        const selectedImages = assets.map((asset, index) => ({
          uri: asset.uri,
          id: index.toString(),
          base64: asset.base64, // Include the base64 data in the image object
        })) as ImageObject[];
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  // const pickImage = async () => {
  //   try {
  //     const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       // allowsEditing: true,
  //       aspect: [4, 3],
  //       selectionLimit: 3,
  //       orderedSelection: true,
  //       quality: 1,
  //       allowsMultipleSelection: true,
  //     });

  //     if (!canceled && assets.length > 0) {
  //       const selectedImages = assets.map((asset, index) => ({
  //         uri: asset.uri,
  //         id: index.toString(),
  //       })) as ImageObject[];
  //       setImages((prevImages) => [...prevImages, ...selectedImages]);
  //     }
  //   } catch (error) {
  //     console.error("Error picking image: ", error);
  //   }
  // };
  console.log("images: ", images);
  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={{}}>
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
