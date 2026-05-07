import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getEscrow,
  depositEscrow,
  releaseEscrow,
  refundEscrow,
  checkReleaseConditions,
} from '@/lib/azaka/escrow';
import { Escrow } from '@/lib/azaka/types';

export const useEscrow = (tradeId: string) => {
  return useQuery<Escrow | null>({
    queryKey: ['escrow', tradeId],
    queryFn: () => getEscrow(tradeId),
    enabled: !!tradeId,
  });
};

export const useReleaseConditions = (tradeId: string) => {
  return useQuery({
    queryKey: ['escrow', tradeId, 'release-conditions'],
    queryFn: () => checkReleaseConditions(tradeId),
    enabled: !!tradeId,
  });
};

export const useDepositEscrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeId, amount, asset }: { tradeId: string; amount: string; asset: string }) =>
      depositEscrow(tradeId, amount, asset),
    onSuccess: (_, { tradeId }) => {
      queryClient.invalidateQueries({ queryKey: ['escrow', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
    },
  });
};

export const useReleaseEscrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: string) => releaseEscrow(tradeId),
    onSuccess: (_, tradeId) => {
      queryClient.invalidateQueries({ queryKey: ['escrow', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
    },
  });
};

export const useRefundEscrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tradeId: string) => refundEscrow(tradeId),
    onSuccess: (_, tradeId) => {
      queryClient.invalidateQueries({ queryKey: ['escrow', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
    },
  });
};
