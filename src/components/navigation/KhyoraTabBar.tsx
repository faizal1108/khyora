import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_PRIMARY = '#1F5A3D';
const INACTIVE = '#91A097';
const DIVIDER = 'rgba(31, 90, 61, 0.12)';
const TAB_BAR_BG = '#FFFFFF';

type IoniconName = keyof typeof Ionicons.glyphMap;

const ROUTE_ICONS: Record<string, { outline: IoniconName; filled: IoniconName }> = {
  'home/index': { outline: 'home-outline', filled: 'home' },
  'period/index': { outline: 'calendar-outline', filled: 'calendar' },
  'scan/index': { outline: 'scan-outline', filled: 'scan' },
  'analysis/index': { outline: 'heart-outline', filled: 'heart' },
  'profile/index': { outline: 'person-outline', filled: 'person' },
};

export function KhyoraTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const icons = ROUTE_ICONS[route.name] ?? {
            outline: 'ellipse-outline',
            filled: 'ellipse',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <React.Fragment key={route.key}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? options.title}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
              >
                <View style={[styles.iconOrb, focused && styles.iconOrbActive]}>
                  <Ionicons
                    name={focused ? icons.filled : icons.outline}
                    size={22}
                    color={focused ? '#FFFFFF' : INACTIVE}
                  />
                </View>
              </Pressable>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TAB_BAR_BG,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: DIVIDER,
    minHeight: 64,
    shadowColor: '#163F2B',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: DIVIDER,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOrbActive: {
    backgroundColor: BRAND_PRIMARY,
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
