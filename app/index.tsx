import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

export default function HomeScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickSrtFile = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/x-subrip", "application/x-srt"], // SRT MIME type
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        setLoading(false);
        return;
      }

      const fileUri = result.assets[0].uri;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      setLoading(false);

      // Navigate to captions screen, passing the SRT data
      router.push({
        pathname: "/captions",
        params: {
          srt: encodeURIComponent(fileContent),
          filename: result.assets[0].name,
        },
      });
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to load file.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
        accessible
        accessibilityLabel="App logo"
      />
      <Text style={styles.title}>Movie Subtitles Companion</Text>
      <Text style={styles.subtitle}>
        Enjoy movies with real-time captions. Load your subtitle file and get
        started!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={pickSrtFile}
        accessibilityRole="button"
        accessibilityLabel="Pick SRT file"
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Pick SRT File"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 32,
    textAlign: "center",
    maxWidth: 320,
  },
  button: {
    backgroundColor: "#1DB954",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 32,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
