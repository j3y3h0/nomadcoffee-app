import React, { useState } from "react";
import { FlatList } from "react-native";
import { client } from "../apollo";
import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import CoffeeShop from "../components/CoffeeShop";

const SEE_COFFEE_SHOPS_QUERY = gql`
  query seeCoffeeShops($page: Int!) {
    seeCoffeeShops(page: $page) {
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

export default function Home() {
  const { data, loading, refetch, fetchMore } = useQuery(
    SEE_COFFEE_SHOPS_QUERY,
    {
      variables: {
        page: 1,
      },
    }
  );

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderCoffeeShop = ({ item }) => <CoffeeShop data={item} />;

  return (
    <Layout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.05}
        onEndReached={() =>
          fetchMore({
            variables: {
              page: data?.seeCoffeeShops[0].id,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={() => {
          client.cache.evict({ fieldName: "seeCoffeeShops" });
          refresh();
        }}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeCoffeeShops}
        renderItem={renderCoffeeShop}
        keyExtractor={(coffeeShop) => `${coffeeShop.id}`}
      />
    </Layout>
  );
}
