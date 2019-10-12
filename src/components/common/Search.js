import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from './TouchableOpacity';
import { darkGray } from '../../styles/Colors';
import { darkBlue, freeze } from '../../styles/Colors';
import { fontSizeResponsive } from '../../utils/Metrics';

const Search = ({ navigate, typeRequest }) => {
  const [value, setValue] = useState('');

  const actionClearSearch = () => {
    setValue('');
  };
  const actionSubmit = () => {
    if (value) {
      navigate('SearchResult', {
        typeRequest,
        name: value,
        id: null
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerInput}>
        <View style={styles.inputDirection}>
          <Feather 
            style={styles.icon}
            name="search"
            size={20}
            color={darkGray}
          />
          <TextInput 
            style={styles.textInput}
            onSubmitEditing={actionSubmit}
            onChangeText={search => setValue(search)}
            value={value}
            returnKeyType="search"
            keyboardType="default"
            blurOnSubmit
            multiline={false}
            autoCorrect={false}
            underlineColorAndroid="transparent"
            placeholderTextColor={darkGray}
            placeholder="Search"
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={actionClearSearch}>
              <Feather 
                style={styles.icon}
                name="x"
                size={20}
                color={darkGray}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 5
  },
  containerInput: {
    height: 40,
    backgroundColor: freeze,
    borderRadius: 15
  },
  inputDirection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    padding: 10
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSizeResponsive(2.2),
    color: darkBlue,
    width: '100%'
  }
});

export default Search;