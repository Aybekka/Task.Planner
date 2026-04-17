import "./styles/variables.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import store from "./store";
import { selectDarkMode } from "./store/uiSlice";
import App from "./App";
import "./index.css";

function ThemeSync() {
  const darkMode = useSelector(selectDarkMode);
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeSync />
      <App />
    </Provider>
  </React.StrictMode>
);
