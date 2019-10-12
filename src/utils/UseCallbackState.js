import { useState, useEffect, useRef } from 'react';

const useCallbackState = (defaultState) => {
  const [value, setValue] = useState(defaultState);
  const firstMount = useRef(true);
  const callback = useRef();

  const setState = (state, fn) => {
    setValue(state);
    callback.current = fn;
  };

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    if (callback.current) {
      callback.current(value);
    }
  }, [value]);

  return [value, setState];
};

export default useCallbackState;