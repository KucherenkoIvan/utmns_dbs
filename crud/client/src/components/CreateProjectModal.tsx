import { useContext } from "react";
import { Button, Form, Modal } from "rsuite";
import { api } from "../api";
import { ProjectRoles } from "../constants/projectRoles";
import { LoginContext } from "../context/loginContext";
import { useChangeHandler } from "../hooks/useChangeHandler";
import { useNotification } from "../hooks/useNotification";

interface Props {
  open: boolean;
  close: () => void;
}

const defaultValues = {
  name: "",
};

export const CreateProjectModal = ({ open, close }: Props) => {
  const { notify } = useNotification();
  const { value, onChange } = useChangeHandler(defaultValues);

  const ctx = useContext(LoginContext);

  const onClickSave = async () => {
    try {
      const { data: createdProject } = await api.post("/project", value);
      console.log(createdProject);
      const { data: participant } = await api.post("/project/participants", {
        projectId: createdProject.id,
        roleId: ProjectRoles.OWNER,
        userId: ctx.id,
      });
      notify(`Проект создан - ${createdProject.name}`, "success");
      console.log(participant);
      close();
    } catch (e) {
      console.error(e);
      notify("Создание проекта", "error");
    }
  };
  return (
    <Modal open={open} onClose={close}>
      <Modal.Header>
        <Modal.Title>Создание проекта</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>Имя проекта</Form.ControlLabel>
            <Form.Control name="name" type="text" onChange={onChange} />
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
