import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { theme } from "../core/theme";

const ChatSendButton = ({ mode, style, children, ...props }) => (
  <PaperButton
    style={[
      styles.button,
      mode === "outlined" && { backgroundColor: theme.colors.surface },
      style
    ]}
    labelStyle={[
      styles.text,
      mode === "contained" && { color: theme.colors.surface }
    ]}
    mode={mode}
    {...props}
  >
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: 20,  // Explicit width set for "Send" button
    marginVertical: 10,
    justifyContent: 'center',  // Ensure text is centered
  },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 26,
    textAlign: 'center',  // Center the text
  }
});

export default memo(ChatSendButton);
