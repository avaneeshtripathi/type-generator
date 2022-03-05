export const getFormattedTypeLabel = (label: string) => {
  return label
    .split("_")
    .map((each) => each.charAt(0).toUpperCase() + each.substring(1))
    .join("");
};

export const getTypeForObject = (
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
