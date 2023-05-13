import EditIcon from "@rsuite/icons/legacy/Edit";
import DeleteIcon from "@rsuite/icons/legacy/TrashO";
import { useContext, useEffect, useRef, useState } from "react";
import { IconButton, Panel, Popover, Stack, Tag, Whisper } from "rsuite";
import { TypeAttributes } from "rsuite/esm/@types/common";
import { api } from "../api";
import { ProjectRoles } from "../constants/projectRoles";
import { LoginContext } from "../context/loginContext";
import { useNotification } from "../hooks/useNotification";
import { ChangeRoleModal } from "./ChangeRoleModal";

interface Props {
  roleId: number;
  userId: string;
  projectId: number;
  afterChange: CallableFunction;
}

const rolePresets: {
  [k in ProjectRoles]: {
    color: TypeAttributes.Color;
    text: string;
  };
} = {
  [ProjectRoles.OWNER]: {
    color: "orange",
    text: "Owner",
  },
  [ProjectRoles.MAINTAINER]: {
    color: "violet",
    text: "Maintainer",
  },
  [ProjectRoles.COLLABORATOR]: {
    color: "green",
    text: "Collaborator",
  },
};

const iconProps = { style: { width: 16, height: 16 } };

export const ProjectParticipant = ({
  roleId,
  userId,
  projectId,
  afterChange,
}: Props) => {
  const triggerRef = useRef(null);
  const [userInfo, setUserInfo] = useState<any>({});
  const { notify } = useNotification();

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    afterChange();
  };

  const ctx = useContext(LoginContext);
  const currentProjectRole = ctx?.currentProjectRole || Infinity;

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/user/info", {
          params: { userId },
        });
        setUserInfo(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [userId]);

  const onClickDelete = async () => {
    try {
      await api.delete("/project/participants", {
        params: {
          userId,
          projectId,
          roleId,
        },
      });

      notify("Пользователь удален из списка участников проекта", "success");
    } catch (e) {
      console.error(e);
      notify("Не удалось исключить пользователя из проекта", "error");
    } finally {
      afterChange();
    }
  };

  return (
    <>
      <Whisper
        placement="autoVerticalStart"
        speaker={
          currentProjectRole < roleId ? (
            <Popover>
              <Stack spacing={8}>
                <IconButton
                  circle
                  icon={<EditIcon {...iconProps} onClick={openModal} />}
                />
                <IconButton
                  circle
                  icon={<DeleteIcon {...iconProps} onClick={onClickDelete} />}
                />
              </Stack>
            </Popover>
          ) : (
            <div></div>
          )
        }
        ref={triggerRef}
        trigger={"contextMenu"}
      >
        <Panel
          shaded
          bordered
          header={
            <Stack justifyContent="space-between">
              <span>{userInfo.nickname}</span>
              <Tag color={rolePresets[roleId as ProjectRoles].color}>
                {rolePresets[roleId as ProjectRoles].text}
              </Tag>
            </Stack>
          }
          style={{ display: "inline-block", width: 240 }}
        >
          {userInfo.email}
        </Panel>
      </Whisper>
      <ChangeRoleModal
        open={isModalOpen}
        close={closeModal}
        roleId={roleId}
        userId={userId}
        projectId={projectId}
      />
    </>
  );
};
