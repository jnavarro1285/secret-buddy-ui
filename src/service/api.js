import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";
const api = axios.create({ baseURL: API_BASE });

export default api;

export function serializeParticipantPhones(value) {
  if (!value) return "";

  const rawText = String(value)
    .replace(/[\[\]]/g, "")
    .trim();
  if (!rawText) return "";
  if (rawText.toUpperCase() === "ALL") return "ALL";

  const raw = rawText
    .split(",")
    .map((item) => item.replace(/\s+/g, "").trim())
    .filter(Boolean);

  const seen = new Set();
  return raw
    .filter((phone) => {
      if (seen.has(phone)) return false;
      seen.add(phone);
      return true;
    })
    .join(",");
}

export function deserializeParticipantPhones(value) {
  if (!value || typeof value !== "string") return [];
  const trimmed = value.trim();
  if (trimmed === "ALL" || trimmed.toUpperCase() === "ALL") return [];
  return serializeParticipantPhones(trimmed)
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);
}

export function normalizeParticipantRestrictions(item = {}) {
  const permittedSource =
    item.permitted_participants ?? item.permittedParticipants;
  const excludedSource =
    item.excluded_participants ?? item.excludedParticipants;

  const permitted =
    typeof permittedSource === "string" &&
    permittedSource.trim().toUpperCase() === "ALL"
      ? "ALL"
      : typeof permittedSource === "string" && permittedSource.trim()
        ? serializeParticipantPhones(permittedSource)
        : "ALL";

  const excluded =
    typeof excludedSource === "string" && excludedSource.trim()
      ? serializeParticipantPhones(excludedSource)
      : "";

  return {
    ...item,
    permittedParticipants: permitted,
    excludedParticipants: excluded,
  };
}

export async function createEvent(name) {
  const res = await api.post("/v1/events", { name });
  return res.data;
}

export async function getParticipants(eventId, token) {
  const res = await api.get(`/v1/events/${eventId}/${token}/participants`);
  return res.data;
}

export async function addParticipants(eventId, items) {
  const payload = Array.isArray(items)
    ? items.map((item) => normalizeParticipantRestrictions(item))
    : [];

  const res = await api.post(`/v1/events/${eventId}/participants`, {
    items: payload,
  });
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
