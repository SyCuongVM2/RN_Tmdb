import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { TouchableOpacity } from '../../common/TouchableOpacity';
import { notFound } from '../../../utils/StaticImages';
import { blue } from '../../../styles/Colors';

const PersonRow = ({ type, item, actionTeamDetail }) => {
  const uninformed = 'Uninformed';
  const getImageApi = image => {
    return image ? { uri: `https://image.tmdb.org/t/p/w500/${image}` } : notFound;
  };

  if (type === 'character' || type === 'job') {
    return (
      <TouchableOpacity
        style={styles.containerCast}
        onPress={() => actionTeamDetail(item.id)}
      >
        {type === 'character' && (
          <Text numberOfLines={1} style={[styles.titleCast, styles.titleCharacter]}>
            {item.character || uninformed}
          </Text>
        )}
        {type === 'job' && (
          <Text numberOfLines={1} style={[styles.titleCast, styles.titleCharacter]}>
            {item.job || uninformed}
          </Text>
        )}
        <Image
          source={getImageApi(item.profile_path)}
          style={styles.castPhoto}
        />
        <Text numberOfLines={1} style={styles.titleCast}>{item.name || uninformed}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.containerCast}>
      <Image
        source={getImageApi(item.logo_path)}
        style={styles.productionCompaniesPhoto}
        resizeMode="contain"
      />
      <Text numberOfLines={2} style={styles.titleCast}>{item.name || uninformed}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  containerCast: {
    marginRight: 30,
    alignItems: 'center',
    width: 80
  },
  titleCast: {
    marginTop: 10,
    color: blue,
    textAlign: 'center'
  },
  titleCharacter: {
    fontWeight: 'bold'
  },
  castPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 13
  },
  productionCompaniesPhoto: {
    width: '100%',
    height: 60,
    borderRadius: 4,
    marginTop: 13
  }
});

export default PersonRow;