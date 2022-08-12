import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

const SERVER_URL = "https://nomad-coffee-j3y3h0.herokuapp.com/graphql";

export const TOKEN = "token";
export const isLoggedInVar = makeVar(false);
export const tokenVar = makeVar("");

export const logUserIn = async (token, navigation) => {
  await AsyncStorage.setItem(TOKEN, token);
  if (tokenVar() === "") {
    tokenVar(token);
  }

  if (navigation) {
    navigation.navigate("Home");
  }

  isLoggedInVar(true);
};

export const logUserOut = async (navigation) => {
  await AsyncStorage.removeItem(TOKEN);
  tokenVar("");
  isLoggedInVar(false);

  if (navigation) {
    navigation.navigate("Home");
  }
};

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});

const uploadLink = createUploadLink({
  uri: SERVER_URL,
});

export const client = new ApolloClient({
  link: ApolloLink.from([authLink, onErrorLink, uploadLink]),
  cache: new InMemoryCache(),
});
