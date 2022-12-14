import React from "react";
import { Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../../screens/Home";
import Search from "../../screens/Search";
import Profile from "../../screens/Profile";
import { light } from "../../shared";

const Stack = createStackNavigator();

function StackNavFactory({ screenName }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: light ? "#000000" : "#FFFFFF",
        headerStyle: {
          elevation: 1,
          shadowColor: light
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(255, 255, 255, 0.2)",
          backgroundColor: light ? "#FFFFFF" : "#000000",
        },
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen
          name={"Home"}
          component={Home}
          options={{
            headerTitle: () => (
              <Image
                resizeMode="contain"
                style={{
                  maxWidth: "50%",
                  alignSelf: "center",
                  marginHorizontal: "100%",
                }}
                source={
                  light
                    ? require("../../assets/logo-yellow.png")
                    : require("../../assets/logo-white.png")
                }
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name={"Search"} component={Search} />
      ) : null}
      {screenName === "Profile" ? (
        <Stack.Screen name={"Profile"} component={Profile} />
      ) : null}
    </Stack.Navigator>
  );
}

export default StackNavFactory;
