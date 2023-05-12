import axios from "axios";
import {
  Button,
  ButtonToolbar,
  Container,
  Content,
  FlexboxGrid,
  Footer,
  Form,
  Panel,
} from "rsuite";
import styled from "styled-components";
import { writeLoginToStorage } from "../context/loginContext";
import { useChangeHandler } from "../hooks/useChangeHandler";
import { useNotification } from "../hooks/useNotification";

const StyledGrid = styled(FlexboxGrid)`
  height: 100%;
`;

const defaultValues = { nickname: "", password: "" };

export const LoginPage = ({
  setLoginData,
}: {
  setLoginData: (data: any) => void;
}) => {
  const { value, onChange } = useChangeHandler(defaultValues);
  const { notify } = useNotification();

  const loginClickHandler = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/user/auth",
        value
      );
      writeLoginToStorage(data);
      setLoginData(data);
      notify("Вход в систему", "success");
    } catch (e) {
      notify("Вход в систему", "error");
      console.error(e);
    }
  };
  return (
    <Container>
      <Content>
        <StyledGrid justify="center" align="middle">
          <FlexboxGrid.Item colspan={12}>
            <Panel header={<h3>Вход</h3>} bordered>
              <Form fluid>
                <Form.Group>
                  <Form.ControlLabel>Имя пользователя</Form.ControlLabel>
                  <Form.Control
                    name="nickname"
                    type="text"
                    onChange={onChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel>Пароль</Form.ControlLabel>
                  <Form.Control
                    name="password"
                    type="password"
                    autoComplete="off"
                    onChange={onChange}
                  />
                </Form.Group>
                <Form.Group>
                  <ButtonToolbar>
                    <Button appearance="primary" onClick={loginClickHandler}>
                      Войти
                    </Button>
                  </ButtonToolbar>
                </Form.Group>
              </Form>
            </Panel>
          </FlexboxGrid.Item>
        </StyledGrid>
      </Content>
      <Footer>Работа выполнена Цепа Максимом и Кучеренко Иваном</Footer>
    </Container>
  );
};
