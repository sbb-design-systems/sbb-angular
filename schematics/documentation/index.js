'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var core = require('@angular-devkit/core');
var hljs = require('highlight.js');
var marked = _interopDefault(require('marked'));

function documentation(_options) {
    return (tree, _context) => {
        buildHtmlForMarkdownFilesForLibrary(tree, 'angular-public');
        return tree;
    };
}
function buildHtmlForMarkdownFilesForLibrary(tree, library) {
    const libraryDirectory = tree.getDir(`projects/sbb-esta/${library}/src`);
    const files = resolveMarkdownFiles(libraryDirectory);
    files.forEach((entry, path) => {
        const htmlPath = path.replace(/\.md$/, '.html');
        const targetFile = core.normalize(`projects/angular-showcase/src/assets/docs/${htmlPath}`);
        const htmlContent = markdownToHtml(entry.content.toString('utf8'));
        tree.overwrite(targetFile, htmlContent);
    });
}
function resolveMarkdownFiles(root) {
    const map = new Map();
    root.visit((path, entry) => {
        if (core.extname(path) === '.md' && entry) {
            map.set(core.relative(root.path, path), entry);
        }
    });
    return map;
}
function markdownToHtml(content) {
    return marked(content, {
        highlight: (code, language) => {
            if (language) {
                // highlight.js expects "typescript" written out, while Github supports "ts".
                const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
                return hljs.highlight(lang, code).value;
            }
            return code;
        }
    });
}

exports.documentation = documentation;
