import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useReactiveVar } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { isLoggedInVar, logUserOut } from "../apollo";
import { light } from "../shared";
import styled from "styled-components/native";
import StackNavFactory from "../components/nav/StackNavFactory";
import AuthNav from "./AuthNav";
import useMe from "../hook/useMe";
import DefaultAvatar from "../components/DefaultAvatar";

const Tabs = createBottomTabNavigator();

const Avatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 32px;
`;

export default function TabsNav() {
  const { data } = useMe();
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: light ? "#262626" : "#ffffff",
        tabBarInactiveTintColor: light ? "#b3b3b3" : "#e1e1e1",
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: light ? "#fafafa" : "#101010",
        tabBarInactiveBackgroundColor: light ? "#fafafa" : "#101010",
        headerStyle: {
          width: "100%",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomColor: light
            ? "rgba(0, 0, 0, 0.2)"
            : "rgba(255, 255, 255, 0.2)",
          backgroundColor: light ? "#FFFFFF" : "#000000",
        },
        headerBackTitleVisible: false,
        headerTitle: false,
        headerTransparent: true,
        headerTintColor: light ? "#000000" : "#FFFFFF",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="HomeTab"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={22}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Home" />}
      </Tabs.Screen>
      <Tabs.Screen
        name="SearchTab"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={22}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Search" />}
      </Tabs.Screen>
      {isLoggedIn ? (
        <Tabs.Screen
          name="CameraTab"
          component={View}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                color={color}
                size={24}
              />
            ),
          }}
          listeners={({ navigation }) => {
            return {
              tabPress: (e) => {
                e.preventDefault();
                navigation.navigate("Upload");
              },
            };
          }}
        />
      ) : null}
      <Tabs.Screen
        name="ProfileTab"
        options={{
          ...(!isLoggedIn && {
            headerBackTitleVisible: false,
            headerTitle: false,
            headerTransparent: true,
            headerTintColor: light ? "#000000" : "#FFFFFF",
            headerShown: false,
          }),
          tabBarIcon: ({ focused, color }) =>
            isLoggedIn ? (
              data?.me?.avatarUrl ? (
                <Avatar
                  resizeMode="contain"
                  source={{ uri: data.me.avatarUrl }}
                />
              ) : (
                <Ionicons name="person" size={20} />
              )
            ) : (
              <Ionicons
                name={focused ? "log-in" : "log-in-outline"}
                color={color}
                size={22}
              />
            ),
        }}
      >
        {isLoggedIn ? () => <StackNavFactory screenName="Profile" /> : AuthNav}
      </Tabs.Screen>
      {isLoggedIn ? (
        <Tabs.Screen
          name="LogoutTab"
          component={View}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? "log-out" : "log-out-outline"}
                color={color}
                size={22}
              />
            ),
          }}
          listeners={({ navigation }) => {
            return {
              tabPress: () => {
                logUserOut(navigation);
              },
            };
          }}
        />
      ) : null}
    </Tabs.Navigator>
  );
}
