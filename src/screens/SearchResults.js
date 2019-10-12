import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Spinner from '../components/common/Spinner';
import NotificationCard from '../components/cards/NotificationCard';
import MovieListRow from '../components/cards/rows/MovieListRow';
import MovieRow from '../components/cards/rows/MovieRow';
import { TouchableOpacity } from '../components/common/TouchableOpacity';
import request from '../services/API';
import { getItem } from '../utils/AsyncStorage';
import { white, darkBlue, lightGray } from '../styles/Colors';
import { fontSizeResponsive } from '../utils/Metrics';
import useCallbackState from '../utils/UseCallbackState';

const SearchResults = ({ navigation }) => {
  const [states, setStates] = useCallbackState({
    isLoading: false,
    isLoadingMore: false,
    isError: false,
    hasAdultContent: false,
    results: [],
    page: 1,
    numColumns: 1,
    keyGrid: 1,
    id: navigation.state.params.id,
    name: navigation.state.params.name,
    typeRequest: navigation.state.params.typeRequest
  });
  const getContent = async () => {
    try {
      const hasAdultContent = await getItem('@ConfigKey', 'hasAdultContent');

      setStates({ ...states, hasAdultContent }, () => {
        requestMoviesList();
      });
    } catch (error) {
      requestMoviesList();
    }
  }
  useEffect(() => {
    getContent();
  }, []);

  const requestMoviesList = async () => {
    try {
      setStates({ ...states, isLoading: true });

      const { page, name, id, typeRequest, hasAdultContent } = states;
      const dateRelease = new Date().toISOString().slice(0, 10);
      const query =
        typeRequest === 'search'
          ? { query: `${name.trim()}` }
          : { with_genres: `${id}` };

      const data = await request(`${typeRequest}/movie`, {
        page,
        'release_date.lte': dateRelease,
        with_release_type: '1|2|3|4|5|6|7',
        include_adult: hasAdultContent,
        ...{ ...query }
      });

      setStates({
        ...states,
        isLoading: false,
        isLoadingMore: false,
        isError: false,
        totalPages: data.total_pages,
        results: [...states.results, ...data.results]
      });
    } catch (err) {
      setStates({
        ...states,
        isLoading: false,
        isLoadingMore: false,
        isError: true
      });
    }
  };
  const renderItem = (item, type, isSearch, numColumns, navigate) => (
    <MovieRow
      item={item}
      type={type}
      isSearch={isSearch}
      numColumns={numColumns}
      navigate={navigate}
    />
  );
  const renderFooter = () => {
    const { isLoadingMore, totalPages, page, results } = states;

    if (isLoadingMore) return <Spinner size="small" />;

    if (totalPages !== page && results.length > 0) {
      return (
        <View style={styles.loadingMore}>
          <TouchableOpacity
            style={styles.loadingButton}
            onPress={actionLoadMore}
          >
            <Text style={styles.loadingText}>Load more</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (results.length > 0) return <View style={styles.loadingMore} />;

    return null;
  };
  const actionLoadMore = () => {
    setStates({ ...states, isLoadingMore: true, page: states.page + 1 }, () => {
      requestMoviesList();
    });
  };
  const actionGrid = () => {
    // setStates(({ numColumns, keyGrid }) => {
    //   return { ...states, numColumns: numColumns === 1 ? 2 : 1, keyGrid: keyGrid + 1 };
    // });
    setStates({ 
      ...states, 
      numColumns: states.numColumns === 1 ? 2 : 1, 
      keyGrid: states.keyGrid + 1 
    });
  };

  const {
    name,
    typeRequest,
    isLoading,
    isLoadingMore,
    isError,
    results,
    numColumns,
    keyGrid
  } = states;
  const { navigate } = navigation;

  return (
    <View style={styles.container}>
      {isLoading && !isLoadingMore ? (
        <Spinner />
      ) : isError ? (
        <NotificationCard
          icon="alert-octagon"
          action={requestMoviesList}
        />
      ) : results.length === 0 ? (
        <NotificationCard
          icon="thumbs-down"
          textError="No results available."
        />
      ) : (
        <View style={styles.containerList}>
          {results.length > 0 && (
            <View style={styles.containerMainText}>
              <Text style={styles.textMain} numberOfLines={1}>
                {name}
              </Text>
              <TouchableOpacity
                style={[
                  styles.buttonGrid,
                  numColumns === 2 && styles.buttonGridActive
                ]}
                onPress={actionGrid}
              >
                <Feather name="grid" size={22} color={darkBlue} />
              </TouchableOpacity>
            </View>
          )}
          <MovieListRow
            data={results}
            type={name}
            isSearch={typeRequest === 'search'}
            keyGrid={keyGrid}
            numColumns={numColumns}
            refreshing={null}
            onRefresh={null}
            ListFooterComponent={renderFooter}
            navigate={navigate}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
}
SearchResults.navigationOptions = () => {
  return {
    title: 'Search result'
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center'
  },
  containerList: {
    justifyContent: 'center',
    flex: 1
  },
  containerMainText: {
    paddingVertical: 25,
    paddingHorizontal: 20
  },
  textMain: {
    fontSize: fontSizeResponsive(3),
    fontWeight: 'bold',
    color: darkBlue,
    width: '80%'
  },
  buttonGrid: {
    position: 'absolute',
    right: 12,
    top: 18,
    padding: 8,
    borderRadius: 100
  },
  buttonGridActive: {
    backgroundColor: lightGray
  },
  loadingMore: {
    paddingTop: 20,
    paddingBottom: 50,
    justifyContent: 'center',
    alignItems: 'center'
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
    color: darkBlue,
    textAlign: 'center'
  }
});

export default SearchResults;