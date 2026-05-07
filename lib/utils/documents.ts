import axios from 'axios';

export const hashFile = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const uploadToIPFS = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error('IPFS credentials not configured');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: apiKey,
          pinata_secret_api_key: secretKey,
        },
      }
    );

    return `ipfs://${response.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload document to IPFS. Please try again.');
  }
};

export const getIPFSUrl = (ipfsUri: string): string => {
  if (!ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }
  const hash = ipfsUri.replace('ipfs://', '');
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(`${category}/`);
    }
    return file.type === type;
  });
};

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/*',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_FILE_SIZE_MB = 10;
