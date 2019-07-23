import { Dgeni } from 'dgeni';
import { sync as globSync } from 'glob';
import { dest, src, task } from 'gulp';
import { join, resolve } from 'path';

import { preparePackage } from '../../dgeni/index';

// There are no type definitions available for these imports.
const markdown = require('gulp-markdown');
const highlight = require('gulp-highlight-files');
const rename = require('gulp-rename');
const flatten = require('gulp-flatten');
const htmlmin = require('gulp-htmlmin');
const hljs = require('highlight.js');
const dom = require('gulp-dom');
const gulpRunSequence = require('run-sequence');
const htmlbeautify = require('gulp-html-beautify');

export function sequenceTask(...args: any[]) {
  return (done: any) => {
    gulpRunSequence(...args, done);
  };
}

// HTML tags in the markdown generated files that should receive a .docs-markdown-${tagName} class
// for styling purposes.
const MARKDOWN_TAGS_TO_CLASS_ALIAS = [
  'a',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'li',
  'ol',
  'p',
  'table',
  'tbody',
  'td',
  'th',
  'tr',
  'ul',
  'pre',
  'code'
];

// Extend the renderer for custom heading anchor rendering
markdown.marked.Renderer.prototype.heading = (text: string, level: number): string => {
  if (level === 3 || level === 4) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `
        <h${level} id="${escapedText}" class="docs-header-link">
          <span header-link="${escapedText}"></span>
          ${text}
        </h${level}>
      `;
  } else {
    return `<h${level}>${text}</h${level}>`;
  }
};

const markdownOptions = {
  // Add syntax highlight using highlight.js
  highlight: (code: string, language: string): string => {
    if (language) {
      // highlight.js expects "typescript" written out, while Github supports "ts".
      const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
      return hljs.highlight(lang, code).value;
    }

    return code;
  }
};
// Options for the html-minifier that minifies the generated HTML files.
const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

/** Generate all docs content. */
task(
  'docs',
  sequenceTask(
    ['render-public-markdown', 'build-highlighted-examples', 'api-docs'],
    'beautify-html-files'
  )
);

task('render-markdown', () => {
  return src([
    'projects/angular-showcase/src/app/public/markdown/**/*.+(md)',
    'projects/angular-showcase/src/app/business/markdown/**/*.+(md)'
  ])
    .pipe(
      rename({
        prefix: 'sbb-angular-',
        extname: '.html'
      })
    )
    .pipe(markdown(markdownOptions))
    .pipe(dom(createTagNameAliaser('docs-markdown')))
    .pipe(dest(f => f.));
});

/**
 * Creates syntax-highlighted html files from the examples to be used for the source view of
 * live examples on the docs site.
 */
task('render-examples', () => {
  return src(['projects/angular-showcase/src/app/public/examples/**/*.+(html|scss|ts)'])
    .pipe(flatten())
    .pipe(
      rename((filePath: any) => {
        // rename files to fit format: [filename]-[filetype].html
        const extension = filePath.extname.slice(1);
        filePath.basename = `${filePath.basename}-${extension}`;
      })
    )
    .pipe(highlight())
    .pipe(dest('projects/angular-showcase/src/docs/examples'));
});

/** Generates API docs from the source JsDoc using dgeni. */
task('api-docs', async () => {
  const projectsRoot = resolve(__dirname, '../../../projects');
  const packages: { [key: string]: string } = {
    public: 'sbb-esta/angular-public',
    business: 'sbb-esta'
  };
  for (const key of Object.keys(packages)) {
    const root = join(projectsRoot, packages[key]);
    const modules = globSync(`${projectsRoot}/sbb-esta/angular-${key}/src/lib/*/`, {
      absolute: true
    });
    const outputPath = join(projectsRoot, `angular-showcase/src/app/${key}/apidoc`);
    const apiPackage = preparePackage(root, modules, outputPath);
    const docs = new Dgeni([apiPackage]);
    await docs.generate();
  }
});

/**
 * Minifies all HTML files that have been generated. The HTML files for the
 * highlighted examples can be skipped, because it won't have any effect.
 */
task('minify-html-files', () => {
  return src('projects/angular-showcase/src/docs/+(api|markdown)/**/*.html')
    .pipe(htmlmin(htmlMinifierOptions))
    .pipe(dest('projects/angular-showcase/src/docs'));
});

task('beautify-html-files', () => {
  return src('projects/angular-showcase/src/docs/+(api|markdown)/**/*.html')
    .pipe(
      htmlbeautify({
        preserve_newlines: false,
        indent_size: 2
      })
    )
    .pipe(dest('projects/angular-showcase/src/docs'));
});

/**
 * Returns a function to be called with an HTML document as its context that aliases HTML tags by
 * adding a class consisting of a prefix + the tag name.
 * @param classPrefix The prefix to use for the alias class.
 */
function createTagNameAliaser(classPrefix: string) {
  return function() {
    MARKDOWN_TAGS_TO_CLASS_ALIAS.forEach(tag => {
      for (const el of this.querySelectorAll(tag)) {
        el.classList.add(`${classPrefix}-${tag}`);
      }
    });

    return this;
  };
}
