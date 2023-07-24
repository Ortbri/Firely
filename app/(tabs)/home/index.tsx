import React, { useState, useEffect } from "react";
import { View, Button, Text, StyleSheet, Pressable } from "react-native";
import { collection, getDocs, addDoc } from "firebase/firestore";
import JobPostList, { JobPost } from "@/app/components/JobPostList";
import { useIsFocused } from "@react-navigation/native";

import { useRouter } from "expo-router";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";

const HomePage = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, "job-posts")
      );
      const fetchedJobPosts: JobPost[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobPosts.push({ id: doc.id, ...doc.data() } as JobPost);
      });
      setJobPosts(fetchedJobPosts);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }

    setRefreshing(false);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchJobPosts();
  }, [isFocused]);

  const fetchJobPosts = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(FIRESTORE_DB, "job-posts")
      );
      const fetchedJobPosts: JobPost[] = [];
      querySnapshot.forEach((doc) => {
        fetchedJobPosts.push({ id: doc.id, ...doc.data() } as JobPost);
      });
      setJobPosts(fetchedJobPosts);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const router = useRouter();
  const createJob = () => {
    router.push("/(tabs)/home/createjob");
  };

  return (
    <View style={styles.container}>
      <JobPostList jobPosts={jobPosts} />
      <Text>Home page stuff</Text>
      <Pressable onPress={createJob} style={styles.fab}>
        <Text style={{ color: "white", fontSize: 24 }}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#ffbb00",
    borderRadius: 30,
    elevation: 8,
  },
});

export default HomePage;
