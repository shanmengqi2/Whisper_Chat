import { useApi } from "@/lib/axios";
import type { Chat } from "@/types";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChats = () => {
  const { apiWithAuth } = useApi();

  return useQuery({
    queryKey: ['chats'],
    queryFn: async (): Promise<Chat[]> => {
      const { data } = await apiWithAuth<Chat[]>({
        method: 'get',
        url: '/chats',
      });
      return data;
    }
  })
}

export const useGetOrCreateChat = () => {
  const { apiWithAuth } = useApi()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (particantId: string) => {
      const { data } = await apiWithAuth<Chat>({
        method: "POST",
        url: `/chats/with/${particantId}`,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  })
}