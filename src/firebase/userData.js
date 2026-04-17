import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function loadCloudData(uid) {
  try {
    const snap = await getDoc(doc(db, "userData", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

export async function saveCloudData(uid, data) {
  try {
    await setDoc(doc(db, "userData", uid), data);
  } catch (e) {
    console.warn("Cloud sync failed:", e.message);
  }
}

export async function loadCloudProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "userProfiles", uid));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
}

export async function saveCloudProfile(uid, profile) {
  try {
    await setDoc(doc(db, "userProfiles", uid), profile);
  } catch {}
}

// Local cache helpers (keyed by uid for multi-account support)
const localKey = (uid) => `taskPlanner_data_${uid}`;

export function loadLocalData(uid) {
  try {
    const raw = localStorage.getItem(localKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.ui) parsed.ui.expandedNotes = {};
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalData(uid, data) {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(data));
  } catch {}
}
