import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Text,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import MapView, { Circle } from "react-native-maps";

const Map = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.62396952796919,
    latitudeDelta: 0.014513505890821705,
    longitude: -96.95886549758531,
    longitudeDelta: 0.00373123321509297,
  });

  const [streetNumber, setStreetNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [enteredLocation, setEnteredLocation] = useState(null);
  const [enteredAddress, setEnteredAddress] = useState('');

  const locations = [
    {
      id: "1",
      name: "LOCATION 1",
      latitude: 40.62396952796919,
      longitude: -96.95886549758531,
    },
    // Add more locations here...
  ];

 

  const handleLocationSearch = async () => {
   const address = `${streetNumber}, ${city}, ${state}, ${zip}`;
console.log("Address:", address);

const coordinates = await getLocationCoordinates(address);
console.log("Coordinates:", coordinates);
  if (coordinates) {
    // Set the entered location as the new location to show on the map
    setEnteredLocation({
      name: address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    });

    // Update the entered address state with the concatenated address
    setEnteredAddress(address);

    // Update the map region to center on the entered location
    setMapRegion({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.006513505890821705,
      longitudeDelta: 0.0053123321509297,
    });
  }
};

 const getLocationCoordinates = async (address: string | number | boolean) => {
    const apiKey = "AIzaSyADMIg4Sbfrq6mWCGZTc3JXkoLbPtBEuuo";
    const encodedAddress = encodeURIComponent(address);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      } else {
        throw new Error("Location not found.");
      }
    } catch (error) {
      console.error("Error fetching location coordinates:", error.message);
      return null;
    }
  };


  const handleViewLocation = (location) => {
    // Implement navigation to the screen that shows the location details
    // You can use the navigation library of your choice
    console.log("View Location:", location);
  };

  const handleCreateLocation = () => {
    // Implement navigation to the screen for creating a new location
    // You can use the navigation library of your choice
    console.log("Create Location");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Your UI elements here */}
          {/* Separate text input fields for street number, city, state, and country */}
          <TextInput
            onChangeText={setStreetNumber}
            placeholder="Street Number"
            style={styles.input}
            autoComplete="street-address"
            textContentType="streetAddressLine1"
          />
          <TextInput
            onChangeText={setCity}
            placeholder="City"
            style={styles.input}
            textContentType="addressCity"
          />
          <TextInput
            onChangeText={setState}
            placeholder="State"
            style={styles.input}
            textContentType="addressState"

            // autoComplete="state"
          />
          <TextInput
            onChangeText={setZip}
            placeholder="Zip"
            style={styles.input}
            autoComplete="postal-code"
            textContentType="postalCode"
          />

          <View style={{ flexDirection: "row", flex: 1 }}>
            <Pressable onPress={handleLocationSearch} style={styles.button}>
              <Text>Search Location</Text>
            </Pressable>
          </View>

          <View
            style={{
              borderRadius: 12,

            }}
          >
            <MapView
              style={{
                alignSelf: "center",
                height: 400,
                width: "96%",
                borderRadius: 24,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
              region={mapRegion}
            >
              {enteredLocation && ( // Show the entered location if available
                <Circle
                  center={{
                    latitude: enteredLocation.latitude,
                    longitude: enteredLocation.longitude,
                  }}
                  radius={300}
                  strokeColor="#00ff00" // You can customize the stroke color for the entered location
                  strokeWidth={2}
                  fillColor="rgba(0, 255, 0, 0.2)" // You can customize the fill color for the entered location
                />
              )}
            </MapView>
          </View>

          {/* FlatList to display the locations */}
          {/* You can customize this FlatList to show the location details */}
          {/* For example, each item could be a TouchableOpacity to navigate to the location details screen */}
          {/* Replace "handleViewLocation" with the function to navigate to the location details screen */}
          {locations.map((location) => (
            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: '#ccc', padding: 20, margin: 10, borderRadius: 12 }}
              key={location.id}
              onPress={() => handleViewLocation(location)}
            >
              <Text>{location.name}</Text>
            </TouchableOpacity>
          ))}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
    borderRadius: 12,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    margin: 10,
    borderRadius: 12,
    flex: 1,
  },
  secondbutton: {
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    borderRadius: 12,
    flex: 1,
  },
});

export default Map;

// import React, { useState } from "react";
// import {
//   View,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   SafeAreaView,
// } from "react-native";
// import MapView, { Circle } from "react-native-maps";

// const Map = () => {
//   const [mapRegion, setMapRegion] = useState({
//     latitude: 40.62396952796919,
//     latitudeDelta: 0.014513505890821705,
//     longitude: -96.95886549758531,
//     longitudeDelta: 0.00373123321509297,
//   });

//   const ShowRadius = (radius: number) => {
//     return (
//       <View>
//         <Circle
//           center={mapRegion}
//           radius={200}
//           strokeColor="#ffbb00"
//           strokeWidth={2}
//           fillColor="rgba(255, 187, 0, 0.2)"
//         />
//       </View>
//     );
//   };

//   const handleLocationSearch = async (address: string) => {
//     const coordinates = await getLocationCoordinates(address);
//     if (coordinates) {
//       setMapRegion({
//         latitude: coordinates.latitude,
//         longitude: coordinates.longitude,
//         latitudeDelta: 0.046513505890821705,
//         longitudeDelta: 0.4373123321509297,
//       });
//     }
//   };

//   const getLocationCoordinates = async (address: string | number | boolean) => {
//     const apiKey = "AIzaSyADMIg4Sbfrq6mWCGZTc3JXkoLbPtBEuuo"; // Replace with your actual API key
//     const encodedAddress = encodeURIComponent(address);
//     const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

//     try {
//       const response = await fetch(apiUrl);
//       const data = await response.json();

//       if (data.results.length > 0) {
//         const { lat, lng } = data.results[0].geometry.location;
//         return { latitude: lat, longitude: lng };
//       } else {
//         throw new Error("Location not found.");
//       }
//     } catch (error) {
//       console.error("Error fetching location coordinates:", error.message);
//       return null;
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <ScrollView style={styles.container}>
//         {/* Your UI elements here */}
//         {/* For example, a TextInput for users to enter the address */}
//         <TextInput
//           onChangeText={handleLocationSearch} // Call handleLocationSearch when the address is entered
//           placeholder="Enter address"
//           style={{
//             borderWidth: 1,
//             borderColor: "#ccc",
//             padding: 10,
//             margin: 10,
//             borderRadius: 12,
//           }}
//         />

//         <View
//           style={{
//             borderRadius: 12,
//             // paddingTop: 200,
//           }}
//         >
//           <MapView
//             style={{
//               alignSelf: "center",
//               height: 400,
//               width: "96%",
//               borderRadius: 24,
//               borderWidth: 1,
//               borderColor: "#ccc",
//             }}
//             region={mapRegion}
//           >
//             {ShowRadius()}
//           </MapView>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default Map;
