import React from 'react';
import { StyleSheet, WebView } from 'react-native';

import Spinner from '../components/common/Spinner';
import { white } from '../styles/Colors';

const WebViewScreen = ({ navigation }) => {
  const { key } = navigation.state.params;
  const renderLoading = () => <Spinner style={styles.container} />;

  return (
    <WebView
      useWebKit
      source={{ uri: `https://www.youtube.com/embed/${key}?start=0` }}
      startInLoadingState
      renderLoading={renderLoading}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center'
  }
});

export default WebViewScreen;