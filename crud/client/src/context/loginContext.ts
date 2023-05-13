import React from "react";

export const defaultLoginContextValue = {
  id: "",
  nickname: "",
  authToken: "",
  logOut: () => {},
  currentProjectRole: null,
  setCurrentProjectRole: (() => {}) as (id?: number) => void,
};

export const retrieveLoginFromStorage = () => ({
  id: localStorage.getItem("id") ?? "",
  nickname: localStorage.getItem("nickname") ?? "",
  authToken: localStorage.getItem("authToken") ?? "",
  currentProjectRole: null,
  setCurrentProjectRole: () => {},
  logOut: () => {},
});

export const writeLoginToStorage = ({
  id,
  nickname,
  authToken,
}: {
  id: string;
  nickname: string;
  authToken: string;
}) => {
  localStorage.setItem("id", id);
  localStorage.setItem("nickname", nickname);
  localStorage.setItem("authToken", authToken);
};

export const LoginContext = React.createContext(defaultLoginContextValue);
