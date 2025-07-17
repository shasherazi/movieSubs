import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";

type CaptionsPlayerProps = {
  currentTime: number;
  totalDuration: number;
  playing: boolean;
  onPlayPause: () => void;
  onSync: (ms: number) => void;
  onSeek: (ms: number) => void;
};

function msToTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function CaptionsPlayer({
  currentTime,
  totalDuration,
  playing,
  onPlayPause,
  onSync,
  onSeek,
}: CaptionsPlayerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Text style={styles.timeText}>{msToTime(currentTime)}</Text>
        <Slider
          style={{ flex: 1, marginHorizontal: 8 }}
          minimumValue={0}
          maximumValue={totalDuration}
          value={currentTime}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#333"
          thumbTintColor="#1DB954"
          onSlidingComplete={onSeek}
        />
        <Text style={[styles.timeText, { marginLeft: 4 }]}>
          {msToTime(totalDuration)}
        </Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => onSync(-50)}
          style={styles.syncButton}
          accessibilityLabel="Sync back 50 milliseconds"
        >
          <Text style={styles.syncText}>–50ms</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlayPause}
          style={styles.playPauseButton}
          accessibilityLabel={playing ? "Pause" : "Play"}
        >
          <MaterialIcons
            name={playing ? "pause" : "play-arrow"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSync(50)}
          style={styles.syncButton}
          accessibilityLabel="Sync forward 50 milliseconds"
        >
          <Text style={styles.syncText}>+50ms</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    paddingTop: 8,
  },
  timeText: {
    color: "#ccc",
    fontSize: 14,
    width: 56,
    textAlign: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 32,
  },
  playPauseButton: {
    backgroundColor: "#1DB954",
    borderRadius: 32,
    padding: 18,
    marginHorizontal: 16,
    elevation: 2,
  },
  syncButton: {
    backgroundColor: "#333",
    borderRadius: 24,
    padding: 14,
  },
  syncText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
