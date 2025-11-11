declare module 'stringify-object' {
  function stringify(obj: unknown, options?: { indent?: string; singleQuotes?: boolean; inlineCharacterLimit?: number }): string;
  export = stringify;
}
