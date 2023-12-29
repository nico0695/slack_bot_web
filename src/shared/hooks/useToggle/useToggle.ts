import React from 'react';

export const useToggle = (initialValue?: boolean) => {
  const [value, setValue] = React.useState(initialValue ?? false);

  const toggle = React.useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  const setOpen = React.useCallback(() => {
    setValue(true);
  }, []);

  const setClose = React.useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setOpen, setClose] as const;
};
