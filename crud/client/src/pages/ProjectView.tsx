import PlusIcon from "@rsuite/icons/legacy/Plus";
import UserPlusIcon from "@rsuite/icons/legacy/UserPlus";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";

import { Container, Content, Footer, IconButton, Panel, Stack } from "rsuite";
import styled from "styled-components";
import { AddUsersModal } from "../components/AddParticipantModal";
import { ProjectParticipant } from "../components/ProjectParticipant";
import { Task } from "../components/Task";
import { ProjectRoles } from "../constants/projectRoles";
import { LoginContext } from "../context/loginContext";
const StyledContent = styled(Content)`
  padding: 24px;
  background-color: #fff;
`;
export const ProjectView = () => {
  const [projectInfo, setProjectInfo] = useState<any>({});
  const [usersIds, setusersIds] = useState([]);
  const [lastChanged, setLastChanged] = useState(new Date());
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const { projectId } = useParams();

  const [isParticipantModalOpen, setParticipantModalOpen] = useState(false);
  const openParticipantModal = () => setParticipantModalOpen(true);
  const closeParticipantModal = () => {
    setProjectInfo({});
    setusersIds([]);
    setLastChanged(new Date());
    setParticipantModalOpen(false);
  };

  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const openTaskModal = () => setTaskModalOpen(true);
  const closeTaskModal = () => {
    setProjectInfo({});
    setusersIds([]);
    setLastChanged(new Date());
    setTaskModalOpen(false);
  };

  const ctx = useContext(LoginContext);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/project", { params: { id: projectId } });

      setProjectInfo(data);
    })();

    (async () => {
      const { data } = await api.get("/project/participants", {
        params: { projectId },
      });

      setusersIds(data);
    })();
  }, [projectId, lastChanged]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/users");

      setAvailableUsers(
        data.filter(
          ({ id }: any) => !usersIds.map((r: any) => r.userId).includes(id)
        )
      );
    })();
  }, [usersIds]);

  useEffect(() => {
    const t = usersIds.find(({ userId }) => userId === ctx.id);

    ctx.setCurrentProjectRole((t as any)?.roleId || null);
  }, [usersIds, projectId, ctx, lastChanged]);

  return (
    <Container>
      <StyledContent>
        <Stack spacing={8} direction="column" alignItems="stretch">
          <Panel header="Название проекта" bordered>
            {projectInfo.name}
          </Panel>
          <Panel header="Дата создания" bordered>
            {projectInfo.createdAt}
          </Panel>
          <Panel
            header={
              <Stack>
                <div>Участники</div>
                {Number(ctx.currentProjectRole) < ProjectRoles.COLLABORATOR && (
                  <IconButton
                    circle
                    size="sm"
                    style={{ marginLeft: "16px" }}
                    icon={<UserPlusIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openParticipantModal();
                    }}
                  />
                )}
              </Stack>
            }
            bordered
            collapsible
            defaultExpanded
          >
            <Stack spacing={8} alignItems="flex-start" wrap>
              {usersIds.map(({ roleId, userId }) => (
                <ProjectParticipant
                  roleId={roleId}
                  userId={userId}
                  projectId={Number(projectId)}
                  afterChange={() => {
                    setProjectInfo({});
                    setusersIds([]);
                    setLastChanged(new Date());
                  }}
                />
              ))}
            </Stack>
          </Panel>

          {/* --------------------------------------- */}

          <Panel
            header={
              <Stack>
                <div>Задачи</div>
                <IconButton
                  circle
                  size="sm"
                  style={{ marginLeft: "16px" }}
                  icon={<PlusIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openParticipantModal();
                  }}
                />
              </Stack>
            }
            bordered
            collapsible
            defaultExpanded
          >
            <Stack spacing={8} alignItems="flex-start" wrap>
              {usersIds.map(({ roleId, userId }) => (
                <Task
                  roleId={roleId}
                  userId={userId}
                  projectId={Number(projectId)}
                  afterChange={() => {
                    setProjectInfo({});
                    setusersIds([]);
                    setLastChanged(new Date());
                  }}
                />
              ))}
            </Stack>
          </Panel>
        </Stack>
        <AddUsersModal
          availableUsers={availableUsers}
          projectId={Number(projectId)}
          open={isParticipantModalOpen}
          close={closeParticipantModal}
        />
      </StyledContent>
      <Footer>Работа выполнена Цепа Максимом и Кучеренко Иваном</Footer>
    </Container>
  );
};
