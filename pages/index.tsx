import type { NextPage } from "next";
import { useCallback, useState } from "react";
import Header from "@components/Header";
import Textbox from "@components/Textbox";
import Button from "@components/Button";
import styles from "@styles/Home.module.css";
import { getTypeForObject } from "@utils/helper";
import testJson from "@data/test.json";

const Home: NextPage = () => {
  const [stringifiedJson, setStringifiedJson] = useState("");
  const [convertedData, setConvertedData] = useState("");
  const [spacing, setSpacing] = useState("    ");
  const [initialTypeLabel, setInitialTypeLabel] = useState("");
  const [conversionError, setConversionError] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      event.target.setRangeText(
        spacing,
        event.target.selectionStart,
        event.target.selectionStart,
        "end"
      );
    }
  }, []);

  const handleFirstTextboxChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setStringifiedJson(event.target.value);
      if (conversionError) setConversionError(false);
    },
    [conversionError]
  );

  const handleSecondTextboxChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setConvertedData(event.target.value);
      if (conversionError) setConversionError(false);
    },
    [conversionError]
  );

  const getStringifiedTypes = useCallback(
    (jsonData: Record<string, any>) => {
      /** More things to come up here */
      return getTypeForObject(jsonData, spacing, initialTypeLabel, []).join("");
    },
    [spacing]
  );

  const onConvert = useCallback(() => {
    let jsonData;
    try {
      jsonData = JSON.parse(stringifiedJson);
    } catch (e) {}

    if (!jsonData) {
      return setConversionError(true);
    }

    const stringifiedTypes = getStringifiedTypes(jsonData);

    setConvertedData(stringifiedTypes);
    setStringifiedJson(JSON.stringify(JSON.parse(stringifiedJson), null, 4));
  }, [stringifiedJson]);

  const pasteTestJson = useCallback(
    () => setStringifiedJson(JSON.stringify(testJson)),
    []
  );

  return (
    <>
      <Header />
      <div className={`${styles.container} ${styles.topActionsCtr}`}>
        <Button onClick={pasteTestJson}>Paste Test Data</Button>
      </div>
      <div className={`${styles.container} ${styles.textBoxCtr}`}>
        <Textbox
          placeholder="Paste the JSON here..."
          value={stringifiedJson}
          onChange={handleFirstTextboxChange}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={onConvert}>Convert =&gt;</Button>
        <Textbox
          placeholder="This field will be populated automatically..."
          value={convertedData}
          onChange={handleSecondTextboxChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      {conversionError && (
        <div className={styles.parsingError}>
          There is an error parsing the JSON
        </div>
      )}
    </>
  );
};

export default Home;
