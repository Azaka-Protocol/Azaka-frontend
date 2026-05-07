import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDocuments,
  getDocumentByType,
  submitDocument,
  verifyDocument,
  SubmitDocumentParams,
} from '@/lib/azaka/documents';
import { Document, DocumentType } from '@/lib/azaka/types';

export const useDocuments = (tradeId: string) => {
  return useQuery<Document[]>({
    queryKey: ['documents', tradeId],
    queryFn: () => getDocuments(tradeId),
    enabled: !!tradeId,
  });
};

export const useDocument = (tradeId: string, docType: DocumentType) => {
  return useQuery<Document | null>({
    queryKey: ['document', tradeId, docType],
    queryFn: () => getDocumentByType(tradeId, docType),
    enabled: !!tradeId,
  });
};

export const useSubmitDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SubmitDocumentParams) => submitDocument(params),
    onSuccess: (_, { tradeId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['escrow', tradeId, 'release-conditions'] });
    },
  });
};

export const useVerifyDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tradeId, docType }: { tradeId: string; docType: DocumentType }) =>
      verifyDocument(tradeId, docType),
    onSuccess: (_, { tradeId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['trade', tradeId] });
      queryClient.invalidateQueries({ queryKey: ['escrow', tradeId, 'release-conditions'] });
    },
  });
};
