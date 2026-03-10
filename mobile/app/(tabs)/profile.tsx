import { View, Text, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/expo'

const ProfileTab = () => {
  const { signOut } = useAuth()
  return (
    <ScrollView className='bg-surface'
      contentInsetAdjustmentBehavior='automatic'>
      <Text className='text-white'>ProfileTab</Text>
      <Pressable
        className='bg-red-500 p-2 rounded-md'
        onPress={() => signOut()}>
        <Text className='text-white'>Sign Out</Text>
      </Pressable>
    </ScrollView>
  )
}

export default ProfileTab