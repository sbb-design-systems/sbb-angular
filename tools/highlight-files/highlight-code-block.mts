import highlightJs from 'highlight.js';

/** Map of language aliases not recognized by highlight.js to supported equivalents. */
const languageAliases: Record<string, string> = {
  angular: 'html',
  ts: 'typescript',
};

/**
 * Transforms a given code block into its corresponding HTML output. We do this using
 * highlight.js because it allows us to show colored code blocks in our documentation.
 */
export function highlightCodeBlock(code: string, language?: string) {
  if (language) {
    const normalizedLanguage = languageAliases[language.toLowerCase()] ?? language.toLowerCase();
    if (highlightJs.getLanguage(normalizedLanguage)) {
      return highlightJs.highlight(code, { language: normalizedLanguage }).value;
    }
  }

  return code;
}
