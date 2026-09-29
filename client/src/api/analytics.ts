import { api } from './client';
import { EP } from './endpoints';

export async function getAnalyticsOverview(): Promise<unknown> {
  const res = await api.get(EP.analyticsOverview);
  return res.data.data;
}

export async function getProjectsByCategory(): Promise<unknown[]> {
  const res = await api.get(EP.analyticsByCategory);
  return res.data.data;
}

export async function getPopularSkills(): Promise<unknown[]> {
  const res = await api.get(EP.analyticsPopularSkills);
  return res.data.data;
}

export async function getTopContributors(): Promise<unknown[]> {
  const res = await api.get(EP.analyticsContributors);
  return res.data.data;
}

export async function getProjectParticipation(): Promise<unknown[]> {
  const res = await api.get(EP.analyticsProjectParticipation);
  return res.data.data;
}

export async function getXpTrends(): Promise<unknown[]> {
  const res = await api.get(EP.analyticsXpTrends);
  return res.data.data;
}
