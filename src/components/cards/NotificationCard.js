import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { TouchableOpacity } from '../common/TouchableOpacity';
import { white, blue, lightGray, darkBlue } from '../../styles/Colors';
import { fontSizeResponsive, width } from '../../utils/Metrics';

const NotificationCard = ({
  style = styles.containerError,
  icon = 'alert-octagon',
  textError = 'Something wrong has happened, please try again later.',
  textButton = 'Load',
  action = null
}) => (
  <View style={style}>
    <Feather name={icon} size={width * 0.2} color={darkBlue} />
    <Text style={styles.errorInfo}>{textError}</Text>
    {action && (
      <TouchableOpacity style={styles.loadingButton} onPress={action}>
        <Text style={styles.loadingText}>{textButton}</Text>
      </TouchableOpacity>
    )}
  </View>
)

const styles = StyleSheet.create({
  containerError: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    width: '100%'
  },
  errorInfo: {
    fontSize: fontSizeResponsive(2.6),
    color: blue,
    textAlign: 'center',
    padding: 25
  },
  loadingButton: {
    padding: 10,
    width: '50%',
    borderWidth: 1,
    borderRadius: 100,
    borderColor: lightGray
  },
  loadingText: {
    fontSize: fontSizeResponsive(2.1),
    color: blue,
    textAlign: 'center'
  }
});

export default NotificationCard;