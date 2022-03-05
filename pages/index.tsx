import type { NextPage } from "next";
import { useCallback, useMemo, useRef, useState } from "react";
import Header from "@components/Header";
import Textbox from "@components/Textbox";
import Button from "@components/Button";
import styles from "@styles/Home.module.css";
import { getTypeForObject } from "@utils/helper";
import testJson from "@data/test.json";

const Home: NextPage = () => {
  const [stringifiedJson, setStringifiedJson] = useState("");
  const [convertedData, setConvertedData] = useState("");

  const [spacingLength, setSpacingLength] = useState(4);
  const spacing = useRef("  ");
  spacing.current = useMemo(
    () =>
      Array.from({ length: spacingLength }).reduce(
        (acc) => (acc += " "),
        ""
      ) as string,
    [spacingLength]
  );

  const [initialTypeLabel, setInitialTypeLabel] = useState("");
  const [typeFormat, setTypeFormat] = useState(true);
  const [conversionError, setConversionError] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      event.target.setRangeText(
        spacing.current,
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
      return getTypeForObject(
        jsonData,
        spacing.current,
        initialTypeLabel,
        [],
        typeFormat
      ).join("");
    },
    [initialTypeLabel, typeFormat]
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
    setStringifiedJson(
      JSON.stringify(JSON.parse(stringifiedJson), null, spacing.current)
    );
  }, [stringifiedJson, getStringifiedTypes]);

  const pasteTestJson = useCallback(
    () => setStringifiedJson(JSON.stringify(testJson)),
    []
  );

  const handleSpacingChange = useCallback((event) => {
    if (Number(event.target.value) >= 0) {
      setSpacingLength(Number(event.target.value));
    }
  }, []);

  const toggleFormat = useCallback(
    () => setTypeFormat((typeFormat) => !typeFormat),
    []
  );

  return (
    <>
      <Header />
      <div className={`${styles.container} ${styles.topActionsCtr}`}>
        <div className={styles.singleActionCtr}>
          <Button onClick={pasteTestJson}>Paste Test Data</Button>
        </div>
        <div className={styles.singleActionsWrapper}>
          <div className={styles.singleActionCtr}>
            <span>Spacing: </span>
            <input
              type="number"
              className={styles.actionInput}
              value={spacingLength}
              onChange={handleSpacingChange}
            />
          </div>
          <div className={styles.singleActionCtr}>
            <span>Format: </span>
            <div onClick={toggleFormat}>
              <Button {...(typeFormat && { className: styles.activeCta })}>
                THelloWorld
              </Button>
              <Button {...(!typeFormat && { className: styles.activeCta })}>
                HelloWorldType
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={`${styles.container} ${styles.pasteActionCtr}`}>
        
      </div> */}
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
