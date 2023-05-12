import { ChangeEvent, useCallback, useState } from "react";

export const useChangeHandler = <T extends Object>(defaultValues: T) => {
  const [value, setValue] = useState<T>(defaultValues);

  const onChange = useCallback(
    (v: string, e: ChangeEvent) => {
      const { name } = e.target as HTMLInputElement;

      setValue({ ...value, [name]: v });
    },
    [value]
  );

  return { value, onChange };
};
