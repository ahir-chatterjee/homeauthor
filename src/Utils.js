// utils.js

export const findDictWithSpecificStrings = (arr, targetStrings) => {
    for (const dict of arr) {
      const values = Object.values(dict);
      if (targetStrings.every(str => values.includes(str))) {
        return dict;
      }
    }
    return null;
  };

export const parseUrl = (url) => {
  return url.split("/").filter(part => part !== "");
}