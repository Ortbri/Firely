import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import {
  DocumentData,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useState, useLayoutEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const ChatPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<DocumentData>([]);
  const [message, setMessage] = useState("");

  useLayoutEffect(() => {
    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`);
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (groups: DocumentData) => {
      const messages = groups.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      console.log("Current messages:", messages);

      setMessages(messages);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    const msg = message.trim();
    if (msg.length === 0) return;

    const msgCollectionRef = collection(FIRESTORE_DB, `groups/${id}/messages`);

    await addDoc(msgCollectionRef, {
      message: msg,
      sender: user.uid,
      createdAt: serverTimestamp(),
    });
    setMessage("");
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    const myMessage = item.sender === user.uid;
    return (
      <View
        style={[
          styles.messageContainer,
          myMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
        <Text style={styles.time}>
          {item.createdAt?.toDate().toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    // <KeyboardAvoidingView style={styles.container} behavior={Platform.OS ==== 'ios' ? 'padding' : 'height'}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={styles.messageInput}
          placeholder="hello"
          placeholderTextColor="#ccc"
          multiline
        />
        <Button disabled={message === ""} title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end",
  },
});
export default ChatPage;
