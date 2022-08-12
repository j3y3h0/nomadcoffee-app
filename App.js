import React, { useState, useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainNav from "./navigators/MainNav";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { ThemeProvider } from "styled-components/native";
import { ApolloProvider } from "@apollo/client";
import { tokenVar, isLoggedInVar, TOKEN, client } from "./apollo";
import { useColorScheme } from "react-native";
import {
  darkTheme,
  lightTheme,
  navigationLightTheme,
  navigationDarkTheme,
} from "./styles";

//SplashScreen.preventAutoHideAsync();

function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function prepare() {
      try {
        const token = await AsyncStorage.getItem(TOKEN);

        if (token) {
          isLoggedInVar(true);
          tokenVar(token);
        }

        const imagesToLoad = [
          require("./assets/no-profile.png"),
          require("./assets/logo-yellow.png"),
          require("./assets/logo-white.png"),
        ];
        const imagePromises = imagesToLoad.map((image) =>
          Asset.loadAsync(image)
        );

        const fontsToLoad = [Ionicons.font];
        const fontPromises = fontsToLoad.map((font) => Font.loadAsync(font));

        return Promise.all([...fontPromises, ...imagePromises]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
        <NavigationContainer
          theme={
            colorScheme === "light" ? navigationLightTheme : navigationDarkTheme
          }
        >
          <MainNav onLayout={onLayoutRootView} />
        </NavigationContainer>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
