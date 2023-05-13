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

import AngleLeftIcon from "@rsuite/icons/legacy/AngleLeft";
import AngleRightIcon from "@rsuite/icons/legacy/AngleRight";
import Dot from "@rsuite/icons/legacy/DotCircleO";
import GroupIcon from "@rsuite/icons/legacy/Group";
import HomePage from "@rsuite/icons/legacy/Home";
import Plus from "@rsuite/icons/legacy/Plus";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./api";
import { CreateProjectModal } from "./components/CreateProjectModal";
import {
  LoginContext,
  defaultLoginContextValue,
  retrieveLoginFromStorage,
  writeLoginToStorage,
} from "./context/loginContext";
import { LoginPage } from "./pages/Login";
import { AppRouter } from "./routing";

const StyledContainer = styled(Container)`
  height: 100%;
  overflow: auto;
  position: relative;
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

const StyledSidebar = styled(Sidebar)`
  margin-right: 24px;
  box-shadow: 0px 0px 12px lightgray;
  position: sticky;
  top: 0;
`;

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
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const [currentProjectRole, setCurrentProjectRole] = useState<any>(null);

  const [isLoading, setLoading] = useState(true);
  const [expand, setExpand] = useState(true);
  const [loginData, setLoginData] = useState(defaultLoginContextValue);
  const isLoggedIn = Boolean(loginData?.authToken);
  const logOut = () => {
    writeLoginToStorage(defaultLoginContextValue);
    setLoginData(defaultLoginContextValue);
  };

  useEffect(() => {
    setLoginData(retrieveLoginFromStorage());
    const t = setTimeout(() => setLoading(false), 1000);

    return () => clearTimeout(t);
  }, []);

  const [projectIds, setProjectIds] = useState([]);

  useEffect(() => {
    if (loginData?.id) {
      (async () => {
        const { data } = await api.get("/projects", {
          params: { userId: loginData.id },
        });
        setProjectIds(data);
      })();
    }
  }, [loginData?.id, isModalOpen]);

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const tasks = projectIds.map(({ projectId }) =>
        api
          .get("/project", { params: { id: projectId } })
          .then(({ data }) => data)
          .catch((e) => console.error(e))
      );

      const data = await Promise.all(tasks);
      console.log(data);

      setProjects(data);
    })();
  }, [projectIds]);

  if (isLoading) {
    return <Loader backdrop content="loading..." vertical />;
  }

  return (
    <LoginContext.Provider
      value={{
        ...loginData,
        logOut,
        currentProjectRole,
        setCurrentProjectRole: (id) => setCurrentProjectRole(id),
      }}
    >
      <StyledContainer>
        {isLoggedIn ? (
          <>
            <StyledSidebar
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
                      <Nav.Menu
                        eventKey="1"
                        trigger="hover"
                        title="Проекты"
                        icon={<GroupIcon />}
                        placement="rightStart"
                      >
                        <Nav.Item
                          eventKey={`1-01`}
                          icon={<Plus />}
                          onClick={openModal}
                        >
                          Создать
                        </Nav.Item>
                        {projects.map(({ name, id }, idx) => (
                          <Nav.Item
                            key={id}
                            eventKey={`1-${idx}`}
                            icon={<Dot />}
                          >
                            <Link to={`/project/${id}`}>{name}</Link>
                          </Nav.Item>
                        ))}
                      </Nav.Menu>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
                <NavToggle
                  expand={expand}
                  onChange={() => setExpand(!expand)}
                />
              </Stack>

              <CreateProjectModal open={isModalOpen} close={closeModal} />
            </StyledSidebar>
            <AppRouter />
          </>
        ) : (
          <LoginPage setLoginData={setLoginData} />
        )}
      </StyledContainer>
    </LoginContext.Provider>
  );
};
