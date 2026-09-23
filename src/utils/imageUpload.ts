import * as FileSystem from 'expo-file-system/legacy';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_DIMENSION,
} from '@/constants/images';

export interface PreparedImage {
  dataUri: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
}

function extensionForMime(mimeType: string): string {
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  return 'jpg';
}

function saveFormatForMime(mimeType: string): SaveFormat {
  if (mimeType === 'image/png') return SaveFormat.PNG;
  if (mimeType === 'image/webp') return SaveFormat.WEBP;
  return SaveFormat.JPEG;
}

function normalizeMimeType(mimeType?: string | null): string {
  const normalized = mimeType?.toLowerCase() ?? 'image/jpeg';
  if ((ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(normalized)) {
    return normalized;
  }
  throw new Error('Unsupported image format.');
}

export async function prepareImageForUpload(
  localUri: string,
  options?: { mimeType?: string | null; fileName?: string | null },
): Promise<PreparedImage> {
  const mimeType = normalizeMimeType(options?.mimeType);

  const info = await FileSystem.getInfoAsync(localUri);
  if (!info.exists) {
    throw new Error('Please select an image.');
  }

  const manipulated = await manipulateAsync(
    localUri,
    [{ resize: { width: MAX_IMAGE_DIMENSION } }],
    {
      compress: 0.82,
      format: saveFormatForMime(mimeType),
    },
  );

  const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const fileSize = Math.ceil((base64.length * 3) / 4);
  if (fileSize > MAX_IMAGE_BYTES) {
    throw new Error('Image is too large. Please select an image below 5 MB.');
  }

  const fileName =
    options?.fileName?.trim() ||
    `scan_${Date.now()}.${extensionForMime(mimeType)}`;

  return {
    dataUri: `data:${mimeType};base64,${base64}`,
    mimeType,
    fileName,
    fileSize,
  };
}
