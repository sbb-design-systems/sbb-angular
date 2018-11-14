import { task, src, dest } from 'gulp';
import { Dgeni } from 'dgeni';
import { apiDocsPackage } from '../../dgeni/index';

// There are no type definitions available for these imports.
const markdown = require('gulp-markdown');
const transform = require('gulp-transform');
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
        gulpRunSequence(
            ...args,
            done
        );
    };
}

// Our docs contain comments of the form `<!-- example(...) -->` which serve as placeholders where
// example code should be inserted. We replace these comments with divs that have a
// `sbb-angular-docs-example` attribute which can be used to locate the divs and initialize the example
// viewer.
const EXAMPLE_PATTERN = /<!--\W*example\(([^)]+)\)\W*-->/g;

// Markdown files can contain links to other markdown files.
// Most of those links don't work in the docs, because the paths are invalid in the
// documentation page. Using a RegExp to rewrite links in HTML files to work in the docs.
const LINK_PATTERN = /(<a[^>]*) href="([^"]*)"/g;

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
    'code',
];

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
task('docs', sequenceTask(
    [
        'markdown-docs-sbb-angular',
        'build-highlighted-examples',
        'api-docs',
    ],
    'beautify-html-files'
));

/** Generates html files from the markdown overviews and guides. */
task('markdown-docs-sbb-angular', () => {
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

    return src(['src/app/examples/**/*.+(md)'])
        .pipe(rename({
            prefix: 'sbb-angular-',
            extname: '.html'
        }))
        .pipe(markdown(markdownOptions))
        //  .pipe(transform(transformMarkdownFiles))
        .pipe(dom(createTagNameAliaser('docs-markdown')))
        .pipe(dest('src/docs/markdown'));
});

/**
 * Creates syntax-highlighted html files from the examples to be used for the source view of
 * live examples on the docs site.
 */
task('build-highlighted-examples', () => {
    // rename files to fit format: [filename]-[filetype].html
    const renameFile = (filePath: any) => {
        const extension = filePath.extname.slice(1);
        filePath.basename = `${filePath.basename}-${extension}`;
    };

    return src('src/app/examples/**/*.+(html|scss|ts)')
        .pipe(flatten())
        .pipe(rename(renameFile))
        .pipe(highlight())
        .pipe(dest('src/docs/examples'));
});

/** Generates API docs from the source JsDoc using dgeni. */
task('api-docs', () => {
    const docs = new Dgeni([apiDocsPackage]);
    return docs.generate();
});

/**
 * Minifies all HTML files that have been generated. The HTML files for the
 * highlighted examples can be skipped, because it won't have any effect.
 */
task('minify-html-files', () => {
    return src('src/docs/+(api|markdown)/**/*.html')
        .pipe(htmlmin(htmlMinifierOptions))
        .pipe(dest('src/docs'));
});

task('beautify-html-files', () => {

    return src('src/docs/+(api|markdown)/**/*.html')
        .pipe(htmlbeautify({
            preserve_newlines: false,
            indent_size: 2
        }))
        .pipe(dest('src/docs'));
});

/**
 * Returns a function to be called with an HTML document as its context that aliases HTML tags by
 * adding a class consisting of a prefix + the tag name.
 * @param classPrefix The prefix to use for the alias class.
 */
function createTagNameAliaser(classPrefix: string) {
    return function () {
        MARKDOWN_TAGS_TO_CLASS_ALIAS.forEach(tag => {
            for (const el of this.querySelectorAll(tag)) {
                el.classList.add(`${classPrefix}-${tag}`);
            }
        });

        return this;
    };
}
