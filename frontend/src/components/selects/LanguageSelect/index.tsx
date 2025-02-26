import {
  LanguageEnum,
  useLanguageContext,
} from "@context/LanguageContext/useLanguageContext";

const LanguageMetadata: Record<LanguageEnum, { label: string }> = {
  [LanguageEnum.PORTUGUESE]: { label: "Português" },
  [LanguageEnum.ENGLISH]: { label: "English" },
};

function LanguageSelect() {
  const { language, changeLanguage } = useLanguageContext();

  function handleLanguage(event: React.ChangeEvent<HTMLSelectElement>) {
    changeLanguage(event.target.value as LanguageEnum);
  }

  return (
    <div>
      {/* <label htmlFor="stands"></label> TODO: trocar para svg */}
      <select id="stands" value={language} onChange={handleLanguage}>
        <option value={undefined}></option>
        {Object.entries(LanguageMetadata).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelect;
