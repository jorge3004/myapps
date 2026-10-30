import { useState } from "react";

export const useCounter = (initialState = 0) => {
  const [counter, setCounter] = useState(initialState);

  const increment = (factor = 1) => {
    setCounter(counter + factor);
  };
  const decrement = (factor = 1) => {
    setCounter(counter - factor);
  };

  return { counter, increment, decrement, setCounter };
};
