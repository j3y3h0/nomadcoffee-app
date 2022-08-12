import React, { useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { logUserIn } from "../apollo";
import { TextInput, ErrorText } from "../components/auth/AuthShared";
import { light } from "../shared";

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const initObject = {
  username: "",
  password: "",
};

export default function Login({ navigation }) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [formValue, setFormValue] = useState(initObject);
  const [errorValue, setError] = useState("");

  const handleChange = (key, text) => {
    setError("");
    setFormValue({ ...formValue, [key]: text });
  };

  const onNext = (element) => {
    element?.current?.focus();
  };

  const handleSubmit = (formValue) => {
    setError("");
    const isValid = validCheck(formValue);

    if (isValid && !loading) {
      login({
        variables: {
          username: formValue.username,
          password: formValue.password,
        },
      });
    }
  };

  const validCheck = (formValue) => {
    let valid = true;

    if (formValue.username === "") {
      setError("아이디가 입력되지 않았습니다.");
      valid = false;
    } else if (formValue.password === "") {
      setError("비밀번호가 입력되지 않았습니다.");
      valid = false;
    }

    return valid;
  };

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      const {
        login: { ok, token, error },
      } = data;

      if (!ok) {
        setError(error);
      } else {
        await logUserIn(String(token), navigation);
      }
    },
  });

  return (
    <AuthLayout messageType="login" navigation={navigation}>
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        returnKeyType="next"
        placeholder="아이디"
        value={formValue.username}
        onChangeText={(text) => handleChange("username", text)}
        onSubmitEditing={() => onNext(passwordRef)}
        ref={usernameRef}
      />
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        placeholder="비밀번호"
        value={formValue.password}
        onChangeText={(text) => handleChange("password", text)}
        onSubmitEditing={() => handleSubmit(formValue)}
        ref={passwordRef}
      />
      {errorValue ? <ErrorText>{errorValue}</ErrorText> : null}
      <AuthButton
        loading={loading}
        disabled={loading}
        onPress={() => handleSubmit(formValue)}
        text="로그인"
      />
    </AuthLayout>
  );
}
