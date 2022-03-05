import type { NextPage } from "next";
import { useCallback, useState } from "react";
import Header from "@components/Header";
import Textbox from "@components/Textbox";
import Button from "@components/Button";
import styles from "@styles/Home.module.css";

const getFormattedTypeLabel = (label: string) => {
  return label
    .split("_")
    .map((each) => each.charAt(0).toUpperCase() + each.substring(1))
    .join("");
};

const getTypeForObject = (
  obj: Record<string, any>,
  spacing: string,
  name: string,
  typesStrArr: string[]
) => {
  let typesStr = "";

  typesStr += `type T${name} = `;

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    typesStr += "{\n";
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        if (obj[key] === null) {
          typesStr += `${spacing}${key}: null;\n`;
        } else if (Array.isArray(obj[key])) {
          const keyName = getFormattedTypeLabel(`${name}_${key}`);
          typesStr += `${spacing}${key}: T${keyName}[];\n`;
          getTypeForObject(obj[key][0], spacing, keyName, typesStrArr);
        } else {
          const keyName = getFormattedTypeLabel(`${name}_${key}`);
          typesStr += `${spacing}${key}: T${keyName};\n`;
          getTypeForObject(obj[key], spacing, keyName, typesStrArr);
        }
      } else {
        typesStr += `${spacing}${key}: ${typeof obj[key]};\n`;
      }
    });
    typesStr += "}";
  } else if (Array.isArray(obj)) {
    const keyName = getFormattedTypeLabel(`${name}_HelloWorldArr`);
    typesStr += `T${keyName}[];\n`;
    getTypeForObject(obj[0], spacing, keyName, typesStrArr);
  } else {
    typesStr += `${obj === null ? "null" : typeof obj};`;
  }

  typesStrArr.push(typesStr + "\n\n");
  return typesStrArr;
};

const Home: NextPage = () => {
  const [stringifiedJson, setStringifiedJson] = useState("");
  const [convertedData, setConvertedData] = useState("");
  const [spacing, setSpacig] = useState("    ");
  const [startingType, setStartingType] = useState("");
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
      return getTypeForObject(jsonData, spacing, startingType, []).join("");
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

  return (
    <>
      <Header />
      <div className={styles.container}>
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
