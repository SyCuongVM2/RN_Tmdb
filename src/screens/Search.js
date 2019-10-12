import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

import Search from '../components/common/Search';
import { TouchableOpacity } from '../components/common/TouchableOpacity';
import genre from '../assets/ids.json';
import { white, darkBlue } from '../styles/Colors';
import { fontSizeResponsive } from '../utils/Metrics';

const SearchScreen = ({ navigation }) => {
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      <Search typeRequest="search" navigate={navigate} />
      <ScrollView style={styles.containerList}>
        {Object.keys(genre).map(id => (
          <TouchableOpacity
            style={styles.item}
            key={id}
            onPress={() =>
              navigate('SearchResults', {
                typeRequest: 'discover',
                name: genre[id].name,
                id
              })
            }
          >
            <Text style={styles.itemText}>{genre[id].name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white
  },
  containerList: {
    marginTop: 25
  },
  item: {
    alignItems: 'center',
    marginBottom: 25
  },
  itemText: {
    fontSize: fontSizeResponsive(2.5),
    color: darkBlue,
    textAlign: 'center'
  }
});

export default SearchScreen;