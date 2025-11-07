// AI logic defined in server
import { useAuthStore } from '@/stores/auth';

const API_BASE = 'http://localhost:3001/api';

export async function getTravelRecommendations(
  destination: string,
  interests: string = '',
  budget: string = '5000'
): Promise<string> {
  try {
    const authStore = useAuthStore();

    if (!authStore.isAuthenticated) {
      throw new Error('Please login to use AI recommendations');
    }

    const response = await fetch(`${API_BASE}/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({
        destination,
        interests,
        budget,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    const data = await response.json();
    return data.recommendations;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

export function isAIAvailable(): boolean {
  const authStore = useAuthStore();
  return authStore.isAuthenticated;
}
