import { useSelector } from "react-redux";
import { selectLanguage } from "../store/uiSlice";
import { translations } from "./translations";

export function useT() {
  const lang = useSelector(selectLanguage);
  return translations[lang] ?? translations.en;
}
