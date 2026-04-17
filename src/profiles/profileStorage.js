const PROFILES_KEY = "taskPlanner_profiles";
const ACTIVE_KEY   = "taskPlanner_active";

export const PROFILE_COLORS = [
  "#7c3aed", "#e11d48", "#059669", "#d97706",
  "#be185d", "#0d9488", "#6b7280", "#c084fc",
];

export function getProfiles() {
  try {
    return JSON.parse(localStorage.getItem(PROFILES_KEY)) ?? [];
  } catch { return []; }
}

function saveProfiles(profiles) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function createProfile(name, color) {
  const profile = { id: crypto.randomUUID(), name: name.trim(), color };
  saveProfiles([...getProfiles(), profile]);
  return profile;
}

export function deleteProfile(id) {
  saveProfiles(getProfiles().filter((p) => p.id !== id));
  localStorage.removeItem(dataKey(id));
}

export function renameProfile(id, name) {
  saveProfiles(getProfiles().map((p) => p.id === id ? { ...p, name: name.trim() } : p));
}

export function dataKey(id) {
  return `taskPlanner_data_${id}`;
}

export function getActiveProfileId() {
  return sessionStorage.getItem(ACTIVE_KEY) ?? null;
}

export function setActiveProfileId(id) {
  sessionStorage.setItem(ACTIVE_KEY, id);
}

export function clearActiveProfile() {
  sessionStorage.removeItem(ACTIVE_KEY);
}

export function getActiveProfile() {
  const id = getActiveProfileId();
  if (!id) return null;
  return getProfiles().find((p) => p.id === id) ?? null;
}

// One-time migration: if old single-user data exists and no profiles yet, move it to a "Default" profile
export function migrateLegacyData() {
  const LEGACY_KEY = "taskPlanner_v1";
  const legacy = localStorage.getItem(LEGACY_KEY);
  if (!legacy || getProfiles().length > 0) return;
  const profile = createProfile("Default", PROFILE_COLORS[0]);
  localStorage.setItem(dataKey(profile.id), legacy);
  localStorage.removeItem(LEGACY_KEY);
}
