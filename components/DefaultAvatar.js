import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const SDefaultAvatar = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  width: 150px;
  height: 150px;
  border-radius: 75px;
  margin-top: 40px;
  justify-content: center;
  align-items: center;
`;

const DefaultAvatar = ({size}) => {
  return (
    <SDefaultAvatar>
      <Ionicons name="person" size={size} />
    </SDefaultAvatar>
  );
};

export default DefaultAvatar;
