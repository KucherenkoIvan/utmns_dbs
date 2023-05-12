import { ReactElement, useCallback } from "react";
import { Notification, useToaster } from "rsuite";
import { MessageType } from "rsuite/esm/Notification/Notification";

const HEADERS_CONFIG: { [k in MessageType]: string } = {
  error: "Ошибка",
  warning: "Внимание",
  success: "Успешно",
  info: "info",
};

export const useNotification = () => {
  const toaster = useToaster();

  const notify = useCallback(
    (content: string | ReactElement, type: MessageType = "info") => {
      toaster.push(
        <Notification closable type={type} header={HEADERS_CONFIG[type]}>
          {content}
        </Notification>
      );
    },
    [toaster]
  );

  return { notify };
};
