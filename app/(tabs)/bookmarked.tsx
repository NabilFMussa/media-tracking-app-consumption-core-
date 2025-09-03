import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import { getBookmarks, removeBookmark, subscribeToBookmarks } from '../services/appwrite';



const BookmarkedTab = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const result = await getBookmarks();
      console.log('Fetched bookmarks:', result.documents.length);
      setBookmarks(result.documents || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
    // Subscribe to real-time updates
    const unsubscribe = subscribeToBookmarks((updatedBookmarks) => {
      setBookmarks(updatedBookmarks);
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleRemoveBookmark = async (documentId: string) => {
    try {
      await removeBookmark(documentId);
      await fetchBookmarks();
    } catch (err) {
      console.error('Error removing bookmark:', err);
      setError('Failed to remove bookmark');
    }
  };

  return (
    
    <View className="flex-1 bg-[#262727] px-4 pt-8">
      <Image source={require('../../assets/images/CC_trans.png')} className="h-10 w-40 mt-20 mx-auto" resizeMode="contain"/>
      <Text className="text-white text-xl font-bold mb-10 mt-10">Bookmarked Movies</Text>
      {loading ? (
        <ActivityIndicator size="large" color="grey" className="mt-10 self-center" />
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : bookmarks.length === 0 ? (
        <Text className="text-[lightgray] mt-10">No bookmarks found.</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={item => item.$id}
          numColumns={3}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          columnWrapperStyle={{ gap: 20, justifyContent: 'flex-start', marginBottom: 8 }}
          renderItem={({ item }) => (
            <MovieCard
              id={item.movie_id}
              poster_path={item.poster_url.replace('https://image.tmdb.org/t/p/w500', '')}
              title={item.title}
              vote_average={item.vote_average || 0}
              release_date={item.release_date || ''}
              overview={item.overview || ''}
              adult={false}
              backdrop_path={''}
              genre_ids={[]}
              original_language={''}
              original_title={item.title}
              popularity={0}
              video={false}
              vote_count={0}
              isBookmarked={true}
              onUnbookmark={() => handleRemoveBookmark(item.$id)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default BookmarkedTab;