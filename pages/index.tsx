import type { NextPage } from "next";
import { useCallback, useMemo, useRef, useState } from "react";
import Header from "@components/Header";
import Textbox from "@components/Textbox";
import Button from "@components/Button";
import styles from "@styles/Home.module.css";
import testJson from "@data/test.json";
import { getStringifiedTypes } from "@utils/helper";

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

  const [curlRequest, setCurlRequest] = useState("");

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

  const onConvert = useCallback(async () => {
    try {
      const data = getStringifiedTypes(
        JSON.parse(stringifiedJson),
        spacing.current,
        initialTypeLabel,
        typeFormat
      );
      setConvertedData(data);
    } catch (e) {
      alert("Error: There is an error parsing the JSON");
    }
  }, [stringifiedJson, initialTypeLabel, typeFormat]);

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

  const handleInitialTypeLabelChange = useCallback((event) => {
    setInitialTypeLabel(event.target.value.replace(/ /g, ""));
  }, []);

  const onSubmitCurl = useCallback(
    async (event) => {
      event.preventDefault();
      const response = await fetch("/api/get-json-from-curl", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ curl: curlRequest }),
      });
      const respJson = await response.json();

      if (response.status === 200) {
        const data = getStringifiedTypes(
          respJson,
          spacing.current,
          initialTypeLabel,
          typeFormat
        );
        setConvertedData(data);
        setStringifiedJson(JSON.stringify(respJson));
        return;
      }

      alert(`Error: ${respJson.message}`);
    },
    [curlRequest, initialTypeLabel, typeFormat]
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
            <span>Spacing:</span>
            <input
              type="number"
              className={styles.actionNumberInput}
              value={spacingLength}
              onChange={handleSpacingChange}
            />
          </div>
          <div className={styles.singleActionCtr}>
            <span>Format:</span>
            <div onClick={toggleFormat}>
              <Button {...(typeFormat && { className: styles.activeCta })}>
                THelloWorld
              </Button>
              <Button {...(!typeFormat && { className: styles.activeCta })}>
                HelloWorldType
              </Button>
            </div>
          </div>
          <div className={styles.singleActionCtr}>
            <span>Initial Type Label:</span>
            <input
              className={styles.actionTextInput}
              value={initialTypeLabel}
              placeholder="Ex: Response"
              onChange={handleInitialTypeLabelChange}
            />
          </div>
        </div>
      </div>
      <form
        className={`${styles.container} ${styles.curlInputWrapper}`}
        onSubmit={onSubmitCurl}
      >
        <input
          className={styles.curlTextInput}
          placeholder="Paste cURL here to fetch JSON"
          value={curlRequest}
          onChange={(event) => setCurlRequest(event.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
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
