import React from "react";
import { ActivityIndicator, View } from "react-native";
import { light } from "../shared";

function Layout({ loading, children }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator color={light ? "#ffffff" : "#000000"} />
      ) : (
        children
      )}
    </View>
  );
}

export default Layout;
