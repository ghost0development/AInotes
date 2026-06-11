import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";

export const Card = ({ children, style, ...props }: ViewProps) => {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: "#111827",
          borderColor: "rgba(0, 212, 255, 0.12)",
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});