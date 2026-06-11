import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  icon?: string;
}

export const Button = ({ title, onPress, variant = "primary", icon }: ButtonProps) => {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? styles.primaryButton
          : styles.secondaryButton,
        { opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isPrimary ? "#F0F4FF" : "#00D4FF" },
        ]}
      >
        {icon} {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#00D4FF",
    shadowColor: "#00D4FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00D4FF",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "JetBrainsMono_Regular",
  },
});