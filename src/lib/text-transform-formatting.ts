export function toCamelcase(
  text?: string,
  formatting?: { joinSeparator?: string }
): string {
  if (!text) return "";

  const joinSeparator = formatting?.joinSeparator || "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(joinSeparator);
}
