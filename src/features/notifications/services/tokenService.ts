import { config } from '@/src/config/env';
import { DeviceTokenData } from '../types';

const getBaseUrl = () =>
  config.api.graphql.uri.replace('/graphql', '');

const TOKEN_ENDPOINT = `${getBaseUrl()}/wp-json/reportfocus/v1/push-token`;

export async function registerDeviceToken(
  data: DeviceTokenData
): Promise<boolean> {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Token registration failed: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to register device token:', error);
    return false;
  }
}

export async function unregisterDeviceToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to unregister device token:', error);
    return false;
  }
}

export async function updateTokenPreferences(
  token: string,
  followedTopicIds: number[],
  breakingNewsEnabled: boolean
): Promise<boolean> {
  try {
    const response = await fetch(`${TOKEN_ENDPOINT}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        followedTopicIds,
        breakingNewsEnabled,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to update token preferences:', error);
    return false;
  }
}
