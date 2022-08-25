import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import Upload from "../screens/Upload";
import TabsNav from "./TabsNav";
import UploadNav from "./UploadNav";
import { light } from "../shared";

const Stack = createStackNavigator();

export default function MainNav() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="Tabs">
      <Stack.Screen
        name="Tabs"
        options={{
          headerMode: "screen",
          headerBackTitleVisible: false,
          headerTitle: false,
          headerTransparent: true,
          headerShown: false,
        }}
        component={TabsNav}
      />
      <Stack.Screen
        name="Upload"
        options={{
          headerMode: "screen",
          headerBackTitleVisible: false,
          headerTitle: false,
          headerTransparent: true,
          headerShown: false,
        }}
        component={UploadNav}
      />
      <Stack.Screen
        name="UploadForm"
        options={{
          title: "커피샵 생성",
          headerTintColor: light ? "#000000" : "#ffffff",
          headerBackTitleVisible: false,
          headerLeft: ({ tintColor }) => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                navigation.navigate("Tabs");
                navigation.navigate("Upload");
              }}
            >
              <Ionicons color={tintColor} name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
        }}
        component={Upload}
      />
    </Stack.Navigator>
  );
}
