import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { darkBlue } from '../../../styles/Colors';
import { fontSizeResponsive } from '../../../utils/Metrics';

const SectionRow = ({
  title = '',
  isLast = false,
  hasSubTitle = false,
  children = null
}) => (
  <View
    style={[
      !hasSubTitle && styles.container,
      isLast && styles.containerLast,
      hasSubTitle && styles.containerSubTitle
    ]}
  >
    <Text style={styles.title}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 35
  },
  containerLast: {
    marginBottom: 15
  },
  containerSubTitle: {
    marginRight: 25
  },
  title: {
    fontSize: fontSizeResponsive(2.6),
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 7
  }
});

export default SectionRow;