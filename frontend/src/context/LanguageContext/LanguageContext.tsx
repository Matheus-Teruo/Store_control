import React, { useCallback, useState } from "react";
import { LanguageContext, LanguageEnum } from "./useLanguageContext";

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageEnum>(
    LanguageEnum.PORTUGUESE,
  );

  const changeLanguage = useCallback((language: LanguageEnum): void => {
    setLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
