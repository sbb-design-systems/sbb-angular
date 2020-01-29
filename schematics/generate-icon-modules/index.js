'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var schematics = require('@angular-devkit/schematics');

const ICON_ROOT = 'root';
class IconCollectionModule {
    constructor(name = '') {
        this.name = name;
        this.icons = [];
        this.collections = [];
        this.filename = core.strings.dasherize(name || ICON_ROOT);
    }
    get iconsRecursive() {
        return [
            ...this.icons,
            ...this.collections.reduce((current, next) => [...current, ...next.iconsRecursive], [])
        ];
    }
    apply(root) {
        const directory = this.name ? root.dir(core.fragment(this.filename)) : root;
        return schematics.chain([
            schematics.mergeWith(schematics.apply(schematics.url('./files/collection'), [
                schematics.template({
                    ...core.strings,
                    ...this
                }),
                schematics.move(directory.path)
            ])),
            ...this.collections.map(c => c.apply(directory)),
            ...this.icons.map(i => i.apply(directory))
        ]);
    }
}

class IconModule {
    get sizes() {
        return this._files
            .map(f => f.size)
            .filter(s => !!s)
            .sort();
    }
    get meta() {
        return this._files.map(f => f.filepath);
    }
    constructor(files) {
        this._files = files.sort((a, b) => b.size.localeCompare(a.size));
        this.name = this._files[0].name;
        this.modules = this._files[0].modules.slice();
    }
    apply(directory) {
        const iconBaseImport = () => `${'../'.repeat(this.modules.length)}icon-base`;
        return schematics.mergeWith(schematics.apply(schematics.url('./files/icon'), [
            schematics.template({
                ...core.strings,
                iconBaseImport,
                ...this._files[0],
                ...(this._files.some(f => ['large', 'medium', 'small'].includes(f.size))
                    ? { width: '24px', height: '24px', ratio: 1 }
                    : undefined),
                ...(this._files.length > 1 ? { template: this._mergeTemplates() } : undefined)
            }),
            schematics.move(directory.path)
        ]));
    }
    _mergeTemplates() {
        return this._files
            .reduce((current, next, i) => `${current}      ${next.template.replace('<svg ', i === 0
            ? '<svg *ngSwitchDefault '
            : `<svg *ngSwitchCase="size?.indexOf('${next.size}') === 0 ? size : ''" `)}\n`, '\n    <ng-container [ngSwitch]="size">\n')
            .replace(/$/, '    </ng-container>');
    }
}

const sizes = ['small', 'medium', 'large'];
const invalidModules = ['', 'svg', 'FPL', 'KOM', 'non-responsive', 'responsive', ...sizes];
const rules = [
    file => sizes.filter(size => file.name.endsWith(size)).forEach(size => (file.size = size)),
    file => (file.modules = file.modules.filter(m => !invalidModules.includes(m))),
    file => (file.modules = file.modules.map(m => m
        .replace(/^Attribut$/, 'TimetableAttributes')
        .replace(/^HIM_CUS$/, 'HimCus')
        .replace(/^Produkt$/, 'TimetableProducts')
        .replace(/^\d+_/, ''))),
    file => (file.name = file.name
        .replace(/^sbb_info$/, 'him_info')
        .replace(/^sbb_disruption$/, 'him_disruption')
        .replace(/^sbb_construction$/, 'him_construction')
        .replace(/^sbb_replacementbus$/, 'him_replacementbus')
        .replace(/^sbb_(\d+\_)?/i, '')
        .replace(/_[ ]?(\d{1,3}_)+(small|medium|large)$/, '')
        .replace(/_/g, '-')),
    file => (file.modules = file.modules.map((v, i, a) => `${a.slice(0, i).join('')}${v}`))
];
var namingRules = rules.map(r => (f) => {
    r(f);
    return f;
});

class Svgo {
    constructor() {
        try {
            const svgo = require('svgo');
            this._svgo = new svgo({
                plugins: [
                    { cleanupAttrs: true },
                    { removeDoctype: true },
                    { removeXMLProcInst: true },
                    { removeComments: true },
                    { removeMetadata: true },
                    { removeTitle: true },
                    { removeDesc: true },
                    { removeUselessDefs: true },
                    { removeEditorsNSData: true },
                    { removeEmptyAttrs: true },
                    { removeHiddenElems: true },
                    { removeEmptyText: true },
                    { removeEmptyContainers: true },
                    { removeViewBox: false },
                    { cleanupEnableBackground: true },
                    { convertStyleToAttrs: true },
                    { convertColors: true },
                    { convertPathData: true },
                    { convertTransform: true },
                    { removeUnknownsAndDefaults: true },
                    { removeNonInheritableGroupAttrs: true },
                    { removeUselessStrokeAndFill: true },
                    { removeUnusedNS: true },
                    { cleanupIDs: true },
                    { cleanupNumericValues: true },
                    { moveElemsAttrsToGroup: true },
                    { moveGroupAttrsToElems: true },
                    { collapseGroups: true },
                    { removeRasterImages: false },
                    { mergePaths: true },
                    { convertShapeToPath: true },
                    { sortAttrs: true },
                    { removeDimensions: true },
                    { removeAttrs: { attrs: '(font-family)' } }
                ]
            });
        }
        catch (_a) {
            throw new schematics.SchematicsException('This schematics requires the svgo package! (Install via `npm install -D svgo`');
        }
    }
    /**
     * Normalizes SVG mark-up, optimizing the content for cross-browser compatibility.
     * [svgo](https://github.com/svg/svgo) library is used for the scope with
     * configured options findable in svgo-configuration.ts.
     * @param svg Source SVG mark-up
     * @return normalized SVG mark-up
     */
    static async optimize(svg) {
        const { data } = await Svgo._instance._svgo.optimize(svg);
        return data.trim();
    }
}
Svgo._instance = new Svgo();

