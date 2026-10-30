import { useState } from "react";

export const useForm = (initialState = {}) => {
  const [inputValues, setInputValues] = useState(initialState);
  const handleInputChange = ({ target }) => {
    let tValue = (target.type === 'checkbox') ?
      target.checked : target.value
    if (target.type === "file") {
      tValue = target.files[0]
    }
    setInputValues({
      ...inputValues,
      [target.name]: tValue,
    });
  };
  return [inputValues, handleInputChange, setInputValues];
};
