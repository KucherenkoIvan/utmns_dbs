import { useContext, useEffect, useState } from "react";
import { Button, Container, Content, Footer, Panel, Stack } from "rsuite";
import styled from "styled-components";
import { api } from "../api";
import { LoginContext } from "../context/loginContext";

const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #fff;
`;

export const MainPage = () => {
  const [userInfo, setUserInfo] = useState<any>({});

  const ctx = useContext(LoginContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/info", {
          params: { userId: ctx.id },
        });
        setUserInfo(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [ctx.id]);

  return (
    <Container>
      <StyledContent>
        <Stack spacing={8} direction="column" alignItems="stretch">
          <Panel header="UID" bordered>
            {userInfo.id}
          </Panel>
          <Panel header="nickname" bordered>
            {userInfo.nickname}
          </Panel>
          <Panel header="email" bordered>
            {userInfo.email}
          </Panel>
          <Panel header="Position" bordered>
            {userInfo?.position?.name}
          </Panel>

          <Button appearance="primary" onClick={ctx.logOut}>
            Выйти
          </Button>
        </Stack>
      </StyledContent>
      <Footer>Работа выполнена Цепа Максимом и Кучеренко Иваном</Footer>
    </Container>
  );
};
