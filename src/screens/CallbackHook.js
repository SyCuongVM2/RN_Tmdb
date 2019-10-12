import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const useCallbackState = (defaultState) => {
  const [value, setValue] = React.useState(defaultState);
  const firstMount = React.useRef(true);
  const callback = React.useRef();

  const setState = (state, fn) => {
    setValue(state);
    callback.current = fn;
  };

  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }

    if (callback.current) {
      callback.current(value);
    }
  }, [value]);

  return [value, setState];
}

const App = () => {
  const [states, setStates] = useCallbackState({
    cost: 100,
    profit: 'Unlimited',
    label: 'App'
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 25}}>Cost: {states.cost}</Text>
      <Text style={{fontSize: 25}}>Profit: {states.profit}</Text>
      <Text style={{fontSize: 25}}>Label: {states.label}</Text>
      <TouchableOpacity onPress={() => 
        setStates(
          { ...states, cost: states.cost + 1, profit: 'Limited' }, 
          (value) => { 
            console.log(value); 
          }
        )
      }>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;