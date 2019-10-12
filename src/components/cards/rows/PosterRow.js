import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import ImagesModal from '../../modals/ImagesModal';
import { TouchableOpacity } from '../../common/TouchableOpacity';
import { notFound } from '../../../utils/StaticImages';
import { white, pink } from '../../../styles/Colors';
import { fontSizeResponsive, width } from '../../../utils/Metrics';

const PosterRow = ({
  title,
  backdropPath,
  voteAverage,
  images,
  video,
  showImage,
  onPress,
  navigate
}) => {
  const getImageApi = backdropPath => {
    return backdropPath
      ? { uri: `https://image.tmdb.org/t/p/w500/${backdropPath}` }
      : notFound;
  };
  const convertRatingToStars = voteAverage => {
    const average = voteAverage > 5 ? Math.round(voteAverage) : voteAverage;
    const length = average !== 10 ? parseInt(`${average}`.charAt(0)) - 5 : average - 5;

    return average <= 5
      ? null
      : [...Array(length)].map((e, i) => (
          <FontAwesome
            key={i}
            name="star"
            size={width * 0.06}
            color={white}
            style={styles.star}
          />
        ));
  };
  const actionPlayVideo = (video, navigate) => {
    const { key } = video;

    navigate('WebView', { key });
  };

  return (
    <View style={styles.containerMainPhoto}>
      <Image
        source={getImageApi(backdropPath)}
        style={styles.mainPhoto}
        resizeMode="cover"
      />
      {video && video.site === 'YouTube' && (
        <TouchableOpacity
          style={styles.play}
          onPress={() => actionPlayVideo(video, navigate)}
        >
          <FontAwesome
            name="play"
            size={width * 0.07}
            color={white}
            style={styles.buttonPlay}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.containerMainPhotoInfo}
        activeOpacity={images.length ? 0.5 : 1}
        onPress={images.length ? onPress : null}
      >
        <View style={styles.containerBackgroundPhotoInfo}>
          <Text numberOfLines={2} style={styles.photoInfo}>{title}</Text>
          <View style={styles.photoStar}>
            {convertRatingToStars(voteAverage)}
          </View>
        </View>
      </TouchableOpacity>
      {images.length ? (
        <ImagesModal
          showImage={showImage}
          images={images}
          actionClose={onPress}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  containerMainPhoto: {
    width,
    height: width * 0.6
  },
  mainPhoto: {
    width: '100%',
    height: '100%'
  },
  play: {
    position: 'absolute',
    zIndex: 1,
    bottom: -20,
    right: 15,
    borderRadius: width * 0.32,
    backgroundColor: pink,
    width: width * 0.16,
    height: width * 0.16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerMainPhotoInfo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  containerBackgroundPhotoInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20
  },
  photoInfo: {
    fontSize: fontSizeResponsive(3.8),
    color: white,
    fontWeight: 'bold'
  },
  photoStar: {
    flexDirection: 'row',
    marginTop: 8
  },
  buttonPlay: {
    marginLeft: 5
  },
  star: {
    marginRight: 5
  }
});

export default PosterRow;