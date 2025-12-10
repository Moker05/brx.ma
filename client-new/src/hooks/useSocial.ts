import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { socialAPI } from '../services/socialAPI';

export function usePostsBySymbol(symbol?: string, page = 1) {
  return useQuery({
    queryKey: ['posts', symbol, page],
    queryFn: () => socialAPI.getPostsBySymbol(symbol || '', page),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: socialAPI.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: socialAPI.likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => socialAPI.getUserProfile(userId),
  });
}

export function useLeaderboard(period: string, limit = 50) {
  return useQuery({
    queryKey: ['leaderboard', period, limit],
    queryFn: () => socialAPI.getLeaderboard(period, limit),
  });
}
