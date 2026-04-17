import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { saveCloudProfile } from "../../firebase/userData";
import { PROFILE_COLORS } from "../../profiles/profileStorage";
import styles from "./AuthGate.module.css";

function initials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const ERROR_MESSAGES = {
  "auth/invalid-credential":        "Incorrect email or password.",
  "auth/user-not-found":            "No account found with this email.",
  "auth/wrong-password":            "Incorrect password.",
  "auth/email-already-in-use":      "An account with this email already exists.",
  "auth/weak-password":             "Password must be at least 6 characters.",
  "auth/invalid-email":             "Please enter a valid email address.",
  "auth/too-many-requests":         "Too many attempts. Please try again later.",
};

export default function AuthGate() {
  const [mode, setMode]           = useState("signin"); // "signin" | "signup"
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [displayName, setDisplayName] = useState("");
  const [color, setColor]         = useState(PROFILE_COLORS[0]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [showPass, setShowPass]   = useState(false);

  const preview = displayName.trim() ? initials(displayName) : "?";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: displayName.trim() });
        await saveCloudProfile(user.uid, { displayName: displayName.trim(), color });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in main.jsx picks up the new user automatically
    } catch (err) {
      setError(ERROR_MESSAGES[err.code] ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setError("");
  }

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>TASK PLANNER</h1>
        <p className={styles.subtitle}>Cloud-synced across all your devices</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.formTitle}>
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h2>

        {mode === "signup" && (
          <div className={styles.avatarPreview}>
            <span className={styles.avatarCircle} style={{ backgroundColor: color }}>
              {preview}
            </span>
            <div className={styles.colorPicker}>
              {PROFILE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.colorDot} ${color === c ? styles.colorDotActive : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className={styles.field}>
              <label className={styles.label}>Display Name</label>
              <input
                className={styles.input}
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                maxLength={32}
                required
                autoFocus
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus={mode === "signin"}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                className={styles.input}
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                required
              />
              <button
                type="button"
                className={styles.showPass}
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className={styles.switchRow}>
          {mode === "signin" ? (
            <>No account? <button className={styles.switchBtn} onClick={switchMode}>Sign up</button></>
          ) : (
            <>Already have one? <button className={styles.switchBtn} onClick={switchMode}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
