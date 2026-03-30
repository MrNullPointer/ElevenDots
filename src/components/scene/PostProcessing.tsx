'use client';

import type { QualityTier } from '@/lib/store';

interface PostProcessingProps {
  qualityTier: QualityTier;
}

export default function PostProcessing(_: PostProcessingProps) {
  // Temporarily disabled to avoid renderer instability/flicker while the
  // Cryogenic Tide base look is locked. Scene remains filmic via ACES + lighting.
  return null;
}
