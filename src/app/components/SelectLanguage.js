export default function SelectLanguage({ setLanguage, setChangedLanguage }) {
  return (
    <details className="dropdown">
      <summary className="btn m-1">Select language</summary>
      <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
        <li>
          <a
            onClick={() => {
              setLanguage(["en-US", "en"]);
              setChangedLanguage(true);
              console.log("zmiana na en-US");
            }}
          >
            English
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setLanguage(["pl", "pl"]);
              setChangedLanguage(true);
              console.log("zmiana na pl");
            }}
          >
            Polish
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              setLanguage(["de", "de"]);
              setChangedLanguage(true);
              console.log("zmiana na de");
            }}
          >
            German
          </a>
        </li>
      </ul>
    </details>
  );
}
// ...existing code...
