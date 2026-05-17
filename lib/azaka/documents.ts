import { getAzakaClient } from './client';
import { Document, DocumentType } from './types';

export interface SubmitDocumentParams {
  tradeId: string;
  docType: DocumentType;
  hash: string;
  ipfsUri: string;
}

export const submitDocument = async (_params: SubmitDocumentParams): Promise<string> => {
  getAzakaClient();

  // Simulate transaction
  return 'mock-submit-doc-tx-' + Date.now();
};

export const getDocuments = async (_tradeId: string): Promise<Document[]> => {
  getAzakaClient();

  // Mock data
  const mockDocuments: Document[] = [
    {
      tradeId: _tradeId,
      docType: DocumentType.BillOfLading,
      hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      ipfsUri: 'ipfs://QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx',
      submittedBy: 'GDZST3XVCDTUJ76ZAV2HA72KYQODXXZ5PTMAPZGDHZ6CS7RO7MGG3DBM',
      submittedAt: Date.now() - 86400000 * 2,
      verified: true,
      signers: ['GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX'],
    },
    {
      tradeId: _tradeId,
      docType: DocumentType.CertificateOfOrigin,
      hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
      ipfsUri: 'ipfs://QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy',
      submittedBy: 'GDZST3XVCDTUJ76ZAV2HA72KYQODXXZ5PTMAPZGDHZ6CS7RO7MGG3DBM',
      submittedAt: Date.now() - 86400000 * 1,
      verified: true,
      signers: ['GCZYLNGU4CA5NAWBAVTHMZH4JKXPKR3NKDKZ7XQXQXQXQXQXQXQXQXQX'],
    },
    {
      tradeId: _tradeId,
      docType: DocumentType.InspectionCertificate,
      hash: '',
      ipfsUri: '',
      submittedBy: '',
      submittedAt: 0,
      verified: false,
      signers: [],
    },
  ];

  return mockDocuments;
};

export const verifyDocument = async (_tradeId: string, _docType: DocumentType): Promise<string> => {
  getAzakaClient();

  // Simulate transaction
  return 'mock-verify-doc-tx-' + Date.now();
};

export const getDocumentByType = async (
  tradeId: string,
  docType: DocumentType
): Promise<Document | null> => {
  const documents = await getDocuments(tradeId);
  return documents.find(doc => doc.docType === docType) || null;
};
