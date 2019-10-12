import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
// import Image from 'react-native-scalable-image';

import Spinner from '../common/Spinner';
import NotificationCard from '../cards/NotificationCard';
import { Modal } from './Modal';
import { TouchableOpacity } from '../common/TouchableOpacity';

import request from '../../services/API';

import { width, fontSizeResponsive, height } from '../../utils/Metrics';
import { notFound } from '../../utils/StaticImages';
import { white, darkBlue, blue } from '../../styles/Colors';

const PersonModal = ({ isVisible, actionClose, style, creditId }) => {
  const [states, setStates] = useState({
    isLoading: false,
    isError: false,
    id: creditId,
    profilePath: '',
    name: '',
    knownForDepartment: '',
    birthday: '',
    placeOfBirth: '',
    biography: ''
  });
  const { isLoading, isError, id, name, knownForDepartment, placeOfBirth, biography } = states;
  const uninformed = 'Uninformed';

  const getImageApi = () => {
    const { profilePath } = states;
    console.log(profilePath);
    return profilePath ? { uri: `https://image.tmdb.org/t/p/w500/${profilePath}` } : notFound;
  };
  const getAge = () => {
    const { birthday } = states;

    if (birthday) {
      const today = new Date();
      const birthDate = new Date(birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age -= 1;
      return `${age} years`;
    }
    return `${uninformed} age`;
  };
  const requestTeamInfo = async () => {
    try {
      setStates({ ...states, isLoading: true });

      const data = await request(`person/${parseInt(creditId)}`);

      setStates({
        ...states,
        isLoading: false,
        isError: false,
        id: creditId,
        profilePath: data.profile_path || '',
        name: data.name || `${uninformed} name`,
        knownForDepartment: data.known_for_department || `${uninformed} department`,
        birthday: data.birthday || '',
        placeOfBirth: data.place_of_birth || `${uninformed} place of birth`,
        biography: data.biography || uninformed
      });
    } catch (err) {
      setStates({
        ...states,
        isLoading: false,
        isError: true
      });
    }
  };
  const renderFooter = () => {
    return (
      <View style={styles.containerRow}>
        <TouchableOpacity style={styles.button} onPress={actionClose}>
          <Feather
            name="chevron-down"
            size={styles.icon.fontSize}
            color={darkBlue}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onModalShow={requestTeamInfo}
      actionOpenClose={actionClose}
      style={style}
    >
      <View style={styles.containerModal}>
        {isLoading || creditId !== id ? 
          <Spinner style={styles.containerCenter} /> : 
          (isError ? (
            <View style={styles.containerModal}>
              <ScrollView style={styles.containerScroll}>
                <NotificationCard
                  icon="alert-octagon"
                  action={requestTeamInfo}
                />
              </ScrollView>
              {renderFooter}
            </View>
          ) : ( 
            <View style={styles.containerModal}>
              <ScrollView style={styles.containerScroll}>
                <View style={styles.containerMainText}>
                  <Image
                    source={getImageApi()}
                    style={styles.photo}
                    width={width * 0.33}
                  />
                  <View style={styles.textItens}>
                    <Text style={styles.titleName}>{name}</Text>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {knownForDepartment}
                      </Text>
                    </View>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {getAge}
                      </Text>
                    </View>
                    <View style={styles.containerTitleMargin}>
                      <Text
                        numberOfLines={2}
                        style={[styles.textSmall, styles.textJustify]}
                      >
                        {placeOfBirth}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.titleInfo}>Biography</Text>
                <Text
                  style={[
                    styles.textSmall,
                    styles.textLineHeight,
                    styles.textJustify
                  ]}
                >
                  {biography}
                </Text>
              </ScrollView>
              {renderFooter}
            </View>
          ))
        }
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
    padding: 22,
    paddingTop: 0,
    marginTop: 22
  },
  containerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  photo: {
    borderRadius: 8
  },
  containerMainText: {
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  titleInfo: {
    fontSize: fontSizeResponsive(2.4),
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 7
  },
  titleName: {
    fontSize: fontSizeResponsive(2.6),
    fontWeight: 'bold',
    color: darkBlue,
    marginBottom: 10
  },
  textItens: {
    marginLeft: 20,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSmall: {
    fontSize: fontSizeResponsive(2.1),
    color: blue
  },
  textJustify: {
    textAlign: 'justify'
  },
  textLineHeight: {
    lineHeight: 20
  },
  containerTitleMargin: {
    marginBottom: 7
  },
  containerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: white,
    borderWidth: 1,
    borderColor: darkBlue,
    paddingVertical: 9.1,
    borderRadius: 100,
    width: '60%'
  },
  icon: {
    fontSize: fontSizeResponsive(2.8)
  }
});

export default PersonModal;