import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const BRAND_PRIMARY = '#1F5A3D';
const BRAND_DARK = '#163F2B';
const INACTIVE = '#91A097';
const DIVIDER = 'rgba(31, 90, 61, 0.12)';
const TAB_BAR_BG = '#FFFFFF';

const SCAN_ROUTE = 'scan/index';
const BAR_HEIGHT = 68;
const TOP_RADIUS = 26;
const NOTCH_WIDTH = 88;
const NOTCH_DEPTH = 26;

type IoniconName = keyof typeof Ionicons.glyphMap;

const ROUTE_ICONS: Record<string, { outline: IoniconName; filled: IoniconName }> = {
  'home/index': { outline: 'home-outline', filled: 'home' },
  'period/index': { outline: 'calendar-outline', filled: 'calendar' },
  'scan/index': { outline: 'scan-outline', filled: 'scan' },
  'analysis/index': { outline: 'heart-outline', filled: 'heart' },
  'profile/index': { outline: 'person-outline', filled: 'person' },
};

function buildTabBarPath(width: number, height: number): string {
  const centerX = width / 2;
  const left = TOP_RADIUS;
  const right = width - TOP_RADIUS;
  const notchLeft = centerX - NOTCH_WIDTH / 2;
  const notchRight = centerX + NOTCH_WIDTH / 2;

  return [
    `M 0 ${TOP_RADIUS}`,
    `Q 0 0 ${TOP_RADIUS} 0`,
    `L ${notchLeft} 0`,
    `C ${notchLeft + 12} 0 ${centerX - 18} ${NOTCH_DEPTH} ${centerX} ${NOTCH_DEPTH}`,
    `C ${centerX + 18} ${NOTCH_DEPTH} ${notchRight - 12} 0 ${notchRight} 0`,
    `L ${right} 0`,
    `Q ${width} 0 ${width} ${TOP_RADIUS}`,
    `L ${width} ${height}`,
    `L 0 ${height}`,
    'Z',
  ].join(' ');
}

function CurvedTabBarShape({ width, height }: { width: number; height: number }) {
  if (width <= 0) return null;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      <Path d={buildTabBarPath(width, height)} fill={TAB_BAR_BG} />
      <Path
        d={buildTabBarPath(width, height)}
        fill="none"
        stroke={DIVIDER}
        strokeWidth={1}
      />
    </Svg>
  );
}

export function KhyoraTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);
  const scanIndex = state.routes.findIndex((route) => route.name === SCAN_ROUTE);

  const onBarLayout = (event: LayoutChangeEvent) => {
    setBarWidth(event.nativeEvent.layout.width);
  };

  const renderTab = (route: (typeof state.routes)[number], index: number) => {
    const { options } = descriptors[route.key];
    const focused = state.index === index;
    const isScan = route.name === SCAN_ROUTE;
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

    if (isScan) {
      return (
        <View key={route.key} style={styles.scanSlot}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel ?? options.title}
            onPress={onPress}
            onLongPress={onLongPress}
            style={({ pressed }) => [
              styles.scanFab,
              focused && styles.scanFabActive,
              pressed && styles.scanFabPressed,
            ]}
          >
            <Ionicons
              name={focused ? icons.filled : icons.outline}
              size={26}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      );
    }

    return (
      <Pressable
        key={route.key}
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
    );
  };

  const leftRoutes = state.routes.filter((_, index) => index < scanIndex);
  const rightRoutes = state.routes.filter((_, index) => index > scanIndex);

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.barOuter} onLayout={onBarLayout}>
        <CurvedTabBarShape width={barWidth} height={BAR_HEIGHT} />
        <View style={styles.barRow}>
          <View style={styles.sideCluster}>
            {leftRoutes.map((route, routeIndex) => {
              const index = state.routes.findIndex((r) => r.key === route.key);
              return (
                <React.Fragment key={route.key}>
                  {renderTab(route, index)}
                  {routeIndex < leftRoutes.length - 1 ? <View style={styles.divider} /> : null}
                </React.Fragment>
              );
            })}
          </View>

          {scanIndex >= 0 ? renderTab(state.routes[scanIndex], scanIndex) : null}

          <View style={styles.sideCluster}>
            {rightRoutes.map((route, routeIndex) => {
              const index = state.routes.findIndex((r) => r.key === route.key);
              return (
                <React.Fragment key={route.key}>
                  {routeIndex > 0 ? <View style={styles.divider} /> : null}
                  {renderTab(route, index)}
                </React.Fragment>
              );
            })}
          </View>
        </View>
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  barOuter: {
    minHeight: BAR_HEIGHT,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: BAR_HEIGHT,
    paddingBottom: 8,
  },
  sideCluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    minHeight: BAR_HEIGHT - 8,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: DIVIDER,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  scanSlot: {
    width: NOTCH_WIDTH,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -22,
  },
  scanFab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: BRAND_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: TAB_BAR_BG,
    shadowColor: BRAND_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 8,
  },
  scanFabActive: {
    backgroundColor: BRAND_DARK,
  },
  scanFabPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  iconOrb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOrbActive: {
    backgroundColor: BRAND_PRIMARY,
    shadowColor: BRAND_PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
});
