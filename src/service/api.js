import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const api = axios.create({ baseURL: API_BASE});

export default api;

export async function createEvent(name) {
  const res = await api.post("/v1/events", { name });
  return res.data;
}

export async function getParticipants(eventId, token) {
  const res = await api.get(`/v1/events/${eventId}/${token}/participants`);
  return res.data;
}

export async function addParticipants(eventId, items) {
  const res = await api.post(`/v1/events/${eventId}/participants`, { items });
  return res.data;
}

export async function setReady(eventId) {
  const res = await api.post(`/v1/events/${eventId}/ready`);
  return res.data;
}

export async function getJoinContext(eventId, token) {
  const res = await api.get(`/v1/join/${eventId}/${token}`);
  return res.data;
}

export async function reveal(eventId, token) {
  const res = await api.post(`/v1/join/${eventId}/${token}/reveal`);
  return res.data;
}