class SvgFile {
    constructor(name, modules, filepath, template, width, height, ratio) {
        this.name = name;
        this.modules = modules;
        this.filepath = filepath;
        this.template = template;
        this.width = width;
        this.height = height;
        this.ratio = ratio;
        this.size = '';
    }
    static async from(filepath, entry) {
        const lastSlashIndex = filepath.lastIndexOf('/');
        const name = filepath.substring(lastSlashIndex + 1, filepath.lastIndexOf('.'));
        const modules = filepath.substring(0, lastSlashIndex).split('/');
        const content = entry.content.toString('utf8');
        const template = (await Svgo.optimize(content)).replace('<svg ', `<svg focusable="false" [attr.class]="'sbb-svg-icon ' + svgClass" `);
        const width = SvgFile._determineDimension(/( width="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+(\d+)[ ,]+\d+")/g, content, filepath);
        const height = SvgFile._determineDimension(/( height="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+\d+[ ,]+(\d+))"/g, content, filepath);
        return new SvgFile(name, modules, filepath, template, `${width}px`, `${height}px`, width / height);
    }
    static _determineDimension(regex, content, filepath) {
        const match = regex.exec(content);
        if (!match) {
            throw new schematics.SchematicsException(`No width found in ${filepath}`);
        }
        return Number(match[2] || match[3]);
    }
}

class SvgSource {
    constructor(_files) {
        this._files = _files;
    }
    static async from(svgDirectory) {
        const files = [];
        svgDirectory.visit((path, entry) => {
            if (entry && path.endsWith('.svg')) {
                files.push(SvgFile.from(path, entry));
            }
        });
        const resolvedFiles = (await Promise.all(files)).map(f => namingRules.reduce((current, next) => next(current), f));
        return new SvgSource(resolvedFiles);
    }
    assertNoDuplicates() {
        const duplicates = this._files
            .map((file, i, a) => i === a.findIndex(f => f.name === file.name && f.size === file.size)
            ? a.filter(f => f.name === file.name && f.size === file.size)
            : [])
            .filter(f => f.length > 1);
        if (duplicates.length) {
            const duplicateOutput = duplicates
                .map(d => d.map(f => `  ${f.name}: ${f.filepath}`).join('\n'))
                .join('\n');
            throw new schematics.SchematicsException(`\nDuplicates found:\n${duplicateOutput}`);
        }
        return this;
    }
    toCollectionModules() {
        const iconModules = this._toIconModules();
        const moduleTrees = iconModules
            .map(i => i.modules)
            .filter((v, i, a) => i === a.findIndex(vi => vi.join(',') === v.join(',')));
        const collectionMap = new Map();
        const rootCollection = new IconCollectionModule();
        for (const moduleTree of moduleTrees) {
            let collection = rootCollection;
            for (const moduleName of moduleTree) {
                let localCollection = collection.collections.find(c => c.name === moduleName);
                if (!localCollection) {
                    localCollection = new IconCollectionModule(moduleName);
                    collectionMap.set(moduleTree.join(','), localCollection);
                    collection.collections.push(localCollection);
                }
                collection = localCollection;
            }
        }
        iconModules.forEach(i => 
        // tslint:disable-next-line:no-non-null-assertion
        collectionMap.get(i.modules.join(',')).icons.push(i));
        return rootCollection;
    }
    _toIconModules() {
        const svgMap = this._files.reduce((current, next) => current.set(next.name, [...(current.get(next.name) || []), next]), new Map());
        return Array.from(svgMap.values()).map(g => new IconModule(g));
    }
}

function generateIconModules() {
    return async (tree) => {
        const collection = (await SvgSource.from(tree.getDir('svg')))
            .assertNoDuplicates()
            .toCollectionModules();
        const dist = tree.getDir('projects/sbb-esta/angular-icons/src/lib');
        const icons = collection.iconsRecursive;
        return schematics.chain([
            schematics.mergeWith(schematics.apply(schematics.url('./files/root'), [
                schematics.template({
                    ...core.strings,
                    icons
                }),
                schematics.move(dist.path)
            ])),
            collection.apply(dist)
        ]);
    };
}

exports.generateIconModules = generateIconModules;
