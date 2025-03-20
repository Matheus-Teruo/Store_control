import { useContext, createContext } from "react";

export enum LanguageEnum {
  PORTUGUESE = "pt-BR",
  ENGLISH = "en-US",
}

interface LanguageContextType {
  language: LanguageEnum;
  changeLanguage: (language: LanguageEnum) => void;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
