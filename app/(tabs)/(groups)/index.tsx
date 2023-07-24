import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";

import React, { useEffect } from "react";
import { Link, useRouter } from "expo-router";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

import { FIRESTORE_DB } from "@/config/FirebaseConfig";
import { useAuth } from "@/context/AuthContext";
import { ScrollView } from "react-native-gesture-handler";

const GroupsPage = () => {
  const [groupCollectionRef, setGroupsCollectionRef] = React.useState(null);

  const [groups, setGroups] = React.useState<
    { id: string; name: string; description: string }[]
  >([]);
  const { user } = useAuth();
  useEffect(() => {
    const ref = collection(FIRESTORE_DB, "groups");
    setGroupsCollectionRef(ref);

    const unsubscribe = onSnapshot(ref, (groups: DocumentData) => {
      console.log(
        "current data"
        // groups
      );
      const groupsdata = groups.docs.map(
        (doc: { id: any; data: () => any }) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        }
      );
      // console.log(groupsdata);

      setGroups(groupsdata);
    });
    return unsubscribe;
  }, []);

  const startGroup = async () => {
    console.log("StartGroup");
    try {
      await addDoc(groupCollectionRef, {
        name: `Group #${Math.floor(Math.random() * 1000)}`,
        description: "This is a chat room",
        creator: user?.uid,
      });
    } catch (error) {
      console.log("Error");
    }
  };

  const router = useRouter();
  // const handlePress = () => {
  //   console.log("Pressed");
  //   router.push("/123");
  // };
  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group) => {
          return (
            <Link key={group.id} href={`/(groups)/${group.id}`} asChild>
              <TouchableOpacity style={styles.groupCard}>
                <Text>{group.name}</Text>
                <Text>{group.description}</Text>
              </TouchableOpacity>
            </Link>
            // <Pressable
            //   key={group.id}
            //   style={{ gap: 12, backgroundColor: "red", margin: 12 }}
            //   onPress={() => {
            //     console.log("Pressed");
            //     router.push(`/groups/${group.id}`);
            //   }}
            // >
            //   <View style={{ gap: 12 }}>
            //     <Text style={{}}>{group.name}</Text>
            //     <Text style={{}}>{group.description}</Text>
            //   </View>
            // </Pressable>
          );
        })}
      </ScrollView>

      <Pressable onPress={startGroup} style={styles.fab}>
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
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  groupCard: {
    padding: 12,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: "white",
    borderRadius: 12,

    // elevation: 4,
  },
});

export default GroupsPage;
