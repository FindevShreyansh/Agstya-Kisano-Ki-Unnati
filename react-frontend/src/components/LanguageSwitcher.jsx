import { useLanguage } from "../i18n/useLanguage";

function LanguageSwitcher() {
  const { language, languages, setLanguage } = useLanguage();

  return (
    <label className="language-switcher" title="Translations are first-pass drafts">
      <span className="language-switcher-icon" aria-hidden="true">文</span>
      <span className="language-switcher-label">Language</span>
      <select
        aria-label="Choose language"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </label>
  );
}

export default LanguageSwitcher;
