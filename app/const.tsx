import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.1.2';

const HELPLINE_PORT = 8080;
const SOS_PORT = 8083;
const UNCOMFORTABLE_PORT = 8082;
const AI_CHAT_PORT = 8084;
const FAKE_CALL_PORT = 8085;
const DATABASE_PORT = 8086;
const PROFILE_PORT = 8087;
const TRACE_PORT = 8088;
const DANGER_ZONE_PORT = 8089;
const IMAGES_PORT = 8091;
const RELATIONSHIP_PORT = 8080;

export const BACKEND_URL_HELPLINE = `${BASE_URL}:${HELPLINE_PORT}/safe_srilanka`;

export const BACKEND_URL_SOS = `${BASE_URL}:${SOS_PORT}/safe_srilanka`;

export const BACKEND_URL_UNCOMFORTABLE = `${BASE_URL}:${UNCOMFORTABLE_PORT}/safe_srilanka`;

export const BACKEND_URL_AI_CHAT = `${BASE_URL}:${AI_CHAT_PORT}/safe_srilanka`;

export const BACKEND_URL_FAKE_CALL = `${BASE_URL}:${FAKE_CALL_PORT}/safe_srilanka`;

export const BACKEND_URL_DATABASE = `${BASE_URL}:${DATABASE_PORT}/safe_srilanka`;

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
