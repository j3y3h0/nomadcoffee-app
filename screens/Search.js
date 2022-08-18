import React, { useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { gql, useLazyQuery } from "@apollo/client";
import styled from "styled-components/native";
import DismissKeyboard from "../components/DismissKeyboard";
import CoffeeShop from "../components/CoffeeShop";
import { client } from "../apollo";
import { light } from "../shared";

const SEARCH_QUERY = gql`
  query searchCoffeeShop($keyword: String!, $coffeeShopLastId: Int) {
    searchCoffeeShop(keyword: $keyword, coffeeShopLastId: $coffeeShopLastId) {
      id
      name
      user {
        id
        username
        name
        avatarUrl
      }
      photos {
        id
        url
      }
      categories {
        id
        name
        slug
      }
    }
  }
`;

const Input = styled.TextInput`
  background-color: ${(props) => props.theme.transparent};
  padding: 6px 8px;
  margin-bottom: 6px;
  border-radius: 5px;
  color: ${(props) => props.theme.fontColor};
  width: ${(props) => props.width / 1.095}px;
  align-self: center;
`;

const MessageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 50px;
`;

const MessageText = styled.Text`
  margin-top: 20px;
  font-size: 16px;
  font-weight: 700;
`;

export default function Search({ navigation }) {
  const { width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState({ keyword: "" });
  const [startQueryFn, { loading, data, called, fetchMore, refetch }] =
    useLazyQuery(SEARCH_QUERY);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleSubmit = (nativeEvent) => {
    /*
      https://reactnative.dev/docs/textinput#onsubmitediting
    */
    if (nativeEvent.text.length > 0) {
      startQueryFn({
        variables: {
          keyword: searchKeyword.keyword,
        },
      });
    }
  };

  const SearchBox = () => (
    <Input
      width={width}
      placeholderTextColor={light ? "#555555" : "#efefef"}
      selectionColor={light ? "#515151" : "#e1e1e1"}
      placeholder="카페 검색"
      autoCapitalize="none"
      returnKeyType="search"
      autoCorrect={false}
      onSubmitEditing={({ nativeEvent }) => handleSubmit(nativeEvent)}
    />
  );

  const renderCoffeeShop = ({ item }) => <CoffeeShop data={item} />;

  return (
    <DismissKeyboard>
      <View>
        {loading ? (
          <MessageContainer>
            <ActivityIndicator
              color={light ? "#101010" : "#fafafa"}
              size={30}
            />
            <MessageText>검색 중..</MessageText>
          </MessageContainer>
        ) : null}
        {!called ? (
          <MessageContainer>
            <MessageText>키워드로 검색</MessageText>
          </MessageContainer>
        ) : null}
        {data?.searchCoffeeShop !== undefined ? (
          data?.searchCoffeeShop.length === 0 ? (
            <MessageContainer>
              <MessageText>아무것도 찾을 수 없습니다.</MessageText>
            </MessageContainer>
          ) : (
            <FlatList
              onEndReachedThreshold={0.02}
              onEndReached={() =>
                fetchMore({
                  variables: {
                    coffeeShopLastId:
                      data?.searchCoffeeShop[data?.searchCoffeeShop.length - 1]
                        .id,
                  },
                })
              }
              refreshing={refreshing}
              onRefresh={() => {
                refresh();
              }}
              style={{ width: "100%" }}
              showsVerticalScrollIndicator={false}
              data={data?.searchCoffeeShop}
              renderItem={renderCoffeeShop}
              keyExtractor={(coffeeShop) => `${coffeeShop.id}`}
            />
          )
        ) : null}
      </View>
    </DismissKeyboard>
  );
}
