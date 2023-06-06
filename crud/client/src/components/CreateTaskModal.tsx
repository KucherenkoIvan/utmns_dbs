import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, SelectPicker } from "rsuite";
import { api } from "../api";
import { ProjectRoles } from "../constants/projectRoles";
import { LoginContext } from "../context/loginContext";
import { useNotification } from "../hooks/useNotification";

interface Props {
  open: boolean;
  close: () => void;
  projectId: number;
  availableUsers: Array<{ id: string; nickname: string }>;
}

const getOptions = (roleId: number) =>
  [
    { label: "Owner", value: ProjectRoles.OWNER },
    { label: "Maintainer", value: ProjectRoles.MAINTAINER },
    { label: "Collaborator", value: ProjectRoles.COLLABORATOR },
  ].filter(({ value }) => value >= roleId);

export const AddUsersModal = ({
  open,
  close,
  projectId,
  availableUsers,
}: Props) => {
  const { notify } = useNotification();
  const [userId, setUserId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<Number | null>(null);

  useEffect(() => {
    setUserId(null);
    setRoleId(null);
  }, [open]);

  const ctx = useContext(LoginContext);

  const onClickSave = async () => {
    try {
      const { data } = await api.post("/project/participants", {
        userId,
        projectId,
        roleId,
      });
      console.log(data);

      notify("Пользователь добавлен", "success");
      console.log(data);
      close();
    } catch (e) {
      console.error(e);
      notify("Добавление пользователя", "error");
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <Modal.Header>
        <Modal.Title>Добавление пользователя</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Пользователь</Form.ControlLabel>
            <Form.Control
              name="userId"
              accepter={(...props) => (
                <SelectPicker
                  value={userId}
                  onChange={(v) => setUserId(String(v))}
                  style={{ width: "100%" }}
                  {...(props as any)}
                  data={availableUsers.map(({ id, nickname }) => ({
                    label: nickname,
                    value: id,
                  }))}
                />
              )}
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Роль</Form.ControlLabel>
            <Form.Control
              name="roleId"
              accepter={(...props) => (
                <SelectPicker
                  value={roleId}
                  onChange={(v) => setRoleId(Number(v))}
                  style={{ width: "100%" }}
                  {...(props as any)}
                  data={getOptions(ctx?.currentProjectRole || Infinity)}
                />
              )}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClickSave} appearance="primary">
          Oк
        </Button>
        <Button onClick={close} appearance="subtle">
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
