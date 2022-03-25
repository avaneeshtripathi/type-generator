const getFormattedTypeLabel = (label: string) => {
  return label
    .split("_")
    .map((each) => each.charAt(0).toUpperCase() + each.substring(1))
    .join("");
};

const getFormattedKey = (key: string) => {
  return key.includes(" ") ? `"${key}"` : key;
};

export const getStringifiedTypes = (
  jsonData: Record<string, any>,
  spacing: string,
  label: string,
  format: boolean
) => {
  /** More things to come up here */
  return getTypeForObject(jsonData, spacing, label, [], format).join("");
};

export const getTypeForObject = (
  obj: Record<string, any>,
  spacing: string,
  name: string,
  typesStrArr: string[],
  isTFormat: boolean
) => {
  let typesStr = isTFormat ? `type T${name} = ` : `type ${name}Type = `;

  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    typesStr += "{\n";
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === "object") {
        if (obj[key] === null) {
          typesStr += `${spacing}${getFormattedKey(key)}: null;\n`;
        } else if (Array.isArray(obj[key])) {
          const keyName = getFormattedTypeLabel(
            `${name}_${key.replace(/ /g, "_")}`
          );
          typesStr += isTFormat
            ? `${spacing}${getFormattedKey(key)}: T${keyName}[];\n`
            : `${spacing}${getFormattedKey(key)}: ${keyName}Type[];\n`;
          getTypeForObject(
            obj[key][0],
            spacing,
            keyName,
            typesStrArr,
            isTFormat
          );
          /**
           * More logic needs to be added here to check for
           * 1. optional parameters in array of objects
           * 2. an array consisting multiple types like (string | number) etc
           */
        } else {
          const keyName = getFormattedTypeLabel(
            `${name}_${key.replace(/ /g, "_")}`
          );
          typesStr += isTFormat
            ? `${spacing}${getFormattedKey(key)}: T${keyName};\n`
            : `${spacing}${getFormattedKey(key)}: ${keyName}Type;\n`;
          getTypeForObject(obj[key], spacing, keyName, typesStrArr, isTFormat);
        }
      } else {
        typesStr += `${spacing}${getFormattedKey(key)}: ${typeof obj[key]};\n`;
      }
    });
    typesStr += "}";
  } else if (Array.isArray(obj)) {
    const keyName = getFormattedTypeLabel(`${name}_HelloWorldArr`);
    typesStr += isTFormat ? `T${keyName}[];\n` : `${keyName}Type[];\n`;
    getTypeForObject(obj[0], spacing, keyName, typesStrArr, isTFormat);
  } else {
    typesStr += `${obj === null ? "null" : typeof obj};`;
  }

  typesStrArr.push(typesStr + "\n\n");
  return typesStrArr;
};
