import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import ReadMore from 'react-native-read-more-text';

import { Alert } from '../components/common/Alert';
import { Share } from '../components/common/Share';
import Spinner from '../components/common/Spinner';
import NotificationCard from '../components/cards/NotificationCard';
import PosterRow from '../components/cards/rows/PosterRow';
import PersonModal from '../components/modals/PersonModal';
import PersonListRow from '../components/cards/rows/PersonListRow';
import PersonRow from '../components/cards/rows/PersonRow';
import SectionRow from '../components/cards/rows/SectionRow';
import MainInfoRow from '../components/cards/rows/MainInfoRow';
import { TouchableOpacity } from '../components/common/TouchableOpacity';
import request from '../services/API';
import language from '../assets/iso.json';
import { white, pink, blue, darkBlue } from '../styles/Colors';
import { fontSizeResponsive } from '../utils/Metrics';
import useCallbackState from '../utils/UseCallbackState';

const MovieDetails = ({ navigation }) => {
  const uninformed = 'Uninformed';
  const renderTruncatedFooter = handlePress => (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.readMore}>Read more</Text>
    </TouchableOpacity>
  );
  const renderRevealedFooter = handlePress => (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.readMore}>Read less</Text>
    </TouchableOpacity>
  );

  const [states, setStates] =  useCallbackState({
    isLoading: true,
    isError: false,
    isVisible: false,
    showImage: false,
    id: null,
    creditId: null,
    backdropPath: '',
    voteAverage: 0,
    video: [],
    title: '',
    infosDetail: {},
    overview: '',
    cast: [],
    crew: [],
    productionCompanies: [],
    images: []
  });

  useEffect(() => {
    navigation.setParams({ actionShare });
    requestMoviesInfo();
  }, []);

  const requestMoviesInfo = async () => {
    try {
      setStates({ ...states, isLoading: true });

      const { id } = navigation.state.params;

      const data = await request(`movie/${id}`, {
        include_image_language: 'en,null',
        append_to_response: 'credits,videos,images'
      });

      setStates({
        ...states,
        isLoading: false,
        isError: false,
        id,
        backdropPath: data.backdrop_path || '',
        title: data.title || '',
        voteAverage: data.vote_average || 0,
        video: data.videos.results[0] || [],
        overview: data.overview || uninformed,
        cast: sliceArrayLength(data.credits.cast, 15),
        crew: sliceArrayLength(data.credits.crew, 15),
        productionCompanies: sliceArrayLength(
          data.production_companies,
          10
        ),
        images: formatImageUrl(data.images.backdrops),
        infosDetail: getInfosDetail(data)
      });
    } catch (err) {
      setStates({
        ...states,
        isLoading: false,
        isError: true
      });
    }
  };
  const getInfosDetail = ({
    runtime,
    genres,
    original_language,
    release_date,
    budget,
    revenue,
    adult
  }) => {
    return {
      Duration: convertMinsToHrsMins(runtime || 0),
      Genre: convertToGenre(sliceArrayLength(genres, 2) || ''),
      Language: convertToUpperCaseFirstLetter(
        language[original_language] || ''
      ),
      Release: convertToDate(release_date || ''),
      Budget: convertToDolar(budget || 0),
      Revenue: convertToDolar(revenue || 0),
      Adult: convertAdult(adult || '')
    };
  };
  const formatImageUrl = images => {
    return sliceArrayLength(images, 15).map(item => {
      return { url: `https://image.tmdb.org/t/p/original/${item.file_path}` };
    });
  };
  const sliceArrayLength = (arr, num) => {
    return arr.length > num ? arr.slice(0, num) : arr;
  };
  const convertToDolar = value => {
    return (
      `$${value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}` ||
      uninformed
    );
  };
  const convertAdult = adult => (adult === false ? 'Yes' : 'No' || uninformed);
  const convertMinsToHrsMins = runtime => {
    let h = Math.floor(runtime / 60);
    let m = runtime % 60;
    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    return h && m ? `${h}h ${m}m` : uninformed;
  };
  const convertToGenre = genre => {
    return genre.length > 0
      ? genre.length > 1
        ? `${genre[0].name}, ${genre[1].name}`
        : genre[0].name
      : uninformed;
  };
  const convertToUpperCaseFirstLetter = originalLanguage => {
    return originalLanguage.charAt(0).toUpperCase() + originalLanguage.slice(1);
  };
  const convertToDate = releaseDate => {
    const date = new Date(releaseDate);
    return (
      `${date.getDate() + 1}/${date.getMonth() + 1}/${date.getFullYear()}` ||
      uninformed
    );
  };
  const actionPerson = (creditId = '') => {
    // setStates(({ isVisible }) => {
    //   return { ...states, creditId, isVisible: !isVisible };
    // });
    setStates({ ...states, creditId, isVisible: !states.isVisible });
  };
  const actionImage = () => {
    setStates(({ showImage }) => {
      return { ...states, showImage: !showImage };
    });
  };
  const actionShare = () => {
    const { isError, title, id } = states;

    if (isError) {
      Alert({
        title: 'Attention',
        description: 'Something wrong has happened, please try again later.'
      });
    } else {
      Share({
        message: `${title}, know everything about this movie \u{1F37F}`,
        url: `https://www.themoviedb.org/movie/${id}`,
        title: 'AmoCinema',
        dialogTitle: `${title}, know everything about this movie \u{1F37F}`
      });
    }
  };
  const renderItem = (item, type, actionTeamDetail) => (
    <PersonRow item={item} type={type} actionTeamDetail={actionTeamDetail} />
  );
  const renderListEmpty = () => (
    <View>
      <Text style={styles.subTitleInfo}>Uninformed</Text>
    </View>
  );

  const {
    isLoading,
    isError,
    isVisible,
    showImage,
    creditId,
    backdropPath,
    voteAverage,
    video,
    title,
    infosDetail,
    overview,
    cast,
    crew,
    productionCompanies,
    images
  } = states;
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <NotificationCard
          icon="alert-octagon"
          action={requestMoviesInfo}
        />
      ) : (
        <ScrollView>
          <PosterRow
            title={title}
            backdropPath={backdropPath}
            voteAverage={voteAverage}
            images={images}
            video={video}
            navigate={navigate}
            showImage={showImage}
            onPress={actionImage}
          />
          <View style={styles.containerMovieInfo}>
            <MainInfoRow data={infosDetail} />
            <SectionRow title="Synopsis">
              <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={renderTruncatedFooter}
                renderRevealedFooter={renderRevealedFooter}
              >
                <Text style={styles.subTitleInfo}>{overview}</Text>
              </ReadMore>
            </SectionRow>
            <SectionRow title="Main cast">
              <PersonListRow
                data={cast}
                type="character"
                keyItem="creditId"
                ListEmptyComponent={renderListEmpty}
                actionTeamDetail={actionPerson}
                renderItem={renderItem}
              />
            </SectionRow>
            <SectionRow title="Main technical team">
              <PersonListRow
                data={crew}
                type="job"
                keyItem="creditId"
                ListEmptyComponent={renderListEmpty}
                actionTeamDetail={actionPerson}
                renderItem={renderItem}
              />
            </SectionRow>
            <SectionRow title="Producer" isLast>
              <PersonListRow
                data={productionCompanies}
                type="production"
                keyItem="id"
                ListEmptyComponent={renderListEmpty}
                actionTeamDetail={actionPerson}
                renderItem={renderItem}
              />
            </SectionRow>
          </View>
        </ScrollView>
      )}
      <PersonModal
        isVisible={isVisible}
        creditId={creditId}
        actionClose={actionPerson}
        style={styles.bottomModal}
      />
    </View>
  );
}
MovieDetails.navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};
  return {
    title: 'Movie details',
    headerRight: (
      <TouchableOpacity
        style={styles.buttonShare}
        onPress={params.actionShare}
      >
        <Feather name="share" size={23} color={darkBlue} />
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: white
  },
  buttonShare: {
    paddingRight: 15,
    paddingLeft: 20
  },
  containerMovieInfo: {
    margin: 20,
    marginTop: 35
  },
  subTitleInfo: {
    fontSize: fontSizeResponsive(2.1),
    color: blue,
    textAlign: 'justify'
  },
  readMore: {
    color: pink,
    marginTop: 5,
    textAlign: 'right'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  }
});

export default MovieDetails;