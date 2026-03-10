import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@clerk/expo'



const TabsLayout = () => {
  // todo: auth redirect
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null
  if (!isSignedIn) return <Redirect href="/(auth)" />
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0d0f',
          borderTopColor: "#1a1a1d",
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#f4a261",
        tabBarInactiveTintColor: "#6b6b70",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Chats', tabBarIcon: ({ color, focused, size }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} color={color} size={size} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, focused, size }) => <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} /> }} />
    </Tabs>
  )
}

export default TabsLayout