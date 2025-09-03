import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import SearchBar from "../components/SearchBar";
import { fetchMovies } from "../services/api";
import { updateSearchCount } from '../services/appwrite';
import useFetch from "../services/useFetch";

const search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {refetch:loadMovies, reset, data: movies, loading: moviesLoading, error: moviesError} = useFetch(() => fetchMovies({query: searchQuery}), false)  

  useEffect(() => {
    const timeoutId = setTimeout( async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset()
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    if(movies?.length > 0 && movies?.[0]) {
          updateSearchCount(searchQuery, movies[0]);
    }
   }, [movies]);

  return (
    <View className="flex-1 bg-[#262727]">
      <FlatList 
        data={movies} 
        renderItem={({ item }) => <MovieCard{...item}/>}
        keyExtractor={(item) => item.id.toString()}
        className="px-5" numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{paddingBottom: 100}}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row items-center justify-center mt-20">
              <Image source={require('../../assets/images/CC_trans.png')} className="h-10 w-40" resizeMode="contain"/>
            </View>

            <View className="my-5">
              <SearchBar 
                value ={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                placeholder="Search for a movie"/>
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" className="my-3"/>
            )}

            {moviesError && (
              <Text className="text-red-500 px-5 my-3">
                Error: {moviesError.message}
              </Text>
            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
              <Text className="text-white font-bold text-xl">
                Search results for {''}
                <Text className="font-bold text-[#07c100]">{searchQuery}</Text>
              </Text>
        )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500 text-xl'>
                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default search