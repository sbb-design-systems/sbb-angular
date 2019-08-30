import hljs from 'highlight.js';

/**
 * Nunjucks extension that supports rendering highlighted content. Content that is placed in
 * between a {% highlight %} and {% end_highlight %} block will be automatically highlighted.
 *
 * HighlightJS cannot detect the code language automatically. Therefore, developers need to
 * specify the language manually as first tag-block argument.
 */
export class HighlightNunjucksExtension {
  /** Tags that will be parsed by this Nunjucks extension. */
  tags = ['highlight'];

  /** Disable autoescaping for content that is rendered within this extension. */
  autoescape = false;

  parse(parser: any, nodes: any) {
    const startToken = parser.nextToken();
    const args = parser.parseSignature(null, true);

    // Jump to the end of the "{% highlight }" block.
    parser.advanceAfterBlockEnd(startToken.value);

    // Parse text content until {% end_highlight }" has been reached.
    const textContent = parser.parseUntilBlocks('end_highlight');

    // Jump to the end of the "{% highlight }" block.
    parser.advanceAfterBlockEnd();

    return new nodes.CallExtension(this, 'render', args, [textContent]);
  }

  render(_context: any, language: string, contentFn: () => string) {
    return highlightCodeBlock(contentFn(), language);
  }
}

/**
 * Transforms a given code block into its corresponding HTML output. We do this using
 * highlight.js because it allows us to show colored code blocks in our documentation.
 */
function highlightCodeBlock(code: string, language: string) {
  if (language) {
    return hljs.highlight(language.toLowerCase() === 'ts' ? 'typescript' : language, code).value;
  }

  return code;
}
