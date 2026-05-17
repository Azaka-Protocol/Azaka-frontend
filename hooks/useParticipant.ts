import { useQuery } from '@tanstack/react-query';
import { Participant, ParticipantRole } from '@/lib/azaka/types';

// Mock function - in production this would call the registry contract
const getParticipant = async (address: string): Promise<Participant | null> => {
  // Mock data
  const mockParticipant: Participant = {
    address,
    role: ParticipantRole.Exporter,
    name: 'Mock Participant',
    verified: true,
    registeredAt: Date.now() - 86400000 * 30,
  };

  return mockParticipant;
};

export const useParticipant = (address: string) => {
  return useQuery<Participant | null>({
    queryKey: ['participant', address],
    queryFn: () => getParticipant(address),
    enabled: !!address,
  });
};
