import React from "react";
import styled from "styled-components/native";
import useMe from "../hook/useMe";
import { logUserOut } from "../apollo";
import DefaultAvatar from "../components/DefaultAvatar";
import { light } from "../shared";

const Container = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
`;

const Avatar = styled.Image`
  width: 150px;
  height: 150px;
  margin-top: 40px;
`;

const Username = styled.Text`
  margin-top: 10px;
  font-size: 22px;
  color: ${(props) => props.theme.fontColor};
`;

const Name = styled.Text`
  margin-top: 4px;
  font-size: 16px;
  color: ${(props) => props.theme.fontColor};
`;

const Location = styled.Text`
  margin-top: 4px;
  font-size: 16px;
  color: ${(props) => props.theme.accent};
`;

const LogoutBtn = styled.TouchableOpacity`
  position: absolute;
  margin-top: 4px;
  padding: 10px;
  background-color: #ff471a;
  border-radius: 5px;
  bottom: 14px;
`;

const LogoutBtnText = styled.Text`
  font-size: 16px;
  color: #ffffff;
`;

const Loading = styled.ActivityIndicator`
  margin-top: 40px;
  transform: scale(1.4, 1.4);
  color: ${(props) => props.theme.fontColor};
`;

export default function Profile({ navigation }) {
  const { data } = useMe();

  return (
    <Container>
      {data?.me ? (
        <>
          {data?.me?.avatarUrl ? (
            <Avatar resizeMode="contain" source={{ uri: data.me.avatarUrl }} />
          ) : (
            <DefaultAvatar size={140} />
          )}
          <Username>{data?.me?.username}</Username>
          <Name>이름 | {data?.me?.name}</Name>
          <Location>사는 곳 | {data?.me?.location}</Location>
          <LogoutBtn onPress={() => logUserOut(navigation)}>
            <LogoutBtnText>로그아웃</LogoutBtnText>
          </LogoutBtn>
        </>
      ) : (
        <Loading color={light ? "#000000" : "#ffffff"} />
      )}
    </Container>
  );
}
