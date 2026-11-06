export type MascotMood = 'idle' | 'follow' | 'wave' | 'excited' | 'sleep' | 'sad' | 'guilty' | 'dance' | 'peek'

export type EyePose = 'open' | 'wink' | 'closed' | 'happy' | 'droopy' | 'side'
export type MouthPose = 'tongue' | 'open' | 'o' | 'frown' | 'wobbly'
export type ArmPose = 'down' | 'up' | 'hip'

export interface MascotPose {
  eyes: EyePose
  mouth: MouthPose
  armL: ArmPose
  armR: ArmPose
  extra?: 'zzz' | 'tear' | 'crumbs' | 'sparkles'
}

/** Static pose per mood (also the reduced-motion pose). */
export const MASCOT_POSES: Record<MascotMood, MascotPose> = {
  idle: { eyes: 'open', mouth: 'tongue', armL: 'down', armR: 'down' },
  follow: { eyes: 'open', mouth: 'tongue', armL: 'down', armR: 'down' },
  wave: { eyes: 'wink', mouth: 'tongue', armL: 'down', armR: 'up' },
  excited: { eyes: 'happy', mouth: 'open', armL: 'up', armR: 'up', extra: 'sparkles' },
  sleep: { eyes: 'closed', mouth: 'o', armL: 'down', armR: 'down', extra: 'zzz' },
  sad: { eyes: 'droopy', mouth: 'frown', armL: 'down', armR: 'down', extra: 'tear' },
  guilty: { eyes: 'side', mouth: 'wobbly', armL: 'hip', armR: 'down', extra: 'crumbs' },
  dance: { eyes: 'wink', mouth: 'open', armL: 'up', armR: 'hip' },
  peek: { eyes: 'open', mouth: 'tongue', armL: 'down', armR: 'up' },
}

export const MASCOT_MOODS = Object.keys(MASCOT_POSES) as MascotMood[]

/** Shoulder pivots (viewBox units) + rotation per arm pose. */
export const ARM_PIVOT = { armL: [100, 242], armR: [146, 240] } as const
export const ARM_ROTATION: Record<'armL' | 'armR', Record<ArmPose, number>> = {
  armL: { down: 0, up: 100, hip: -40 },
  armR: { down: 0, up: -100, hip: 40 },
}
