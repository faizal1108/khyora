import { Href, Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';

export default function Index() {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Redirect href={'/auth/startup' as Href} />;
  if (!profile) return <Redirect href="/auth/personal-details" />;
  return <Redirect href="/(tabs)/home" />;
}
