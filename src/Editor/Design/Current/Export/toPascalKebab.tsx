/**
 * Convert a string to "Pascal-Kebab" form:
 *  - Each word is PascalCased (First letter uppercase, rest lowercase)
 *  - Words are joined with hyphens
 *
 * Examples:
 *  toPascalKebab("hello world") => "Hello-World"
 *  toPascalKebab("foo_bar-baz") => "Foo-Bar-Baz"
 *  toPascalKebab("myHTTPServer") => "My-HTTP-Server"
 *  toPascalKebab(undefined) => ""
 */
export function toPascalKebab(title: string | undefined): string {
  if (!title) return "";

  // Normalize accents to decomposed form, remove diacritics, and trim
  const normalized = title.normalize("NFKD").replace(/\p{M}/gu, "").trim();

  // Remove characters that are not letters, numbers, spaces, underscores, or hyphens
  // (keeps separators we want to use for splitting)
  const cleaned = normalized.replace(/[^\p{L}\p{N}\s\-_]/gu, " ");

  // Try to match words including:
  //  - Camel/pascal parts: "myVar" => ["my","Var"]
  //  - Acronyms: "HTTP" stays "HTTP"
  //  - Numbers as separate tokens
  const wordRegex = /[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+/gu;
  const matches = cleaned.match(wordRegex);

  // If regex failed (empty or weird input), fallback to splitting on separators
  const rawWords = matches ?? cleaned.split(/[\s\-_]+/).filter(Boolean);

  // Capitalize each word: keep acronyms (all caps) as-is,
  // otherwise uppercase first character + lowercase rest.
  const pascalWords = rawWords.map((w) => {
    // If the word is already all uppercase (e.g., "HTTP", "USA"), keep it
    if (/^[A-Z0-9]+$/.test(w)) return w;
    // Otherwise make PascalCase for that word
    const first = w[0] ?? "";
    const rest = w.slice(1) ?? "";
    return first.toUpperCase() + rest.toLowerCase();
  });

  // Join with hyphens
  return pascalWords.join("-");
}
