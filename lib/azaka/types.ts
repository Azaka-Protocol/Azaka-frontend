export enum ContractStatus {
  PendingEscrow = 0,
  Active = 1,
  DocumentsPending = 2,
  Settled = 3,
  Cancelled = 4,
  Expired = 5,
}

export enum DocumentType {
  BillOfLading = 0,
  CertificateOfOrigin = 1,
  InspectionCertificate = 2,
  PhytosanitaryCertificate = 3,
  CustomsDeclaration = 4,
}

export enum ParticipantRole {
  Exporter = 0,
  Importer = 1,
  IssuingBank = 2,
  ConfirmingBank = 3,
  FreightForwarder = 4,
  Inspector = 5,
}

export interface Trade {
  id: string;
  exporter: string;
  importer: string;
  amount: string;
  asset: string;
  status: ContractStatus;
  requiredDocuments: DocumentType[];
  issuingBank: string;
  confirmingBank?: string;
  createdAt: number;
  expiryDate: number;
}

export interface Document {
  tradeId: string;
  docType: DocumentType;
  hash: string;
  ipfsUri: string;
  submittedBy: string;
  submittedAt: number;
  verified: boolean;
  signers: string[];
}

export interface Escrow {
  tradeId: string;
  amount: string;
  asset: string;
  depositor: string;
  depositedAt: number;
  released: boolean;
}

export interface Participant {
  address: string;
  role: ParticipantRole;
  name: string;
  verified: boolean;
  registeredAt: number;
}

export interface TradeEvent {
  tradeId: string;
  eventType: string;
  actor: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

export const getStatusLabel = (status: ContractStatus): string => {
  switch (status) {
    case ContractStatus.PendingEscrow:
      return 'Pending Escrow';
    case ContractStatus.Active:
      return 'Active';
    case ContractStatus.DocumentsPending:
      return 'Documents Pending';
    case ContractStatus.Settled:
      return 'Settled';
    case ContractStatus.Cancelled:
      return 'Cancelled';
    case ContractStatus.Expired:
      return 'Expired';
    default:
      return 'Unknown';
  }
};

export const getDocumentTypeLabel = (docType: DocumentType): string => {
  switch (docType) {
    case DocumentType.BillOfLading:
      return 'Bill of Lading';
    case DocumentType.CertificateOfOrigin:
      return 'Certificate of Origin';
    case DocumentType.InspectionCertificate:
      return 'Inspection Certificate';
    case DocumentType.PhytosanitaryCertificate:
      return 'Phytosanitary Certificate';
    case DocumentType.CustomsDeclaration:
      return 'Customs Declaration';
    default:
      return 'Unknown Document';
  }
};

export const getRoleLabel = (role: ParticipantRole): string => {
  switch (role) {
    case ParticipantRole.Exporter:
      return 'Exporter';
    case ParticipantRole.Importer:
      return 'Importer';
    case ParticipantRole.IssuingBank:
      return 'Issuing Bank';
    case ParticipantRole.ConfirmingBank:
      return 'Confirming Bank';
    case ParticipantRole.FreightForwarder:
      return 'Freight Forwarder';
    case ParticipantRole.Inspector:
      return 'Inspector';
    default:
      return 'Unknown Role';
  }
};
