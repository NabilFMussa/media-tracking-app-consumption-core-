import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import TrendingCard from "../components/TrendingCard";
import { fetchMovies } from "../services/api";
import { addBookmark, getBookmarks, getTrendingMovies, removeBookmark } from '../services/appwrite';
import useFetch from "../services/useFetch";


export default function Index() {
  const router = useRouter();

  const {data: trendingMovies, loading: trendingLoading, error: trendingError} = useFetch(getTrendingMovies);
  const { data: movies, loading: moviesLoading, error: moviesError} = useFetch(() => fetchMovies({query: ''}))

  const [bookmarks, setBookmarks] = useState<any[]>([]);
  useEffect(() => {
    const fetchBookmarks = async () => {
      const result = await getBookmarks();
      setBookmarks(result.documents || []);
    };
    fetchBookmarks();
  }, []);

  const handleAddBookmark = async (movie: Movie) => {
    try {
      console.log('Adding bookmark for movie:', movie.title);
      await addBookmark(movie);
      const result = await getBookmarks();
      console.log('Updated bookmarks:', result.documents.length);
      setBookmarks(result.documents || []);
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }
  };

  const handleRemoveBookmark = async (movie: Movie) => {
    try {
      const found = bookmarks.find(b => b.movie_id === movie.id);
      if (found) {
        console.log('Removing bookmark for movie:', movie.title);
        await removeBookmark(found.$id);
        const result = await getBookmarks();
        console.log('Updated bookmarks:', result.documents.length);
        setBookmarks(result.documents || []);
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const isBookmarked = (movie: any) => bookmarks.some(b => b.movie_id == movie.id);

  return (
    <View className="flex-1 bg-[#262727] ">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Image source={require('../../assets/images/CC_trans.png')} className="h-10 w-40 mt-20 mx-auto" resizeMode="contain"/>

        {moviesLoading || trendingLoading? (
          <ActivityIndicator
            size='large'
            color='grey'
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
            <View className="flex-1">

              <SearchBar
                onPress = {() => router.push("/search")}
                placeholder="Search for a movie"
              />

              {trendingMovies && (
                <View className="mt-10">
                  <Text className="text-lg text-white font-bold mb-3">Trending Movies</Text>
                </View>
              )}

              <FlatList 
                horizontal
                ItemSeparatorComponent={() => <View className="w-8"/> }
                className="mb-4 mt-3"  
                showsHorizontalScrollIndicator={false}
                data={trendingMovies} 
                renderItem={({item, index})=>(
                    <TrendingCard movie={item} index={index}/>
                  )}
                keyExtractor={(item) => item.movie_id.toString()}
               />

              <>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => (
                    <MovieCard
                      {...item}
                      isBookmarked={isBookmarked(item)}
                      onBookmark={() => handleAddBookmark(item)}
                      onUnbookmark={() => handleRemoveBookmark(item)}
                    />
                  )}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}