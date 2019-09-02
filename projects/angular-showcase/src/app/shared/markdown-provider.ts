export abstract class MarkdownProvider {
  abstract downloadMarkdown(path: string): Promise<string>;
}
