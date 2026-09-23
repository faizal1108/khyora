const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

export interface ParsedImagePayload {
  mimeType: string;
  base64Data: string;
  buffer: Buffer;
  fileSize: number;
}

export function parseImageField(
  image: string,
  mimeTypeHint?: string,
): ParsedImagePayload {
  let mimeType = mimeTypeHint?.trim() ?? '';
  let base64Data = image.trim();

  const dataUriMatch = /^data:([^;]+);base64,(.+)$/i.exec(base64Data);
  if (dataUriMatch) {
    mimeType = dataUriMatch[1];
    base64Data = dataUriMatch[2];
  }

  if (!mimeType || !ALLOWED_MIME.has(mimeType)) {
    throw new ImageValidationError('Unsupported image format.', 400);
  }

  if (!base64Data || !/^[A-Za-z0-9+/=\s]+$/.test(base64Data)) {
    throw new ImageValidationError('Invalid image.', 400);
  }

  const buffer = Buffer.from(base64Data.replace(/\s/g, ''), 'base64');
  if (!buffer.length) {
    throw new ImageValidationError('Invalid image.', 400);
  }

  if (buffer.length > MAX_BYTES) {
    throw new ImageValidationError('Image is too large.', 413);
  }

  assertMagicBytes(buffer, mimeType);

  return {
    mimeType,
    base64Data: buffer.toString('base64'),
    buffer,
    fileSize: buffer.length,
  };
}

function assertMagicBytes(buffer: Buffer, mimeType: string): void {
  if (mimeType === 'image/jpeg' && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return;
  }
  if (
    mimeType === 'image/png' &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return;
  }
  if (
    mimeType === 'image/webp' &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return;
  }
  throw new ImageValidationError('Invalid image.', 400);
}

export class ImageValidationError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ImageValidationError';
  }
}
