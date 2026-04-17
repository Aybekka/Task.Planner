import "./styles/variables.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { loadCloudData, loadCloudProfile, loadLocalData } from "./firebase/userData";
import { createAppStore } from "./store";
import { selectDarkMode } from "./store/uiSlice";
import App from "./App";
import AuthGate from "./components/AuthGate/AuthGate";
import "./index.css";

function ThemeSync() {
  const darkMode = useSelector(selectDarkMode);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);
  return null;
}

// Isolated session per user — fresh store on every login
function UserSession({ uid, appData, profile, onSignOut }) {
  const [store] = useState(() => createAppStore(uid, appData));
  return (
    <Provider store={store}>
      <ThemeSync />
      <App onSignOut={onSignOut} userProfile={profile} />
    </Provider>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#030309", color: "rgba(168,85,247,0.7)",
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em", fontSize: "13px",
    }}>
      LOADING…
    </div>
  );
}

function Root() {
  // null = loading, false = signed out, object = signed-in session data
  const [session, setSession] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setSession(false); return; }

      // Load cloud data; fall back to local cache while waiting
      const [cloudData, cloudProfile] = await Promise.all([
        loadCloudData(user.uid),
        loadCloudProfile(user.uid),
      ]);

      const appData = cloudData ?? loadLocalData(user.uid) ?? undefined;
      const profile = cloudProfile ?? { displayName: user.displayName ?? user.email, color: "#7c3aed" };

      setSession({ uid: user.uid, appData, profile });
    });
    return unsub;
  }, []);

  if (session === null)  return <LoadingScreen />;
  if (session === false) return <AuthGate />;

  return (
    <UserSession
      key={session.uid}
      uid={session.uid}
      appData={session.appData}
      profile={session.profile}
      onSignOut={() => signOut(auth)}
    />
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
