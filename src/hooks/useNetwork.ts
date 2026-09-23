import { useEffect, useState } from 'react';
import * as Network from 'expo-network';

export function useNetwork() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const state = await Network.getNetworkStateAsync();
        if (mounted) {
          setIsOffline(!(state.isConnected && state.isInternetReachable !== false));
        }
      } catch {
        if (mounted) setIsOffline(false);
      }
    };

    check();
    const interval = setInterval(check, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return { isOffline };
}
