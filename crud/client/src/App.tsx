import {
  Container,
  Loader,
  Nav,
  Navbar,
  Sidebar,
  Sidenav,
  Stack,
} from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { styled } from "styled-components";
import "./App.css";

import DashboardIcon from "@rsuite/icons/Dashboard";
import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import GroupIcon from "@rsuite/icons/legacy/Group";
import HomePage from "@rsuite/icons/legacy/Home";
import { useEffect, useState } from "react";
import {
  LoginContext,
  defaultLoginContextValue,
  retrieveLoginFromStorage,
} from "./context/loginContext";
import { LoginPage } from "./pages/Login";
import { MainPage } from "./pages/MainPage";

const StyledContainer = styled(Container)`
  height: 100%;
`;

const headerStyles = {
  display: "block",
  padding: 18,
  fontSize: 16,
  height: 56,
  background: "#3498ff",
  color: " #fff",
  whiteSpace: "nowrap",
  overflow: "hidden",
};
const iconProps = { style: { width: 20, height: 20 } };

const NavToggle = ({
  expand,
  onChange,
}: {
  expand: boolean;
  onChange: () => void;
}) => {
  return (
    <Navbar appearance="subtle">
      <Nav pullRight>
        <Nav.Item onClick={onChange} style={{ width: 56, textAlign: "center" }}>
          {expand ? (
            <AngleLeftIcon {...iconProps} />
          ) : (
            <AngleRightIcon {...iconProps} />
          )}
        </Nav.Item>
      </Nav>
    </Navbar>
  );
};

export const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [expand, setExpand] = useState(true);
  const [loginData, setLoginData] = useState(defaultLoginContextValue);
  const isLoggedIn = Boolean(loginData?.authToken);

  useEffect(() => {
    setLoginData(retrieveLoginFromStorage());
    const t = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return <Loader backdrop content="loading..." vertical />;
  }

  return (
    <LoginContext.Provider value={loginData}>
      <StyledContainer>
        {isLoggedIn ? (
          <>
            <Sidebar
              style={{ display: "flex", flexDirection: "column" }}
              width={expand ? 260 : 56}
              collapsible
            >
              <Sidenav.Header>
                <a href="/" style={headerStyles as any}>
                  <span>
                    <HomePage {...iconProps} />
                  </span>
                  <span style={{ marginLeft: 16 }}>
                    {expand ? "Главная" : ""}
                  </span>
                </a>
              </Sidenav.Header>
              <Stack
                style={{ height: "100%" }}
                direction="column"
                alignItems="stretch"
                justifyContent="space-between"
              >
                <Sidenav
                  expanded={expand}
                  defaultOpenKeys={["3"]}
                  appearance="subtle"
                >
                  <Sidenav.Body>
                    <Nav>
                      <Nav.Item eventKey="1" active icon={<DashboardIcon />}>
                        Dashboard
                      </Nav.Item>
                      <Nav.Item eventKey="2" icon={<GroupIcon />}>
                        User Group
                      </Nav.Item>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
                <NavToggle
                  expand={expand}
                  onChange={() => setExpand(!expand)}
                />
              </Stack>
            </Sidebar>
            <MainPage />
          </>
        ) : (
          <LoginPage setLoginData={setLoginData} />
        )}
      </StyledContainer>
    </LoginContext.Provider>
  );
};
