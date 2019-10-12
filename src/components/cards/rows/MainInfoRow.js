import React from 'react';
import { StyleSheet, ScrollView, Text } from 'react-native';

import SectionRow from './SectionRow';
import { blue } from '../../../styles/Colors';
import { fontSizeResponsive } from '../../../utils/Metrics';

const MainInfoRow = ({ data = {} }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.container}
  >
    {Object.keys(data).map(key => (
      <SectionRow key={key} title={key} hasSubTitle>
        <Text style={styles.description}>{data[key]}</Text>
      </SectionRow>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  description: {
    fontSize: fontSizeResponsive(2.1),
    color: blue,
    textAlign: 'justify'
  }
});

export default MainInfoRow;