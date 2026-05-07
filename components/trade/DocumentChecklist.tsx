'use client';

import { useState } from 'react';
import { useDocuments, useSubmitDocument } from '@/hooks/useDocuments';
import { DocumentType, getDocumentTypeLabel } from '@/lib/azaka/types';
import { AddressDisplay } from '@/components/shared/AddressDisplay';
import { formatRelativeTime } from '@/lib/utils/format';
import { hashFile, uploadToIPFS, validateFileSize, validateFileType, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE_MB } from '@/lib/utils/documents';
import { showTxPending, showTxSuccess, showTxError, dismissTx } from '@/components/shared/TxToast';
import clsx from 'clsx';

interface DocumentChecklistProps {
  tradeId: string;
  requiredDocuments: DocumentType[];
  canSubmit: boolean;
}

export const DocumentChecklist = ({ tradeId, requiredDocuments, canSubmit }: DocumentChecklistProps) => {
  const { data: documents, isLoading } = useDocuments(tradeId);
  const submitDocument = useSubmitDocument();
  const [uploadingDoc, setUploadingDoc] = useState<DocumentType | null>(null);
  const [computedHash, setComputedHash] = useState<string | null>(null);

  const handleFileSelect = async (docType: DocumentType, file: File) => {
    setUploadingDoc(docType);
    setComputedHash(null);

    try {
      // Validate file
      if (!validateFileSize(file, MAX_FILE_SIZE_MB)) {
        throw new Error(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      }

      if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
        throw new Error('Invalid file type. Please upload PDF, image, or document file.');
      }

      const toastId = showTxPending('Processing document...');

      // Hash file in browser
      const hash = await hashFile(file);
      setComputedHash(hash);

      // Upload to IPFS
      const ipfsUri = await uploadToIPFS(file);

      dismissTx(toastId);

      // Submit to contract
      const txToastId = showTxPending('Submitting document to blockchain...');
      const txHash = await submitDocument.mutateAsync({
        tradeId,
        docType,
        hash,
        ipfsUri,
      });

      dismissTx(txToastId);
      showTxSuccess(txHash, 'Document submitted successfully');
    } catch (error) {
      showTxError(error as Error);
    } finally {
      setUploadingDoc(null);
      setComputedHash(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {requiredDocuments.map((docType) => (
          <div key={docType} className="p-4 bg-surface-secondary rounded-lg animate-pulse">
            <div className="h-4 bg-border rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requiredDocuments.map((docType) => {
        const doc = documents?.find(d => d.docType === docType);
        const isSubmitted = doc && doc.hash;
        const isVerified = doc?.verified;
        const isUploading = uploadingDoc === docType;

        return (
          <div
            key={docType}
            className={clsx(
              'p-4 border rounded-lg transition-colors',
              isVerified ? 'border-success bg-success/5' : 'border-border bg-surface'
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {isVerified ? '✅' : isSubmitted ? '📄' : '⏳'}
                  </span>
                  <h4 className="font-medium text-text-primary">
                    {getDocumentTypeLabel(docType)}
                  </h4>
                </div>

                {isSubmitted && doc && (
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">Hash:</span>
                      <span className="font-mono text-xs text-text-secondary">
                        {doc.hash.slice(0, 16)}...{doc.hash.slice(-16)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-muted">Submitted by:</span>
                      <AddressDisplay address={doc.submittedBy} showCopy={false} />
                    </div>
                    <div className="text-text-muted">
                      {formatRelativeTime(doc.submittedAt)}
                    </div>
                    {isVerified && doc.signers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">Verified by:</span>
                        <AddressDisplay address={doc.signers[0]} showCopy={false} />
                      </div>
                    )}
                  </div>
                )}

                {isUploading && computedHash && (
                  <div className="mt-2 p-3 bg-brand-light rounded-md">
                    <div className="text-sm text-brand font-medium mb-1">
                      Computed SHA-256 Hash:
                    </div>
                    <div className="font-mono text-xs text-text-primary break-all">
                      {computedHash}
                    </div>
                  </div>
                )}
              </div>

              {!isSubmitted && canSubmit && (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept={ALLOWED_DOCUMENT_TYPES.join(',')}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileSelect(docType, file);
                      }
                    }}
                    disabled={isUploading}
                  />
                  <div
                    className={clsx(
                      'px-4 py-2 rounded-md font-medium text-sm transition-colors',
                      isUploading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-brand text-white hover:bg-brand-dark'
                    )}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </div>
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
