import { useEffect } from "react";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = gql`
  query me {
    me {
      id
      username
      name
      email
      location
      avatarUrl
      totalFollowing
      totalFollowers
      isFollowing
      isMe
    }
  }
`;

export default function useMe() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { data } = useQuery(ME_QUERY, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);

  return { data };
}
