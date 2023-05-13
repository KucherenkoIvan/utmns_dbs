import { useContext, useState } from "react";
import { Button, Form, Modal, SelectPicker } from "rsuite";
import { api } from "../api";
import { ProjectRoles } from "../constants/projectRoles";
import { LoginContext } from "../context/loginContext";
import { useNotification } from "../hooks/useNotification";

interface Props {
  open: boolean;
  close: () => void;
  roleId: number;
  projectId: number;
  userId: string;
}

const getOptions = (roleId: number) =>
  [
    { label: "Owner", value: ProjectRoles.OWNER },
    { label: "Maintainer", value: ProjectRoles.MAINTAINER },
    { label: "Collaborator", value: ProjectRoles.COLLABORATOR },
  ].filter(({ value }) => value >= roleId);

export const ChangeRoleModal = ({
  open,
  close,
  projectId,
  userId,
  roleId,
}: Props) => {
  const { notify } = useNotification();
  const [newRoleId, setNewRoleId] = useState<Number | null>(null);

  const ctx = useContext(LoginContext);

  const onClickSave = async () => {
    try {
      const { data } = await api.put("/project/participants", {
        projectId,
        userId,
        roleId,
        newRoleId,
      });
      console.log(data);

      notify("Роль обновлена", "success");
      console.log(data);
      close();
    } catch (e) {
      console.error(e);
      notify("Обновление роли", "error");
    }
  };

  return (
    <Modal open={open} onClose={close}>
      <Modal.Header>
        <Modal.Title>Смена роли</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Роль</Form.ControlLabel>
            <Form.Control
              name="newRoleId"
              accepter={(...props) => (
                <SelectPicker
                  value={newRoleId}
                  onChange={(v) => setNewRoleId(Number(v))}
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
