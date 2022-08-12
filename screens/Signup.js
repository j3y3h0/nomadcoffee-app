import React, { useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import AuthLayout from "../components/auth/AuthLayout";
import AuthButton from "../components/auth/AuthButton";
import { TextInput, ErrorText } from "../components/auth/AuthShared";
import { light } from "../shared";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

const initObject = {
  name: "",
  username: "",
  location: "",
  password: "",
  passwordConfirm: "",
  email: "",
};

export default function Signup({ navigation }) {
  const emailRef = useRef();
  const nameRef = useRef();
  const locationRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [formValue, setFormValue] = useState(initObject);
  const [errorValue, setError] = useState(initObject);

  const handleChange = (key, text) => {
    setError({ ...errorValue, [key]: "" });
    setFormValue({ ...formValue, [key]: text });
  };

  const onNext = (element) => {
    element?.current?.focus();
  };

  const handleSubmit = (formValue) => {
    const isValid = validCheck(formValue);

    if (isValid && !loading) {
      createAccount({
        variables: {
          name: formValue.name,
          username: formValue.username,
          email: formValue.email,
          password: formValue.password,
        },
      });
    }
  };

  const validCheck = (formValue) => {
    let valid = true;

    if (formValue.username === "") {
      setError({ ...errorValue, username: "아이디가 입력되지 않았습니다." });
      valid = false;
    } else if (formValue.email === "") {
      setError({ ...errorValue, email: "이메일이 입력되지 않았습니다." });
      valid = false;
    } else if (formValue.name === "") {
      setError({ ...errorValue, name: "이름이 입력되지 않았습니다." });
      valid = false;
    } else if (formValue.password === "") {
      setError({ ...errorValue, password: "비밀번호가 입력되지 않았습니다." });
      valid = false;
    } else if (formValue.password !== formValue.passwordConfirm) {
      setError({
        ...errorValue,
        passwordConfirm: "비밀번호 확인이 틀렸습니다.",
      });
      valid = false;
    }

    return valid;
  };

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION, {
    onCompleted: async (data) => {
      const {
        createAccount: { ok, error },
      } = data;
      if (!ok) {
        console.log("error: ", error);
      } else {
        navigation.navigate("Login");
      }
    },
  });

  return (
    <AuthLayout messageType="signup" navigation={navigation}>
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        placeholder="아이디"
        autoCapitalize="none"
        returnKeyType="next"
        value={formValue.username}
        onChangeText={(text) => handleChange("username", text)}
        onSubmitEditing={() => onNext(emailRef)}
      />
      {errorValue?.username ? (
        <ErrorText>{errorValue?.username}</ErrorText>
      ) : null}
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        value={formValue.email}
        onChangeText={(text) => handleChange("email", text)}
        onSubmitEditing={() => onNext(nameRef)}
        ref={emailRef}
      />
      {errorValue?.email ? <ErrorText>{errorValue?.email}</ErrorText> : null}
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        placeholder="이름"
        returnKeyType="next"
        value={formValue.name}
        onChangeText={(text) => handleChange("name", text)}
        onSubmitEditing={() => onNext(locationRef)}
        ref={nameRef}
      />
      {errorValue?.name ? <ErrorText>{errorValue?.name}</ErrorText> : null}
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        placeholder="사는 곳"
        returnKeyType="next"
        value={formValue.location}
        onChangeText={(text) => handleChange("location", text)}
        onSubmitEditing={() => onNext(passwordRef)}
        ref={locationRef}
      />
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        placeholder="비밀번호"
        keyboardType="default"
        returnKeyType="next"
        secureTextEntry={true}
        value={formValue.password}
        onChangeText={(text) => handleChange("password", text)}
        onSubmitEditing={() => onNext(passwordConfirmRef)}
        ref={passwordRef}
      />
      {errorValue?.password ? (
        <ErrorText>{errorValue?.password}</ErrorText>
      ) : null}
      <TextInput
        placeholderTextColor={light ? "#555555" : "#efefef"}
        selectionColor={light ? "#515151" : "#e1e1e1"}
        autoCapitalize="none"
        placeholder="비밀번호 확인"
        keyboardType="default"
        returnKeyType="done"
        secureTextEntry={true}
        value={formValue.passwordConfirm}
        onChangeText={(text) => handleChange("passwordConfirm", text)}
        onPress={() => handleSubmit(formValue)}
        ref={passwordConfirmRef}
      />
      {errorValue?.passwordConfirm ? (
        <ErrorText>{errorValue?.passwordConfirm}</ErrorText>
      ) : null}
      <AuthButton
        loading={loading}
        disabled={loading}
        onPress={() => handleSubmit(formValue)}
        text="회원가입"
      />
    </AuthLayout>
  );
}
