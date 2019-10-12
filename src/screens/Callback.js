import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

class Callback extends Component {
  state = {
    cost: 300,
    profit: 'Unlimited',
    label: 'callback'
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 25}}>Cost: {this.state.cost}</Text>
        <Text style={{fontSize: 25}}>Profit: {this.state.profit}</Text>
        <Text style={{fontSize: 25}}>Label: {this.state.label}</Text>
        <TouchableOpacity onPress={() => 
          // this.setState({ cost: 200, profit: 'Limited' }, () => {
          //   console.log(this.state);
          //   console.log('cuongvm');
          // })
          // this.setState(({ cost, profit }) => {
          //   console.log(cost);
          //   console.log(profit);
          //   console.log({ cost: cost === 1 ? 2 : 1, profit: profit + 1 });
          //   return { cost: cost === 1 ? 2 : 1, profit: profit + 1 };
          // })
          this.setState(
            ({ cost }) => ({
              cost: cost + 1
            }),
            () => {
              console.log(this.state.cost)
            }
          )
        }>
          <Text>Press Me</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Callback;