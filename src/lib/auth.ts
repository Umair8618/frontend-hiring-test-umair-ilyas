import client from "@/graphql/client";
import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations";

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}


export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await client.mutate({ mutation: REFRESH_TOKEN_MUTATION });
    const newToken = data?.refreshToken?.access_token;
    if (newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('last_refresh', Date.now().toString());
      return newToken;
    }
  } catch (err) {
    console.error('Failed to refresh token', err);
    localStorage.removeItem('token');
  }
  return null;
};