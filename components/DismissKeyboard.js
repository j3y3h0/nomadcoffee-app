import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

function DismissKeyboard({ children }) {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback
      style={{ height: "100%" }}
      onPress={dismissKeyboard}
      disabled={Platform.OS === "web"}
    >
      {children}
    </TouchableWithoutFeedback>
  );
}

export default DismissKeyboard;
