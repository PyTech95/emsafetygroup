import axios from 'axios';

export const BACKEND = process.env.REACT_APP_BACKEND_URL as string;

const API = axios.create({
  baseURL: `${BACKEND}/api`,
  withCredentials: true,
});

export default API;

export function fileUrl(coverUrl?: string | null): string | undefined {
  if (!coverUrl) return undefined;
  return `${BACKEND}${coverUrl}`;
}
