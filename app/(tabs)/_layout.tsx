import React from "react";
import { Tabs } from "expo-router";
import { Button } from "react-native";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../config/FirebaseConfig";

const TabsPage = () => {
  const doLogout = () => {
    console.log("logout");
    signOut(FIREBASE_AUTH);
  };
  return (
    <Tabs>
      <Tabs.Screen
        name="groups"
        options={{
          headerTitle: "Chat Groups",
          headerRight: () => (
            <Button onPress={doLogout} title="Logout"></Button>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsPage;

// import React from "react";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { Link, Tabs } from "expo-router";
// import { Pressable, useColorScheme } from "react-native";

// import Colors from "@/constants/Colors";

// /**
//  * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
//  */
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Tab One",
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//           headerRight: () => (
//             <Link href="/modal" asChild>
//               <Pressable>
//                 {({ pressed }) => (
//                   <FontAwesome
//                     name="info-circle"
//                     size={25}
//                     color={Colors[colorScheme ?? "light"].text}
//                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                   />
//                 )}
//               </Pressable>
//             </Link>
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="two"
//         options={{
//           title: "Tab Two",
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//         }}
//       />
//     </Tabs>
//   );
// }
