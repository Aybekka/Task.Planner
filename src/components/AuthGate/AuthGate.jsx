import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase";
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

  async function handleGoogle() {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged in main.jsx handles the rest
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(ERROR_MESSAGES[err.code] ?? "Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

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

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button className={styles.googleBtn} type="button" onClick={handleGoogle} disabled={loading}>
          <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

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
