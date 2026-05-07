import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrade, getTradesByParticipant, createTrade, cancelTrade, CreateTradeParams } from '@/lib/azaka/trade';
import { Trade } from '@/lib/azaka/types';

export const useTrade = (tradeId: string) => {
  return useQuery<Trade | null>({
    queryKey: ['trade', tradeId],
    queryFn: () => getTrade(tradeId),
    refetchInterval: 10000, // Poll every 10 seconds
    enabled: !!tradeId,
  });
};

export const useTradesByParticipant = (
  address: string,
  role?: 'exporter' | 'importer' | 'bank'
) => {
  return useQuery<Trade[]>({
    queryKey: ['trades', address, role],
    queryFn: () => getTradesByParticipant(address, role),
    enabled: !!address,
  });
};

export const useCreateTrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateTradeParams) => createTrade(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};

export const useCancelTrade = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: string) => cancelTrade(tradeId),
    onSuccess: (_, tradeId) => {
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
    },
  });
};
