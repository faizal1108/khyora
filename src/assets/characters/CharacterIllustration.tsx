import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { CharacterId } from '@/types';
import { getCharacter } from '@/constants/characters';

interface Props {
  id: CharacterId;
  size?: number;
}

export function CharacterIllustration({ id, size = 120 }: Props) {
  const meta = getCharacter(id);
  const accent = meta.accent;

  switch (id) {
    case 'character_01':
      return <Luma size={size} accent={accent} />;
    case 'character_02':
      return <Nova size={size} accent={accent} />;
    case 'character_03':
      return <Mira size={size} accent={accent} />;
    case 'character_04':
      return <Sora size={size} accent={accent} />;
    case 'character_05':
    default:
      return <Aya size={size} accent={accent} />;
  }
}

function FaceBase({
  size,
  accent,
  hair,
  blush = true,
}: {
  size: number;
  accent: string;
  hair: React.ReactNode;
  blush?: boolean;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx="60" cy="60" r="54" fill={`${accent}22`} />
      {hair}
      <Circle cx="60" cy="62" r="28" fill="#FFE8DE" />
      {blush ? (
        <>
          <Ellipse cx="42" cy="68" rx="5" ry="3" fill="#F5B5C4" opacity={0.7} />
          <Ellipse cx="78" cy="68" rx="5" ry="3" fill="#F5B5C4" opacity={0.7} />
        </>
      ) : null}
      <Circle cx="50" cy="60" r="3.2" fill="#2D2A32" />
      <Circle cx="70" cy="60" r="3.2" fill="#2D2A32" />
      <Path
        d="M54 72 Q60 78 66 72"
        stroke="#D46A82"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <Rect x="48" y="88" width="24" height="18" rx="8" fill={accent} />
    </Svg>
  );
}

function Luma({ size, accent }: { size: number; accent: string }) {
  return (
    <FaceBase
      size={size}
      accent={accent}
      hair={
        <>
          <Ellipse cx="60" cy="38" rx="34" ry="22" fill={accent} />
          <Path d="M28 48 Q36 78 42 52" fill={accent} />
          <Path d="M92 48 Q84 78 78 52" fill={accent} />
        </>
      }
    />
  );
}

function Nova({ size, accent }: { size: number; accent: string }) {
  return (
    <FaceBase
      size={size}
      accent={accent}
      hair={
        <>
          <Path d="M30 55 Q35 20 60 22 Q85 20 90 55 Q80 40 60 42 Q40 40 30 55Z" fill={accent} />
          <Circle cx="60" cy="28" r="6" fill="#FFF" opacity={0.5} />
        </>
      }
    />
  );
}

function Mira({ size, accent }: { size: number; accent: string }) {
  return (
    <FaceBase
      size={size}
      accent={accent}
      hair={
        <>
          <Ellipse cx="60" cy="40" rx="30" ry="20" fill={accent} />
          <Path d="M35 45 L40 70 L48 48 Z" fill={accent} />
          <Path d="M85 45 L80 70 L72 48 Z" fill={accent} />
          <Path d="M55 18 L60 8 L65 18" stroke={accent} strokeWidth="3" fill="none" />
        </>
      }
    />
  );
}

function Sora({ size, accent }: { size: number; accent: string }) {
  return (
    <FaceBase
      size={size}
      accent={accent}
      hair={
        <>
          <Path d="M28 50 Q40 18 60 20 Q80 18 92 50 Q75 35 60 36 Q45 35 28 50Z" fill={accent} />
          <Circle cx="38" cy="55" r="8" fill={accent} />
          <Circle cx="82" cy="55" r="8" fill={accent} />
        </>
      }
    />
  );
}

function Aya({ size, accent }: { size: number; accent: string }) {
  return (
    <FaceBase
      size={size}
      accent={accent}
      hair={
        <>
          <Path d="M32 58 Q38 22 60 18 Q82 22 88 58 Q70 34 60 34 Q50 34 32 58Z" fill={accent} />
          <Rect x="52" y="14" width="16" height="10" rx="4" fill="#F5B5C4" />
        </>
      }
    />
  );
}
