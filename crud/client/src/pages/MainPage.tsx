import { useContext } from "react";
import { Container, Content, FlexboxGrid, Footer } from "rsuite";
import styled from "styled-components";
import { LoginContext } from "../context/loginContext";

const StyledGrid = styled(FlexboxGrid)`
  height: 100%;
`;

export const MainPage = () => {
  const t = useContext(LoginContext);
  console.log(t);

  return (
    <Container>
      <Content>
        <StyledGrid justify="center" align="middle">
          awdawd
        </StyledGrid>
      </Content>
      <Footer>Работа выполнена Цепа Максимом и Кучеренко Иваном</Footer>
    </Container>
  );
};
