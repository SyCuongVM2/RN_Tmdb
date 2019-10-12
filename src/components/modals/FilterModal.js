import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { Modal } from './Modal';
import { TouchableOpacity } from '../common/TouchableOpacity';
import { Switch } from '../common/Switch';
import { white, darkBlue } from '../../styles/Colors';
import { fontSizeResponsive, height } from '../../utils/Metrics';

const FilterModal = ({ filterType, filterName, actionFilter, actionSwitchMovie, isVisible, style }) => {
  const [states, setStates] = useState({
    filter: filterType,
    name: filterName
  });
  const { filter, name } = states;

  const changeValues = (filter, name) => {
    setStates({ ...states, filter, name });
  };

  return (
    <Modal isVisible={isVisible} actionOpenClose={actionFilter} style={style}>
      <View style={styles.containerModal}>
        <Text style={styles.modalTitle}>Filter</Text>
        <ScrollView>
          <View style={styles.containerScroll}>
            <View style={styles.containerSection}>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>Date</Text>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Releases</Text>
                <Switch
                  value={filter === 'release_date.desc'}
                  onValueChange={() => changeValues('release_date.desc', 'Releases')}
                />
              </View>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Old</Text>
                <Switch
                  value={filter === 'release_date.asc'}
                  onValueChange={() => changeValues('release_date.asc', 'Old')}
                />
              </View>
            </View>
            <View style={styles.containerSection}>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>Popularity</Text>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Most popular</Text>
                <Switch
                  value={filter === 'popularity.desc'}
                  onValueChange={() => changeValues('popularity.desc', 'Most popular')}
                />
              </View>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Less popular</Text>
                <Switch
                  value={filter === 'popularity.asc'}
                  onValueChange={() => changeValues('popularity.asc', 'Less popular')}
                />
              </View>
            </View>
            <View>
              <Text style={styles.optionSectionTitle} numberOfLines={2}>Revenue</Text>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Higher revenue</Text>
                <Switch
                  value={filter === 'revenue.desc'}
                  onValueChange={() => changeValues('revenue.desc', 'Higher revenue')}
                />
              </View>
              <View style={styles.containerRow}>
                <Text style={styles.optionTitle} numberOfLines={2}>Lowest revenue</Text>
                <Switch
                  value={filter === 'revenue.asc'}
                  onValueChange={() =>changeValues('revenue.asc', 'Lowest revenue')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={actionFilter}
          >
            <Feather
              name="chevron-down"
              size={styles.icon.fontSize}
              color={darkBlue}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSave]}
            onPress={() => actionSwitchMovie(filter, name, false)}
          >
            <Text style={[styles.buttonText, styles.buttonTextSave]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: height * 0.7
  },
  containerScroll: {
    padding: 22
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: fontSizeResponsive(2.5),
    fontWeight: 'bold',
    color: darkBlue,
    padding: 22,
    paddingBottom: 18
  },
  containerSection: {
    marginBottom: 25
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingHorizontal: 10
  },
  optionSectionTitle: {
    fontSize: fontSizeResponsive(2.4),
    color: darkBlue,
    fontWeight: 'bold',
    width: '100%'
  },
  optionTitle: {
    fontSize: fontSizeResponsive(2.3),
    color: darkBlue,
    width: '80%'
  },
  containerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100
  },
  buttonClose: {
    backgroundColor: white,
    borderWidth: 1,
    borderColor: darkBlue,
    paddingVertical: 9.1,
    flex: 0.23
  },
  buttonSave: {
    backgroundColor: darkBlue,
    borderWidth: 1,
    borderColor: darkBlue,
    flex: 0.67
  },
  buttonText: {
    fontSize: fontSizeResponsive(2.1),
    textAlign: 'center'
  },
  buttonTextSave: {
    color: white,
    fontWeight: 'bold'
  },
  icon: {
    fontSize: fontSizeResponsive(2.8)
  }
});

export default FilterModal;