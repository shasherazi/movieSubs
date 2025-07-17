// components/CaptionsPlayer.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CaptionsPlayerProps = {
  currentTime: number;
  totalDuration: number;
  playing: boolean;
  onPlayPause: () => void;
  onSync: (ms: number) => void;
};

function msToTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function CaptionsPlayer({
  currentTime,
  totalDuration,
  playing,
  onPlayPause,
  onSync,
}: CaptionsPlayerProps) {
  return (
    <View>
      <View style={styles.progressBarContainer}>
        <Text style={styles.timeText}>{msToTime(currentTime)}</Text>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min((currentTime / totalDuration) * 100, 100)}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.timeText}>{msToTime(totalDuration)}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => onSync(-1000)}
          style={styles.syncButton}
          accessibilityLabel="Sync back 1 second"
        >
          <Text style={styles.syncText}>–1s</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPlayPause}
          style={styles.playPauseButton}
          accessibilityLabel={playing ? "Pause" : "Play"}
        >
          <Text style={styles.playPauseText}>{playing ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSync(1000)}
          style={styles.syncButton}
          accessibilityLabel="Sync forward 1 second"
        >
          <Text style={styles.syncText}>+1s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#333",
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#1DB954",
    borderRadius: 3,
  },
  timeText: {
    color: "#ccc",
    fontSize: 14,
    width: 40,
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
  playPauseText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
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
