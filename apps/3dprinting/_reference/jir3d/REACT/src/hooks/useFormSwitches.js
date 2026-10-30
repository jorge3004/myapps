import { useState } from "react";

export const useFormSwitches = (initialState = {}) => {
  const [switchValues, setSwitchValues] = useState(initialState);
  const handleSwitchChange = ({ target }) => {
    setSwitchValues({
      ...switchValues,
      [target.name]: target.checked,
    });
  };
  return [switchValues, handleSwitchChange, setSwitchValues];
};
