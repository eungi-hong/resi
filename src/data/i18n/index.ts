import en from "./en.json";
import zh from "./zh.json";
import ms from "./ms.json";
import ta from "./ta.json";
import type { Language } from "@/src/lib/types";

const dictionaries = { en, zh, ms, ta };

export function t(language: Language, key: keyof typeof en) {
  return dictionaries[language][key] ?? en[key];
}
