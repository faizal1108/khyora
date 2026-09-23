import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GlassCard } from '@/components/common/GlassCard';
import { PrimaryButton, SecondaryButton } from '@/components/common/PrimaryButton';
import { useScanHistory } from '@/hooks/useScanHistory';
import { colors } from '@/constants/theme';

export default function ScanCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState<{
    mimeType?: string | null;
    fileName?: string | null;
  }>({});
  const [processing, setProcessing] = useState(false);
  const { analyzeAndSave } = useScanHistory();
  const router = useRouter();
  const scanLine = useSharedValue(0);

  useEffect(() => {
    if (processing) {
      scanLine.value = withRepeat(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      scanLine.value = 0;
    }
  }, [processing, scanLine]);

  const scanStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLine.value * 180 }],
  }));

  const capture = async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.7,
      });
      if (photo?.uri) {
        setPreviewUri(photo.uri);
        setPreviewMeta({ mimeType: 'image/jpeg', fileName: `scan_${Date.now()}.jpg` });
      }
    } catch {
      Alert.alert('Capture failed', 'Unable to take photo. Try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const asset = result.assets[0];
      setPreviewUri(asset.uri);
      setPreviewMeta({
        mimeType: asset.mimeType ?? 'image/jpeg',
        fileName: asset.fileName ?? `scan_${Date.now()}.jpg`,
      });
    }
  };

  const analyze = async () => {
    if (!previewUri) return;
    setProcessing(true);
    try {
      const scan = await analyzeAndSave(previewUri, previewMeta);
      router.replace({ pathname: '/scan/result', params: { id: scan.id } });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to analyze image.';
      Alert.alert('Upload failed', message);
    } finally {
      setProcessing(false);
    }
  };

  if (!permission) {
    return (
      <AnimatedBackground>
        <SafeAreaView style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </SafeAreaView>
      </AnimatedBackground>
    );
  }

  if (!permission.granted) {
    return (
      <AnimatedBackground>
        <SafeAreaView style={styles.center}>
          <GlassCard>
            <Text style={styles.title}>Camera access needed</Text>
            <Text style={styles.body}>
              Allow camera access to scan pads, or choose a photo from your library.
            </Text>
            <PrimaryButton label="Grant Permission" onPress={requestPermission} />
            <SecondaryButton
              label="Choose from Library"
              onPress={pickImage}
              style={{ marginTop: 12 }}
            />
          </GlassCard>
        </SafeAreaView>
      </AnimatedBackground>
    );
  }

  if (processing) {
    return (
      <AnimatedBackground>
        <SafeAreaView style={styles.center}>
          <GlassCard style={{ width: '100%', alignItems: 'center' }}>
            <Text style={styles.title}>Analyzing...</Text>
            <View style={styles.scanFrame}>
              {previewUri ? (
                <Image source={{ uri: previewUri }} style={styles.preview} />
              ) : null}
              <Animated.View style={[styles.scanBeam, scanStyle]} />
            </View>
            <Text style={styles.check}>✓ Flow level</Text>
            <Text style={styles.check}>✓ Visual characteristics</Text>
            <Text style={styles.check}>✓ Health indicators</Text>
          </GlassCard>
        </SafeAreaView>
      </AnimatedBackground>
    );
  }

  if (previewUri) {
    return (
      <AnimatedBackground>
        <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
          <View style={styles.content}>
            <Text style={styles.title}>Confirm capture</Text>
            <Image source={{ uri: previewUri }} style={styles.fullPreview} />
            <PrimaryButton label="Analyze" onPress={analyze} />
            <SecondaryButton
              label="Retake"
              onPress={() => {
                setPreviewUri(null);
                setPreviewMeta({});
              }}
              style={{ marginTop: 12 }}
            />
          </View>
        </SafeAreaView>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>Scan New Pad</Text>
          <Text style={styles.body}>Place the pad inside the frame.</Text>
          <View style={styles.cameraWrap}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.frameOverlay} pointerEvents="none" />
          </View>
          <PrimaryButton label="Capture" onPress={capture} />
          <SecondaryButton
            label="Choose from Library"
            onPress={pickImage}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 20 },
  content: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  body: {
    color: colors.inkMuted,
    marginBottom: 16,
    lineHeight: 20,
  },
  cameraWrap: {
    height: 360,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
  camera: { flex: 1 },
  frameOverlay: {
    position: 'absolute',
    top: 28,
    right: 28,
    bottom: 28,
    left: 28,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
  },
  fullPreview: {
    width: '100%',
    height: 360,
    borderRadius: 24,
    marginBottom: 20,
  },
  preview: { width: '100%', height: '100%' },
  scanFrame: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 16,
    backgroundColor: colors.primaryMuted,
  },
  scanBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  check: {
    alignSelf: 'flex-start',
    color: colors.success,
    fontWeight: '600',
    marginTop: 6,
  },
});
