import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ChatDetailScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className='flex-1'
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text className='text-white'>ChatDetailScreen</Text>
    </View>
  )
}

export default ChatDetailScreen
