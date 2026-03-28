import { View, Text, ActivityIndicator, FlatList, Pressable } from 'react-native'
import ChatItem from '@/components/ChatItem'
import React from 'react'
import { useRouter } from 'expo-router'
import { useChats } from '@/hooks/useChats'
import { Chat } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import EmptyUI from '@/components/EmptyUI'

const ChatsTab = () => {
  const router = useRouter()
  const { data: chats, isLoading, error, refetch } = useChats()

  if (isLoading) {
    return (
      <View className='flex-1 justify-center items-center bg-surface'>
        <ActivityIndicator size={"large"} color={"#f4a261"} />
      </View>
    )
  }
  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-surface'>
        <Text className="text-red-500 text-3xl">Failed to load chats</Text>
        <Pressable onPress={() => refetch()} className="mt-4 px-4 py-2 bg-primary rounded-lg">
          <Text className="text-foreground">Retry</Text>
        </Pressable>
      </View>
    )
  }

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]",
      params: {
        id: chat._id.toString(),
        participantId: chat.participant._id.toString(),
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    })
  }
  // console.log("chatsssssssssss", chats)
  return (
    <View className='flex-1 bg-surface'>
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ChatItem chat={item} onPress={() => handleChatPress(item)} />}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={<EmptyUI
          title="No chats yet"
          subtitle="Start a conversation!"
          iconName="chatbubbles-outline"
          iconColor="#6B6B70"
          iconSize={64}
          buttonLabel="New Chat"
          onPressButton={() => router.push("/new-chat")}
        />}
      />
    </View>
  )
}

export default ChatsTab


function Header() {
  const router = useRouter();

  return (
    <View className="px-5 pt-2 pb-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">Chats</Text>
        <Pressable
          className="size-10 bg-primary rounded-full items-center justify-center"
          onPress={() => router.push("/new-chat")}
        >
          <Ionicons name="create-outline" size={20} color="#0D0D0F" />
        </Pressable>
      </View>
    </View>
  );
}