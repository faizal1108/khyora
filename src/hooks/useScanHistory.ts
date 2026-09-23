import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { createScanRecord, getScan, listScans } from '@/services/firebase/scans';
import { scanService } from '@/services/scan/scanService';
import type { ScanResult } from '@/types';

const recentScanImageCache = new Map<string, string>();

export function useScanHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const uid = user?.uid;

  const query = useQuery({
    queryKey: ['scans', uid],
    queryFn: () => {
      if (!uid) return [];
      return listScans(uid);
    },
    enabled: Boolean(uid),
  });

  const analyzeMutation = useMutation({
    mutationFn: async (input: {
      uri: string;
      mimeType?: string | null;
      fileName?: string | null;
    }) => {
      if (!uid) {
        throw new Error('You must be signed in to save a scan.');
      }

      const analysis = await scanService.analyze({ imageUri: input.uri });
      const saved = await createScanRecord({
        uid,
        flowLevel: analysis.flowLevel,
        infectionRisk: analysis.infectionRisk,
        confidence: analysis.confidence,
        indicators: analysis.indicators,
        notes: analysis.notes,
        disclaimer: analysis.disclaimer,
        result: `${analysis.flowLevel} flow, ${analysis.infectionRisk} infection risk`,
      });

      if (analysis.imageUri) {
        recentScanImageCache.set(saved.id, analysis.imageUri);
      }

      return {
        ...saved,
        imageUri: analysis.imageUri ?? saved.imageUri,
      } satisfies ScanResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans', uid] });
    },
  });

  const latestScan = (query.data ?? [])[0] as ScanResult | undefined;

  return {
    ...query,
    scans: query.data ?? [],
    latestScan,
    analyzeAndSave: (uri: string, meta?: { mimeType?: string | null; fileName?: string | null }) =>
      analyzeMutation.mutateAsync({ uri, ...meta }),
    analyzing: analyzeMutation.isPending,
    getScan: async (scanId: string) => {
      if (!uid) return null;
      const cachedImage = recentScanImageCache.get(scanId);
      const fromDb = await getScan(uid, scanId);
      if (!fromDb) return null;
      if (cachedImage && !fromDb.imageUri) {
        return { ...fromDb, imageUri: cachedImage };
      }
      return fromDb;
    },
  };
}
