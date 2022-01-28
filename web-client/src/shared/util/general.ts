export function truncateTextByLength(
  textString: string,
  options: { maxLength: number; includesDots: boolean } = { maxLength: 100, includesDots: true }
) {
  let returnString = textString;
  const { maxLength, includesDots } = options;
  if (textString.length <= maxLength) {
    if (includesDots) {
      return returnString + "...";
    }
    return returnString;
  }

  returnString = textString.substring(0, maxLength);

  if (includesDots) {
    returnString += "...";
  }

  return returnString;
}
