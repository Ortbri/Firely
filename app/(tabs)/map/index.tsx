import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import MapView, { Circle } from "react-native-maps";

const Map = () => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.62396952796919,
    latitudeDelta: 0.046513505890821705,
    longitude: -96.95886549758531,
    longitudeDelta: 0.03373123321509297,
  });

  const ShowRadius = (radius: number) => {
    return (
      <View>
        <Circle
          center={mapRegion}
          radius={200}
          strokeColor="#ffbb00"
          strokeWidth={2}
          fillColor="rgba(255, 187, 0, 0.2)"
        />
      </View>
    );
  };

  const handleLocationSearch = async (address: string) => {
    const coordinates = await getLocationCoordinates(address);
    if (coordinates) {
      setMapRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.046513505890821705,
        longitudeDelta: 0.03373123321509297,
      });
    }
  };

  const getLocationCoordinates = async (address: string | number | boolean) => {
    const apiKey = "AIzaSyADMIg4Sbfrq6mWCGZTc3JXkoLbPtBEuuo"; // Replace with your actual API key
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Your UI elements here */}
        {/* For example, a TextInput for users to enter the address */}
        <TextInput
          onChangeText={handleLocationSearch} // Call handleLocationSearch when the address is entered
          placeholder="Enter address"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 10,
            margin: 10,
            borderRadius: 12,
          }}
        />

        <View
          style={{
            borderRadius: 12,
            // paddingTop: 200,
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
            {ShowRadius()}
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Map;
