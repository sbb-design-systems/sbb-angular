import { extname, normalize, Path, relative } from '@angular-devkit/core';
import { DirEntry, FileEntry, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as hljs from 'highlight.js';
import marked from 'marked';

export function documentation(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    buildHtmlForMarkdownFilesForLibrary(tree, 'angular-public');
    return tree;
  };
}

function buildHtmlForMarkdownFilesForLibrary(tree: Tree, library: string) {
  const libraryDirectory = tree.getDir(`projects/sbb-esta/${library}/src`);
  const files = resolveMarkdownFiles(libraryDirectory);
  files.forEach((entry, path) => {
    const htmlPath = path.replace(/\.md$/, '.html');
    const targetFile = normalize(`projects/angular-showcase/src/assets/docs/${htmlPath}`);
    const htmlContent = markdownToHtml(entry.content.toString('utf8'));
    tree.overwrite(targetFile, htmlContent);
  });
}

function resolveMarkdownFiles(root: DirEntry) {
  const map = new Map<Path, Readonly<FileEntry>>();
  root.visit((path, entry) => {
    if (extname(path) === '.md' && entry) {
      map.set(relative(root.path, path), entry);
    }
  });
  return map;
}

function markdownToHtml(content: string) {
  return marked(content, {
    highlight: (code: string, language: string): string => {
      if (language) {
        // highlight.js expects "typescript" written out, while Github supports "ts".
        const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
        return hljs.highlight(lang, code).value;
      }

      return code;
    }
  });
}
