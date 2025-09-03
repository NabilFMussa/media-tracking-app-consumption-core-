import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({id, poster_path, title, vote_average, release_date, overview, isBookmarked, onBookmark, onUnbookmark}: Movie & {
  isBookmarked?: boolean;
  onBookmark?: () => void;
  onUnbookmark?: () => void;
}) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-[30%]'>
                <Image
                    source={{
                        uri: poster_path
                            ? `https://image.tmdb.org/t/p/w500${poster_path}`
                            : 'https://placehold.co/600x400/1a1a1a/ffffff.png'
                    }}
                    className='w-full h-60 rounded-lg'
                    resizeMode='cover'
                />

                <Text className='text-sm text-white font-bold mt-1' numberOfLines={1}>{title}</Text>
                <Text className='text-xs text-[lightgray] mt-1' numberOfLines={2}>{overview}</Text>
                <View className='flex-row items-center justify-start gap-x-1 mt-1'>
                    <Ionicons name='star' color='yellow' size={14}/>
                    <Text className='text-[lightgray] text-xs'>{vote_average.toFixed(1)}/10</Text>
                </View>

                <View className='flex-row items-center justify-between mt-1'>
                    <Text className='text-xs text-[gray] font-medium'>
                        {release_date?.split('-')[0]}
                    </Text>
                    <Text className='text-xs font-medium text-[gray]'>Movie</Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isBookmarked ? onUnbookmark?.() : onBookmark?.();
                  }}
                  className='absolute top-2 right-2 z-10'
                  accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={24}
                    color={isBookmarked ? 'gold' : 'white'}
                  />
                </TouchableOpacity>
            </TouchableOpacity>
        </Link>
    )
}

export default MovieCard