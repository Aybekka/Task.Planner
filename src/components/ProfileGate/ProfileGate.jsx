import { useState } from "react";
import {
  getProfiles, createProfile, deleteProfile,
  PROFILE_COLORS,
} from "../../profiles/profileStorage";
import styles from "./ProfileGate.module.css";

function initials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProfileGate({ onSelect }) {
  const [profiles, setProfiles]       = useState(getProfiles);
  const [adding, setAdding]           = useState(false);
  const [newName, setNewName]         = useState("");
  const [newColor, setNewColor]       = useState(PROFILE_COLORS[0]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function refresh() { setProfiles(getProfiles()); }

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    const profile = createProfile(newName, newColor);
    refresh();
    setAdding(false);
    setNewName("");
    setNewColor(PROFILE_COLORS[0]);
    onSelect(profile.id);
  }

  function handleDelete(e, id) {
    e.stopPropagation();
    deleteProfile(id);
    refresh();
    setConfirmDelete(null);
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>TASK PLANNER</h1>
        <p className={styles.subtitle}>Who is planning today?</p>
      </div>

      <div className={styles.grid}>
        {profiles.map((p) => (
          <div key={p.id} className={styles.cardWrap}>
            {confirmDelete === p.id ? (
              <div className={styles.confirmBox}>
                <p>Delete <strong>{p.name}</strong>?</p>
                <div className={styles.confirmRow}>
                  <button className={styles.confirmYes} onClick={(e) => handleDelete(e, p.id)}>Delete</button>
                  <button className={styles.confirmNo}  onClick={() => setConfirmDelete(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <button className={styles.profileCard} onClick={() => onSelect(p.id)}>
                  <span className={styles.avatar} style={{ backgroundColor: p.color }}>
                    {initials(p.name)}
                  </span>
                  <span className={styles.name}>{p.name}</span>
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                  aria-label={`Delete ${p.name}`}
                >
                  ×
                </button>
              </>
            )}
          </div>
        ))}

        {adding ? (
          <form className={styles.addForm} onSubmit={handleCreate}>
            <input
              autoFocus
              className={styles.nameInput}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Profile name"
              maxLength={24}
            />
            <div className={styles.colorPicker}>
              {PROFILE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorDot} ${newColor === c ? styles.colorDotActive : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNewColor(c)}
                  aria-label={c}
                />
              ))}
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.createBtn}>Create</button>
              <button type="button" className={styles.cancelBtn} onClick={() => { setAdding(false); setNewName(""); }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className={styles.addCard} onClick={() => setAdding(true)}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.name}>Add Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}
