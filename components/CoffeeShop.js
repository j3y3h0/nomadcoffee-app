import React from "react";
import styled from "styled-components/native";
import DefaultAvatar from "./DefaultAvatar";

const Container = styled.View`
  display: flex;
  width: 100%;
`;

const HeaderContainer = styled.View`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 50px;
  padding: 0 12px;
`;

const User = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const Avatar = styled.Image`
  width: 32px;
  height: 32px;
  border-radius: 32px;
`;

const Username = styled.Text`
  font-size: 15px;
  font-weight: 700;
  margin-left: 10px;
`;

const CoffeeShopName = styled.Text`
  right: 20px;
  font-size: 16px;
  font-weight: 700;
  position: absolute;
  text-align: right;
`;

const MainImage = styled.Image`
  width: 100%;
  height: 280px;
`;

const MainContainer = styled.View`
  display: flex;
  flex-direction: row;
  min-height: 120px;
`;

const DescContainer = styled.View`
  width: 64%;
  display: flex;
`;

const PhotosBox = styled.View`
  display: flex;
  flex-direction: row;
`;

const Photo = styled.Image`
  width: 62px;
  height: 62px;
  margin: 5px 2.5px;
  border-radius: 10px;
`;

const CategoriesBox = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const Category = styled.View`
  padding: 6px 8px;
  background-color: ${(props) => props.theme.deepColor};
  border-radius: 4px;
  margin: 5px 2.5px;
`;

const CategoryText = styled.Text`
  font-weight: 700;
`;

function CoffeeShop({ data }) {
  return (
    <Container>
      <HeaderContainer>
        <User>
          {data?.user?.avatarUrl ? (
            <Avatar
              resizeMode="contain"
              source={{ uri: data.user.avatarUrl }}
            />
          ) : (
            <DefaultAvatar size={32} />
          )}
          <Username>{data.user.username}</Username>
        </User>
        <CoffeeShopName>{data.name}</CoffeeShopName>
      </HeaderContainer>
      <MainImage resizeMode="cover" source={{ uri: data.photos[0].url }} />
      <MainContainer>
        <DescContainer>
          <PhotosBox>
            {data.photos.map((photo, index) => (
              <Photo
                key={index}
                resizeMode="cover"
                source={{ uri: photo.url }}
              />
            ))}
          </PhotosBox>
          <CategoriesBox>
            {data.categories.map((category, index) => (
              <Category key={index}>
                <CategoryText>{category.slug}</CategoryText>
              </Category>
            ))}
          </CategoriesBox>
        </DescContainer>
      </MainContainer>
    </Container>
  );
}

export default CoffeeShop;
