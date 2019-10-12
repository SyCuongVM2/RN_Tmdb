import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { Alert } from '../components/common/Alert';
import { Share } from '../components/common/Share';
import { TouchableOpacity } from '../components/common/TouchableOpacity';
import { Switch } from '../components/common/Switch';
import { getItem, setItem } from '../utils/AsyncStorage';
import { white, darkBlue, blue, lightGray } from '../styles/Colors';
import { fontSizeResponsive } from '../utils/Metrics';

const Configuration = () => {
  const [hasAdultContent, setContent] = useState(false);

  useEffect(() => {
    getContent();
  }, []);

  const getContent = async () => {
    try {
      const hasAdultContent = await getItem('@ConfigKey', 'hasAdultContent');
      setContent(hasAdultContent);
    } catch (err) {
      showError(err);
    }
  }
  const showError = (error) => {
    Alert({
      title: 'Attention',
      description: error
    });
  };

  const actionChangeAdultContent = async value => {
    try {
      setContent(value);
      await setItem('@ConfigKey', `{"hasAdultContent": ${value}}`);
    } catch (error) {
      showError(error);
    }
  };
  const actionShare = () => {
    Share({
      message: 'Learn all about movies and series \u{1F37F}',
      url: 'https://www.themoviedb.org/',
      title: 'AmoCinema',
      dialogTitle: 'Learn all about movies and series \u{1F37F}'
    });
  };
  const actionRating = () => {
    Alert({
      title: 'Attention',
      description: 'Nothing happens now. In the future you will be redirected to store.'
    });
  };

  return (
    <ScrollView style={styles.bgWhite}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.itemText, styles.sectionText]} numberOfLines={2}>Interface</Text>
          <View style={[styles.item, styles.itemNoBorder]}>
            <Text style={styles.itemText} numberOfLines={2}>Include adult content</Text>
            <Switch
              value={hasAdultContent}
              onValueChange={actionChangeAdultContent}
            />
          </View>
        </View>
        <View>
          <Text style={[styles.itemText, styles.sectionText]} numberOfLines={2}>Application</Text>
          <TouchableOpacity onPress={actionShare}>
            <View style={styles.item}>
              <Text style={styles.itemText} numberOfLines={2}>Tell a friend</Text>
              <Feather
                name="share"
                size={22}
                color={darkBlue}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={actionRating}>
            <View style={styles.item}>
              <Text style={styles.itemText} numberOfLines={2}>Rate the app</Text>
              <Feather
                name="star"
                size={22}
                color={darkBlue}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          <View style={[styles.item, styles.itemNoBorder]}>
            <Text style={styles.itemTextVersion} numberOfLines={2}>Version 1.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bgWhite: {
    backgroundColor: white
  },
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 20,
    paddingTop: 25
  },
  section: {
    marginBottom: 40
  },
  sectionText: {
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: fontSizeResponsive(3)
  },
  item: {
    backgroundColor: white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: lightGray
  },
  itemText: {
    fontSize: fontSizeResponsive(2.5),
    color: darkBlue,
    width: '80%'
  },
  itemTextVersion: {
    fontSize: fontSizeResponsive(2.5),
    color: blue
  },
  itemNoBorder: {
    borderBottomWidth: 0
  },
  icon: {
    marginRight: 5
  }
});

export default Configuration;