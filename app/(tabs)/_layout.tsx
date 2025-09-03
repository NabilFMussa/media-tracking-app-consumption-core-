import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'
import { View } from 'react-native'



const _layout = () => {
  return (
    <Tabs
    screenOptions={{
        tabBarStyle:
                {
                    position: 'absolute',
                    height: 40,    
                    borderTopWidth:0,
                    bottom: 30,
                    marginHorizontal: 40,
                    backgroundColor: '#1C1C1C',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                    
                },
    }}
    >
        <Tabs.Screen
            name="index"
            options=
            {{  
                title: 'home',
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <View
                        style={{
                            backgroundColor: focused ? '#07c100' : 'transparent',
                            borderRadius: 50,
                            width: '200%',
                            height: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons 
                        name={focused ? 'home' : 'home-outline'} 
                        size={size} 
                        color={'lightgray'}
                        />

                    </View>
                ),
                
            }}
        
        />
        <Tabs.Screen
            name='search'
            options={{
                title: 'Search',
                headerShown: false,
                tabBarShowLabel: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <View
                        style={{
                            backgroundColor: focused ? '#07c100' : 'transparent',
                            borderRadius: 50,
                            width: '200%',
                            height: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons 
                        name={focused ? 'search' : 'search-outline'} 
                        size={size} 
                        color={'lightgray'}
                        />

                    </View>
                ),
            }}
        />
        <Tabs.Screen
            name='bookmarked'
            options={{
                tabBarShowLabel: false,
                title: 'Bookmarks',
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => (
                    <View
                        style={{
                            backgroundColor: focused ? '#07c100' : 'transparent',
                            borderRadius: 16,
                            width: '200%',
                            height: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <Ionicons 
                        name={focused ? 'bookmarks' : 'bookmarks-outline'} 
                        size={size} 
                        color={'lightgray'}
                        />

                    </View>
                ),
            }}
        />   
    </Tabs>
    
  )
}

export default _layout