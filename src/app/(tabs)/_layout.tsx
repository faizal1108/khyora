import React from 'react';
import { Tabs } from 'expo-router';
import { KhyoraTabBar } from '@/components/navigation/KhyoraTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <KhyoraTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home/index" options={{ title: 'Home' }} />
      <Tabs.Screen name="period/index" options={{ title: 'Period' }} />
      <Tabs.Screen name="scan/index" options={{ title: 'Scan' }} />
      <Tabs.Screen name="analysis/index" options={{ title: 'Analysis' }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
