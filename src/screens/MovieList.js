import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Spinner from '../components/common/Spinner';
import NotificationCard from '../components/cards/NotificationCard';
import FilterModal from '../components/modals/FilterModal';
import MovieListRow from '../components/cards/rows/MovieListRow';
import MovieRow from '../components/cards/rows/MovieRow';
import { TouchableOpacity } from '../components/common/TouchableOpacity';
import request from '../services/API';
import { getItem } from '../utils/AsyncStorage';
import { white, lightGray, darkBlue } from '../styles/Colors';
import { fontSizeResponsive } from '../utils/Metrics';
import useCallbackState from '../utils/UseCallbackState';

const MovieList = ({ navigation }) => {
  const [states, setStates] = useCallbackState({
    isVisible: false,
    isLoading: false,
    isRefresh: false,
    isLoadingMore: false,
    isError: false,
    hasAdultContent: false,
    filterType: 'popularity.desc',
    filterName: 'Most popular',
    results: [],
    page: 1,
    numColumns: 1,
    keyGrid: 1
  });
  
  const getContent = async () => {
    try {
      navigation.setParams({ actionFilter });

      const hasAdultContent = await getItem('@ConfigKey', 'hasAdultContent');

      setStates({ ...states, hasAdultContent }, () => {
        requestMoviesList();
      });
    } catch (error) {
      console.log(error);
      requestMoviesList();
    }
  };

  useEffect(() => {
    getContent();
  }, []);

  const requestMoviesList = async () => {
    try {
      setStates({ ...states, isLoading: true });

      const { page, filterType, hasAdultContent } = states;
      const dateRelease = new Date().toISOString().slice(0, 10);

      const data = await request('discover/movie', {
        page,
        'release_date.lte': dateRelease,
        sort_by: filterType,
        with_release_type: '1|2|3|4|5|6|7',
        include_adult: hasAdultContent,
      });

      // setStates(({ isRefresh, results }) => ({
      //   isLoading: false,
      //   isRefresh: false,
      //   isLoadingMore: false,
      //   isError: false,
      //   totalPages: data.total_pages,
      //   results: isRefresh ? data.results : [...results, ...data.results]
      // }));
      setStates({
        ...states,
        isLoading: false,
        isRefresh: false,
        isLoadingMore: false,
        isError: false,
        totalPages: data.total_pages,
        results: states.isRefresh ? data.results : [...states.results, ...data.results]
      });
    } catch (err) {
      setStates({
        ...states,
        isLoading: false,
        isRefresh: false,
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
  const actionRefresh = () => {
    setStates({ ...states, isRefresh: true, page: 1 }, () => {
      requestMoviesList();
    });
  };
  const actionLoadMore = () => {
    // setStates(
    //   ({ page }) => ({
    //     ...states,
    //     isLoadingMore: true,
    //     page: page + 1
    //   }),
    //   () => { requestMoviesList(); }
    // );
    setStates({ ...states, isLoadingMore: true, page: states.page + 1 }, () => { 
      requestMoviesList(); 
    });
  };
  const actionGrid = () => {
    // setStates(({ numColumns, keyGrid }) => {
    //   return { numColumns: numColumns === 1 ? 2 : 1, keyGrid: keyGrid + 1 };
    // });
    setStates({ 
      ...states,
      numColumns: states.numColumns === 1 ? 2 : 1, 
      keyGrid: states.keyGrid + 1 
    });
  };
  const actionFilter = () => {
    // setStates(({ isVisible }) => {
    //   return { isVisible: !isVisible };
    // });
    setStates({ ...states, isVisible: !states.isVisible });
  };
  const actionSwitchMovie = (filterType, filterName, isVisible) => {
    if (states.filterType !== filterType) {
      setStates({ ...states, filterType, filterName, isVisible, page: 1, results: [] }, () => {
        requestMoviesList();
      });
    } else {
      setStates({ ...states, isVisible });
    }
  };

  const {
    isLoading,
    isRefresh,
    isLoadingMore,
    isError,
    results,
    filterName,
    isVisible,
    filterType,
    numColumns,
    keyGrid
  } = states;

  return (
    <View style={styles.container}>
      {isLoading && !isRefresh && !isLoadingMore ? (
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
              <Text style={styles.textMain} numberOfLines={1}>{filterName}</Text>
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
            type="normal"
            isSearch={false}
            keyGrid={keyGrid}
            numColumns={numColumns}
            refreshing={isRefresh}
            onRefresh={actionRefresh}
            ListFooterComponent={renderFooter}
            navigate={navigation.navigate}
            renderItem={renderItem}
          />
        </View>
      )}
      <FilterModal
        isVisible={isVisible}
        filterType={filterType}
        filterName={filterName}
        actionFilter={actionFilter}
        actionSwitchMovie={actionSwitchMovie}
        style={styles.bottomModal}
      />
    </View>
  );
}
MovieList.navigationOptions = ({ navigation }) => {
  const params = navigation.state.params || {};

  return {
    headerRight: (
      <TouchableOpacity
        style={styles.buttonFilter}
        onPress={params.actionFilter}
      >
        <Feather name="filter" size={23} color={darkBlue} />
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  buttonFilter: {
    paddingRight: 15,
    paddingLeft: 20
  },
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
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
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

export default MovieList;