// app/captions.tsx
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { parseSRT, Caption } from "../utils/parseSRT";
import CaptionsLyrics from "../components/CaptionsLyrics";
import CaptionsPlayer from "../components/CaptionsPlayer";

export default function CaptionsScreen() {
  const params = useLocalSearchParams();
  const srt = params.srt ? decodeURIComponent(params.srt as string) : "";
  const filename = params.filename || "Subtitles.srt";
  const captions: Caption[] = parseSRT(srt);

  const [playing, setPlaying] = useState(true);
  const [startTimestamp, setStartTimestamp] = useState(Date.now());
  const [pausedOffset, setPausedOffset] = useState(0);
  const [syncOffset, setSyncOffset] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const handleJumpTo = (time: number) => {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key);
    setPausedOffset(time);
    setStartTimestamp(Date.now());
    setCurrentTime(time + syncOffset);
  };

  const handleSeek = (ms: number) => {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Drag_Start);
    setPausedOffset(ms);
    setStartTimestamp(Date.now());
    setCurrentTime(ms + syncOffset);
  };

  // Find current caption index
  const currentIndex = captions.findIndex(
    (c) =>
      currentTime + syncOffset >= c.start && currentTime + syncOffset <= c.end,
  );

  // Timer: 50ms interval for smoothness
  useEffect(() => {
    let animationFrame: number;

    const update = () => {
      if (playing) {
        setCurrentTime(Date.now() - startTimestamp + pausedOffset + syncOffset);
        animationFrame = requestAnimationFrame(update);
      }
    };

    if (playing) {
      animationFrame = requestAnimationFrame(update);
    } else {
      setCurrentTime(pausedOffset + syncOffset);
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [playing, startTimestamp, pausedOffset, syncOffset]);

  // Progress bar
  const totalDuration = captions.length ? captions[captions.length - 1].end : 1;

  // Controls
  const handlePlayPause = () => {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key);
    if (playing) {
      // Pausing: update pausedOffset
      setPausedOffset((prev) => prev + (Date.now() - startTimestamp));
      setPlaying(false);
    } else {
      // Resuming: set new startTimestamp
      setStartTimestamp(Date.now());
      setPlaying(true);
    }
  };

  const handleSync = (ms: number) => {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key);
    setSyncOffset((prev) => prev + ms);
  };

  // Back button
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <Text style={styles.fileName} numberOfLines={1}>
          {filename}
        </Text>
        <View style={styles.closeButtonContainer}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Close"
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>
      </View>

      {/* Captions */}
      <View style={{ flex: 1 }}>
        <CaptionsLyrics
          captions={captions}
          currentIndex={currentIndex}
          onJumpTo={handleJumpTo}
        />
      </View>

      {/* Player */}
      <CaptionsPlayer
        currentTime={currentTime}
        totalDuration={totalDuration}
        playing={playing}
        onPlayPause={handlePlayPause}
        onSync={handleSync}
        onSeek={handleSeek}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181818",
    paddingTop: 36,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 56,
  },
  fileName: {
    flex: 2,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  closeButton: {
    backgroundColor: "#222",
    borderRadius: 20,
    elevation: 2,
    width: 40,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 28,
    textAlign: "center",
    lineHeight: 40,
  },
  movieTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
});
