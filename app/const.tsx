import { Platform } from 'react-native';

const BASE_URL = 'ADD YOUR IP HERE(Refer README.md)';

const SOS_PORT = 9000;
const UNCOMFORTABLE_PORT = 9001;
const AI_CHAT_PORT = 9002;
const PROFILE_PORT = 9003;
const TRACE_PORT = 9004;
const DANGER_ZONE_PORT = 9005;
const IMAGES_PORT = 9006;
const RELATIONSHIP_PORT = 9007;

export const BACKEND_URL_SOS = `${BASE_URL}:${SOS_PORT}/safe_srilanka`;

export const BACKEND_URL_UNCOMFORTABLE = `${BASE_URL}:${UNCOMFORTABLE_PORT}/safe_srilanka`;

export const BACKEND_URL_AI_CHAT = `${BASE_URL}:${AI_CHAT_PORT}/safe_srilanka`;

export const BACKEND_URL_PROFILE = `${BASE_URL}:${PROFILE_PORT}/safe_srilanka`;

export const BACKEND_URL_TRACE = `${BASE_URL}:${TRACE_PORT}/safe_srilanka`;

export const BACKEND_URL_DANGER_ZONE = `${BASE_URL}:${DANGER_ZONE_PORT}/safe_srilanka`;

export const BACKEND_URL_IMAGES = `${BASE_URL}:${IMAGES_PORT}/safe_srilanka`;

export const BACKEND_URL_RELATIONSHIP = `${BASE_URL}:${RELATIONSHIP_PORT}/safe_srilanka`;

export interface UserProfile {
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  location: string;
  profileImage: string;
}
