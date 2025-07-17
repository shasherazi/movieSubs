import React, { useRef, useEffect } from "react";
import { FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Caption } from "../utils/parseSRT";

type CaptionsLyricsProps = {
  captions: Caption[];
  currentIndex: number;
  onJumpTo: (time: number) => void;
};

export default function CaptionsLyrics({
  captions,
  currentIndex,
  onJumpTo,
}: CaptionsLyricsProps) {
  const listRef = useRef<FlatList>(null);

  // Scroll to current caption, retry if not measured yet
  useEffect(() => {
    if (listRef.current && currentIndex >= 0) {
      listRef.current.scrollToIndex({
        index: currentIndex,
        viewPosition: 0.5, // Center in view
        animated: true,
      });
    }
  }, [currentIndex]);

  // Handle error if item not measured yet
  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
  }) => {
    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToIndex({
          index: info.index,
          viewPosition: 0.5,
          animated: true,
        });
      }
    }, 100);
  };

  return (
    <FlatList
      ref={listRef}
      data={captions}
      keyExtractor={(item: Caption) => item.id.toString()}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => onJumpTo(item.start)}
          activeOpacity={0.7}
          style={styles.captionContainer}
        >
          <Text
            style={[
              styles.caption,
              index === currentIndex
                ? styles.currentCaption
                : styles.otherCaption,
            ]}
          >
            {item.text.trim()}
          </Text>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      initialScrollIndex={currentIndex}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 32,
    paddingLeft: 20,
    alignItems: "flex-start",
  },
  captionContainer: {
    padding: 8,
    width: "100%",
    alignItems: "center",
  },
  caption: {
    fontSize: 20,
    textAlign: "left",
    fontWeight: "bold",
    maxWidth: "90%",
  },
  currentCaption: {
    color: "#fff",
  },
  otherCaption: {
    color: "#666",
  },
});
