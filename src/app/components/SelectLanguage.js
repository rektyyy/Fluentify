import Dropdown from "react-bootstrap/Dropdown";

export default function SelectLanguage({ setLanguage }) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-autoclose-true">
        Select language
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item
          onClick={() => {
            setLanguage(["en-US", "en"]);
            console.log("zmiana na en-US");
          }}
        >
          English
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setLanguage(["pl", "pl"]);
            console.log("zmiana na pl");
          }}
        >
          Polish
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setLanguage(["de", "de"]);
            console.log("zmiana na de");
          }}
        >
          Deutche
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
