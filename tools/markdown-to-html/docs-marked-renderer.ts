import { Renderer } from 'marked';

/** Regular expression that matches whitespace. */
const whitespaceRegex = /\W+/g;

/** Regular expression that matches example comments. */
const exampleCommentRegex = /<!--\W*example\(([^)]+)\)\W*-->/g;

/**
 * Custom renderer for marked that will be used to transform markdown files to HTML
 * files that can be used in the Angular Material docs.
 */
export class DocsMarkdownRenderer extends Renderer {
  /**
   * Transforms a markdown heading into the corresponding HTML output. In our case, we
   * want to create a header-link for each H2, H3 and H4 heading. This allows users to jump to
   * specific parts of the docs.
   */
  heading(label: string, level: number, _raw: string) {
    if (level === 2 || level === 3 || level === 4 || level === 5 || level === 6) {
      const headingId = label.toLowerCase().replace(whitespaceRegex, '-');

      return `
        <h${level} id="${headingId}" class="docs-header-link">
          <span header-link="${headingId}"></span>
          ${label}
        </h${level}>
      `;
    }

    return `<h${level}>${label}</h${level}>`;
  }

  /**
   * Method that will be called whenever inline HTML is processed by marked. In that case,
   * we can easily transform the example comments into real HTML elements. For example:
   *
   *  `<!-- example(name) -->` turns into `<div material-docs-example="name"></div>`
   */
  html(html: string) {
    html = html.replace(
      exampleCommentRegex,
      (_match: string, name: string) => `<div material-docs-example="${name}"></div>`
    );

    return super.html(html);
  }

  /**
   * Method that will be called after a markdown file has been transformed to HTML. This method
   * can be used to finalize the content (e.g. by adding an additional wrapper HTML element)
   */
  finalizeOutput(output: string): string {
    return `<div class="docs-markdown">${output}</div>`;
  }
}
