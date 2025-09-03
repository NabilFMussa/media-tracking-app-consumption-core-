import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';

interface props {
  placeholder: string;
  value?: string;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
}
const SearchBar = ({onChangeText, value, placeholder,onPress}: props) => {
  return (
    <View style={{borderRadius:40}} className='flex-row items-center bg-[#1c1c1c] rounded-full mt-3'>
        <Ionicons name='search' size={20} className='bg-translucent' color="grey" />
        <TextInput 
            onPress={onPress}
            placeholder= {placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={'lightgray'}  
            className='flex-1 ml-2 text-[lightgray] text-base'
        />
    </View>
  )
}

export default SearchBar