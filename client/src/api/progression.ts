import { api } from './client';
import { EP } from './endpoints';

export interface ProgressionData {
  level: number;
  xp: number;
  nextLevelXp: number;
  unlockedCapabilities: string[];
  projectCreationCredits: number;
  activeProjectCount: number;
  ownedProjectCount: number;
  completedProjectCount: number;
}

export async function getMyProgression(): Promise<ProgressionData> {
  const res = await api.get(EP.progressionMe);
  return res.data.data;
}
