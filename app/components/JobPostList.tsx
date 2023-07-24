import React, { useState, useEffect } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";

interface JobPost {
  id: string;
  jobTitle: string;
  description: string;
  location: string;
  userId: string;
}

interface JobPostListProps {
  jobPosts: JobPost[];
  // onRefresh: () => void;
  // refreshing: boolean;
}

const JobPostList: React.FC<JobPostListProps> = ({
  jobPosts,
  // onRefresh,
  // refreshing,
}) => {
  const renderJobPostItem = ({ item }: { item: JobPost }) => (
    <View
      style={{
        backgroundColor: "lightgrey",
        padding: 12,
        margin: 12,

        borderRadius: 12,
      }}
    >
      <View>
        <Text style={{ textAlign: "center" }}>Insert Image</Text>
      </View>
      <Text style={{ fontSize: 24 }}>Job Post by UID:{item.userId}</Text>
      <Text style={{ fontSize: 16 }}>Title: {item.jobTitle}</Text>
      <Text style={{ fontSize: 16 }}>Description: {item.description}</Text>
      <Text style={{ fontSize: 16 }}>Company: {item.location}</Text>
    </View>
  );

  return (
    <FlatList
      data={jobPosts}
      renderItem={renderJobPostItem}
      keyExtractor={(item) => item.id}
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      contentContainerStyle={{}}
    />
  );
};

export default JobPostList;
