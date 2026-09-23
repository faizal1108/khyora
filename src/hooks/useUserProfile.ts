import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/services/firebase/firestore';

export function useUserProfile() {
  const { user, profile, refreshProfile, setProfileLocal } = useAuth();

  const query = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const next = await getUserProfile(user.uid);
      setProfileLocal(next);
      return next;
    },
    enabled: Boolean(user?.uid),
    initialData: profile,
  });

  return {
    ...query,
    profile: query.data ?? profile,
    refreshProfile,
  };
}
