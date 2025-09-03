import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { fetchMovieDetails } from '../services/api';
import useFetch from '../services/useFetch';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({label, value}: MovieInfoProps ) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-gray-200 font-normal text-sm'>{label}</Text>
    <Text className='text-gray-100 font-bold text-sm mt-2'>{value || "N/A"}</Text>
  </View>
)

const MovieDetails = () => {

  const {id} = useLocalSearchParams();

  const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string));

  return (
    <View className='bg-[#1C1C1C] flex-1'>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}} className='w-full h-[550px]' resizeMode='stretch'/>
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>
          <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-gray-200 text-sm '>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-gray-200 text-sm '>{movie?.runtime}m </Text>
          </View>
          <View className='flex-row items-center bg-[#1C1C1C]-100 px-2 py-1 rounder-md gap-x-1 mt-2 '>
            <Ionicons name='star' color='yellow'></Ionicons>
            <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}/10</Text>
            <Text className='text-gray-200 text-sm'>({movie?.vote_count} votes)</Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview}/>
          <MovieInfo label="Genres" value={movie?.genres?.map((g) => g.name).join('-') || 'N/A'}/>

          <View className='flex-row justify-between w-1/2 '>
            <MovieInfo label="Budget" value={`$${movie?.budget / 1000000} million`}/>
            <MovieInfo label="Revenue" value={`$${Math.round(movie?.revenue)/1000000} `}/>
          </View>

          <MovieInfo label="Production Companies" value={movie?.production_companies?.map((c) => c.name).join('-') || 'N/A'}/>
        </View>
      </ScrollView>

      <TouchableOpacity className='absolute bg-[#07c100] bottom-5 left-0 right-0 mx-5 rounded-lg py-3.5 flex-row items-center justify-center z-50' onPress={router.back}>
        <Ionicons name="arrow-back-circle-outline" size={20} color="lightgray" />      
        <Text className='text-white font-semibold text-base'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails