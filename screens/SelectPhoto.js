import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import { light } from "../shared";

//#region Style
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const Top = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${(props) => props.theme.bgColor};
  border-bottom-width: 2px;
  border-bottom-color: ${(props) => props.theme.fontColor};
`;

const Bottom = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;

const ImageContainer = styled.TouchableOpacity``;

const IconContainer = styled.View`
  position: absolute;
  bottom: 3px;
  right: 1px;
`;

const LastImages = styled.View`
  flex: 1;
  width: 50%;
  flex-wrap: wrap;
`;

const Message = styled.Text`
  color: ${(props) => props.theme.fontColor};
  margin: auto;
  font-weight: 700;
  font-size: 16px;
`;

const HeaderRightText = styled.Text`
  color: ${(props) => props.theme.accent};
  font-size: 17px;
  font-weight: 600;
  margin-right: 18px;
`;
//#endregion

export default function SelectPhoto({ navigation }) {
  const { width } = useWindowDimensions();
  const [photos, setPhotos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [chosenPhotos, setChosenPhotos] = useState([]);

  //사진 가져오기
  const getPhotos = async () => {
    const { assets: photos } = await MediaLibrary.getAssetsAsync();
    setPhotos(photos);
  };

  //권한 설정
  const getPremissions = async () => {
    const permissionObj = await MediaLibrary.requestPermissionsAsync();
    if (
      (Platform.OS === "ios" &&
        permissionObj.accessPrivileges === "none" &&
        permissionObj.canAskAgain) ||
      (Platform.OS === "android" &&
        permissionObj.status === "undetermined" &&
        !permissionObj.granted)
    ) {
      const { accessPrivileges, granted } =
        await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges !== "none") {
        setSuccess(true);
        getPhotos();
      } else if (granted) {
        setSuccess(true);
        getPhotos();
      }
    } else if (permissionObj.accessPrivileges !== "none") {
      setSuccess(true);
      getPhotos();
    } else if (permissionObj.granted) {
      setSuccess(true);
      getPhotos();
    } else {
      setSuccess(false);
    }
  };

  //사진 선택하기
  const choosePhoto = (uri) => {
    if (chosenPhotos.includes(uri)) {
      setChosenPhotos(chosenPhotos.filter((value) => value !== uri));
    } else if (!(chosenPhotos.length >= 10)) {
      setChosenPhotos([...chosenPhotos, uri]);
    } else {
      ToastAndroid.show("Images must be no more than 10", ToastAndroid.BOTTOM);
    }
  };

  //사진 출력하기
  const renderItem = ({ item: photo }) => (
    <ImageContainer onPress={() => choosePhoto(photo.uri)}>
      <Image
        source={{ uri: photo.uri }}
        style={{ width: width / 4, height: 100 }}
      />
      <IconContainer>
        <Ionicons
          name="checkmark-circle"
          size={18}
          color={
            light
              ? chosenPhotos.includes(photo.uri)
                ? "#0095f6"
                : "#fafafa"
              : chosenPhotos.includes(photo.uri)
              ? "#0095f6"
              : "#101010"
          }
        />
      </IconContainer>
    </ImageContainer>
  );

  //사진 선택여부 체크
  const nextBtnFunction = (photoList) => {
    if (!photoList[0]) {
      ToastAndroid.show("사진이 선택되지 않았습니다.", ToastAndroid.BOTTOM);
    } else {
      navigation.navigate("UploadForm", {
        files: photoList,
      });
    }
  };

  //오른쪽 화살표
  const HeaderRight = (photoList) => (
    <TouchableOpacity onPress={() => nextBtnFunction(photoList)}>
      <HeaderRightText>다음</HeaderRightText>
    </TouchableOpacity>
  );

  useEffect(() => {
    getPremissions();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => HeaderRight(chosenPhotos),
    });
  }, [chosenPhotos]);

  return (
    <Container>
      <Top>
        {chosenPhotos[0] ? (
          <>
            <Image
              source={{ uri: chosenPhotos[chosenPhotos.length - 1] }}
              style={{ width: width / 2, height: "100%" }}
            />
            <LastImages style={{ height: "100%" }}>
              {chosenPhotos
                .filter((_, index) => index !== chosenPhotos.length - 1)
                .reverse()
                .map((value, index) => (
                  <Image
                    key={index}
                    source={{ uri: value }}
                    style={{ width: width / 4, height: "20%" }}
                  />
                ))}
            </LastImages>
          </>
        ) : (
          <Message>사진을 선택해 주세요.</Message>
        )}
      </Top>
      <Bottom>
        {success ? (
          <FlatList
            data={photos}
            numColumns={4}
            keyExtractor={(photo) => `${photo.id}`}
            renderItem={renderItem}
          />
        ) : (
          <Message>에러가 발생하였습니다.</Message>
        )}
      </Bottom>
    </Container>
  );
}
