export function returnStringsNotInOriginalArray(originalArray: string[], comparisonArray: string[]) {
  return comparisonArray.filter((string) => !originalArray.includes(string));
}
