import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import {
  deleteCycle,
  listCycles,
  saveCycle,
} from '@/services/firebase/firestore';
import type { CycleRecord } from '@/types';
import { calculatePrediction } from '@/services/period/predictionEngine';

export function useCycles() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['cycles', user?.uid],
    queryFn: () => listCycles(user!.uid),
    enabled: Boolean(user?.uid),
  });

  const saveMutation = useMutation({
    mutationFn: (cycle: Omit<CycleRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) =>
      saveCycle(user!.uid, cycle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (cycleId: string) => deleteCycle(user!.uid, cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cycles', user?.uid] });
    },
  });

  const cycles = query.data ?? [];
  const prediction = calculatePrediction(cycles, profile);

  return {
    ...query,
    cycles,
    prediction,
    saveCycle: saveMutation.mutateAsync,
    deleteCycle: deleteMutation.mutateAsync,
    saving: saveMutation.isPending,
  };
}
