import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { gql, useMutation } from "@apollo/client";
import { ReactNativeFile } from "apollo-upload-client";
import DismissKeyboard from "../components/DismissKeyboard";
import { light } from "../shared";

//#region GraphQL
const CREATE_COFFEE_SHOP_MUTATION = gql`
  mutation createCoffeeShop(
    $name: String!
    $latitude: String!
    $longitude: String!
    $photos: [Upload]
    $category: [String]!
  ) {
    createCoffeeShop(
      name: $name
      latitude: $latitude
      longitude: $longitude
      photos: $photos
      category: $category
    ) {
      ok
      id
      error
    }
  }
`;
//#endregion

//#region Style
const Container = styled.ScrollView`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.bgColor};
  padding: 10px;
`;

const PhotosText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  margin-left: 14px;
  margin-bottom: -10px;
`;

const PhotosContainer = styled.View`
  width: 100%;
  padding: 14px 5px;
`;

const Photos = styled.ScrollView`
  display: flex;
  width: 100%;
  flex-direction: row;
`;

const Photo = styled.Image`
  width: 120px;
  height: 120px;
  margin: 5px;
  border-radius: 8px;
`;

const FormContainer = styled.View`
  width: 100%;
`;

const Name = styled.TextInput`
  background-color: ${(props) => props.theme.transparent};
  padding: 8px 10px;
  margin-bottom: 6px;
  border-radius: 4px;
  width: 97.4%;
  align-self: center;
  color: ${(props) => props.theme.fontColor};
`;

const CategoryContainer = styled.View`
  width: 100%;
`;

const CategoryInput = styled.TextInput`
  background-color: ${(props) => props.theme.transparent};
  padding: 6px 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  width: 97.4%;
  align-self: center;
  color: ${(props) => props.theme.fontColor};
`;

const CategoryScrollView = styled.ScrollView`
  display: flex;
  width: 100%;
  height: 90px;
  padding: 0 8px;
`;

const Category = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 97.4%;
  align-self: center;
`;

const CategoryText = styled.Text`
  font-weight: 700;
  font-size: 18px;
`;

const CategoryRemoveBtn = styled.TouchableOpacity`
  padding: 2px 0 2px 2px;
`;

const MapText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.accent};
  margin-left: 5px;
  margin-bottom: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.accent};
  padding: 12px;
  border-radius: 5px;
  width: 97.4%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  align-self: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
`;

const HeaderRightText = styled.Text`
  color: ${(props) => props.theme.accent};
  font-size: 17px;
  font-weight: 600;
  margin-right: 18px;
`;
//#endregion

export default function Upload({ route, navigation }) {
  const [shopName, setShopName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");

  //다음으로 넘어가기
  const HeaderRight = () => (
    <TouchableOpacity onPress={handleSubmit}>
      <HeaderRightText>다음</HeaderRightText>
    </TouchableOpacity>
  );

  //로딩
  const HeaderRightLoading = () => (
    <ActivityIndicator size={20} color="#0095f6" style={{ marginRight: 10 }} />
  );

  //카테고리 추가
  const addCategory = (text) => {
    if (!categories.includes(text.nativeEvent.text)) {
      setCategoryInput("");
      setCategories([...categories, text.nativeEvent.text]);
    }
  };

  //카테고리 삭제
  const removeCategory = (value) =>
    setCategories(categories.filter((_, index) => index !== value));

  //제출하기
  const handleSubmit = () => {
    if (!shopName) {
      return ToastAndroid.show(
        "카페 이름이 입력되지 않았습니다.",
        ToastAndroid.BOTTOM
      );
    } else if (!route.params.files[0]) {
      return ToastAndroid.show(
        "Error on MediaLibrary or Camera API :(",
        ToastAndroid.BOTTOM
      );
    } else {
      let files = [];

      route.params.files.map((value, index) => {
        const file = new ReactNativeFile({
          uri: value,
          name: `${index}-${Date.now()}.jpeg`,
          type: "image/jpeg",
        });

        files.push(file);
      });

      createCoffeeShop({
        variables: {
          name: shopName,
          latitude: "111",
          longitude: "222",
          photos: files,
          category: categories,
        },
      });
    }
  };

  const onCompleted = (data) => {
    console.log("data: ", data);
    const {
      createCoffeeShop: { ok, error, id },
    } = data;

    if (!ok) {
      console.log("error: ", error);
      console.log("id: ", id);
    } else if (ok) {
      navigation.navigate("Tabs");
    }
  };

  const [createCoffeeShop, { loading }] = useMutation(
    CREATE_COFFEE_SHOP_MUTATION,
    { onCompleted }
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: loading ? HeaderRightLoading : HeaderRight,
      ...(loading && { headerLeft: () => null }),
    });
  }, [loading]);

  return (
    <DismissKeyboard>
      <Container>
        <PhotosText>Photos</PhotosText>
        <PhotosContainer>
          <Photos horizontal={true} showHorizontalScrollIndicator={false}>
            {route.params.files.map((value, index) => (
              <Photo key={index} source={{ uri: value }} />
            ))}
          </Photos>
        </PhotosContainer>
        <FormContainer>
          <Name
            placeholderTextColor={light ? "#555555" : "#efefef"}
            selectionColor={light ? "#515151" : "#e1e1e1"}
            autoCapitalize="none"
            placeholder="이름"
            keyboardType="default"
            onChangeText={(text) => setShopName(text)}
          />
          <CategoryInput
            value={categoryInput}
            placeholderTextColor={light ? "#555555" : "#efefef"}
            selectionColor={light ? "#515151" : "#e1e1e1"}
            autoCapitalize="none"
            placeholder="카테고리"
            onChangeText={(text) => setCategoryInput(text)}
            onSubmitEditing={addCategory}
            keyboardType="default"
          />
          <CategoryContainer>
            <CategoryScrollView
              vertical={true}
              showVerticalScrollIndicator={false}
            >
              {!categories[0] ? (
                <CategoryText>
                  카테고리 작성 후 Enter를 입력하세요.
                </CategoryText>
              ) : null}
              {categories.map((value, index) => (
                <Category key={index}>
                  <CategoryText>{value}</CategoryText>
                  <CategoryRemoveBtn onPress={() => removeCategory(index)}>
                    <Ionicons name="close" color="#ff471a" size={22} />
                  </CategoryRemoveBtn>
                </Category>
              ))}
            </CategoryScrollView>
          </CategoryContainer>
          <Button disabled={loading} onPress={() => handleSubmit()}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ButtonText>다음</ButtonText>
            )}
          </Button>
        </FormContainer>
      </Container>
    </DismissKeyboard>
  );
}
