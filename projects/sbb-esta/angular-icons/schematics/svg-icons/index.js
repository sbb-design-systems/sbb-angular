'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var schematics = require('@angular-devkit/schematics');
var schematics$1 = require('@angular/cdk/schematics');
var config = require('@schematics/angular/utility/config');
var core = require('@angular-devkit/core');

class IconModuleCollection {
    constructor(normalizedName) {
        this.normalizedName = normalizedName;
        this.icons = [];
        this.collections = new Map();
    }
    getCollection(normalizedName) {
        const existingCollection = this.collections.get(normalizedName);
        if (existingCollection) {
            return existingCollection;
        }
        const collection = new IconModuleCollection(normalizedName);
        this.collections.set(normalizedName, collection);
        return collection;
    }
    addIcon(iconModule) {
        this.icons.push(iconModule);
    }
    addAll(iconModules) {
        iconModules.forEach(i => i.collections.reduce((current, next) => current.getCollection(next), this).addIcon(i));
        return this;
    }
}

class IconModule {
    constructor(normalizedName, collections, svgContent, width, height) {
        this.normalizedName = normalizedName;
        this.collections = collections;
        this.svgContent = svgContent;
        this.width = width;
        this.height = height;
    }
}

function createSvgOptimizer() {
    const svgoType = tryLoadSvgo();
    const svgo = new svgoType({
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
            { removeAttrs: { attrs: '(font-family)' } },
            {
                ngNamespace: {
                    type: 'perItem',
                    active: true,
                    description: 'Angular namespacing',
                    fn: function (data) {
                        if (data.elem !== 'svg') {
                            data.elem = `svg:${data.elem}`;
                        }
                        return data;
                    }
                }
            }
        ]
    });
    return async (svg) => await svgo.optimize(svg).then(r => r.data);
}
function tryLoadSvgo() {
    try {
        return require('svgo');
    }
    catch (e) {
        throw new schematics.SchematicsException(`This schematic requires svgo!\nnpm install svgo --save-dev\n${e}`);
    }
}

class IconModuleFactory {
    constructor(_tree, _registryFileEntry) {
        this._tree = _tree;
        this._registryFileEntry = _registryFileEntry;
        this._svgOptimizer = createSvgOptimizer();
        this._registry = JSON.parse(_registryFileEntry.content.toString('utf8'));
    }
    async createIconModules() {
        const root = core.dirname(this._registryFileEntry.path);
        const iconFactories = Object.keys(this._registry).map(async (f) => {
            const path = core.join(root, f);
            const svgContent = this._readSvgContent(path);
            const width = this._determineWidth(svgContent, path);
            const height = this._determineHeight(svgContent, path);
            return new IconModule(this._registry[f].normalizedName, this._registry[f].collections, await this._svgOptimizer(svgContent), `${width}px`, `${height}px`);
        });
        return Promise.all(iconFactories);
    }
    _readSvgContent(path) {
        const content = this._tree.read(path);
        if (!content) {
            throw new schematics.SchematicsException(`File ${path} from registry does not exist!`);
        }
        return content.toString('utf8');
    }
    _determineWidth(content, filepath) {
        return this._determineDimension(/( width="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+(\d+)[ ,]+\d+")/g, 'width', content, filepath);
    }
    _determineHeight(content, filepath) {
        return this._determineDimension(/( height="([^"]+)"| viewBox="\d+[ ,]+\d+[ ,]+\d+[ ,]+(\d+))"/g, 'height', content, filepath);
    }
    _determineDimension(regex, type, content, filepath) {
        const match = regex.exec(content);
        if (!match) {
            throw new schematics.SchematicsException(`No ${type} found in ${filepath} (Either as attribute or in viewBox)`);
        }
        const value = Number((match[2] || match[3]).replace('px', ''));
        if (isNaN(value)) {
            throw new schematics.SchematicsException(`Cannot parse ${match[2] || match[3]} to a number`);
        }
        return value;
    }
}

class LibraryIconModuleGenerator {
    constructor(_rootCollection, tree, project, targetDir) {
        this._rootCollection = _rootCollection;
        this._projectRootDir = tree.getDir(project.root).path;
        this._targetDir = core.join(this._projectRootDir, targetDir);
        this._prefix = project.prefix || 'app';
        const packageJson = tree.read(core.join(this._projectRootDir, 'package.json'));
        if (!packageJson) {
            throw new schematics.SchematicsException(`Expected package.json in ${this._projectRootDir}`);
        }
        this._packageName = JSON.parse(packageJson.toString('utf8')).name;
    }
    generate() {
        return this._generateCollection(this._rootCollection, this._targetDir).concat(schematics.mergeWith(schematics.apply(schematics.url('./files/meta'), [
            schematics.template({
                ...core.strings,
                prefix: this._prefix,
                icons: this._recursiveIcons(this._rootCollection),
                packageName: this._packageName,
                path: core.relative(this._projectRootDir, this._targetDir)
            }),
            schematics.move(this._targetDir)
        ])));
    }
    _generateCollection(collection, targetDir) {
        return [
            schematics.chain([
                schematics.mergeWith(schematics.apply(schematics.url('./files/icon-entrypoint'), [
                    schematics.template({
                        ...collection,
                        packageName: this._packageName,
                        path: core.relative(this._projectRootDir, targetDir)
                    }),
                    schematics.move(targetDir)
                ])),
                this._generateIcons(collection.icons, core.join(targetDir, 'src'))
            ]),
            ...this._generateCollections(collection.collections, targetDir)
        ];
    }
    _generateIcons(icons, targetDir) {
        return schematics.chain(icons.map(i => schematics.mergeWith(schematics.apply(schematics.url('./files/icon'), [
            schematics.template({
                ...core.strings,
                ...i,
                prefix: this._prefix,
                cssClasses: i.collections.map(c => `${this._prefix}-icon-${c}`).join(' '),
                template: this._extractTemplate(i),
                attributes: this._extractAttributes(i)
            }),
            schematics.move(targetDir)
        ]))));
    }
    _generateCollections(collections, targetDir) {
        return Array.from(collections)
            .map(([path, c]) => this._generateCollection(c, core.join(targetDir, path)))
            .reduce((current, next) => current.concat(next), []);
    }
    _extractTemplate(icon) {
        const regex = /^<svg[^>]*>([\w\W]+)<\/svg>/m;
        const match = icon.svgContent.match(regex);
        if (!match || !match[1]) {
            throw new schematics.SchematicsException(`Parsing ${icon.normalizedName} with ${regex} failed`);
        }
        return match[1];
    }
    _extractAttributes(icon) {
        const regex = /^<svg([^>]*)>/m;
        const match = icon.svgContent.match(regex);
        if (!match || !match[1]) {
            throw new schematics.SchematicsException(`Parsing ${icon.normalizedName} with ${regex} failed`);
        }
        const attributesMatch = match[1].trim().match(/(\w+)=["']([^"]+)["']/g);
        if (!attributesMatch) {
            return [];
        }
        return attributesMatch.map(m => {
            const index = m.indexOf('=');
            return {
                key: m.substring(0, index),
                value: m.substring(index + 2, m.length - 1)
            };
        });
    }
    _recursiveIcons(collection) {
        return [
            ...collection.icons,
            ...Array.from(collection.collections)
                .map(([_, c]) => this._recursiveIcons(c))
                .reduce((current, next) => current.concat(next), [])
        ];
    }
}

function svgIcons(options) {
    return async (tree, context) => {
        const registryFileEntry = tree.get(options.svgRegistry);
        if (!registryFileEntry) {
            throw new schematics.SchematicsException(`Svg registry file is required to exist! (${options.svgRegistry})`);
        }
        const workspace = config.getWorkspace(tree);
        const project = schematics$1.getProjectFromWorkspace(workspace, options.project);
        const iconModules = await new IconModuleFactory(tree, registryFileEntry).createIconModules();
        const duplicates = iconModules
            .map(i => i.normalizedName)
            .filter((n, i, a) => a.findIndex(m => m === n) === i && a.filter(m => m === n).length > 1);
        if (duplicates.length) {
            throw new schematics.SchematicsException(`Duplicate normalized names found: ${duplicates.join(', ')}`);
        }
        const rootCollection = new IconModuleCollection().addAll(iconModules);
        if (project.projectType === 'library') {
            context.logger.info(`Detected project type library for project ${options.project}. Building icons as secondary entrypoints.`);
            const rules = new LibraryIconModuleGenerator(rootCollection, tree, project, options.targetDir).generate();
            return schematics.chain(rules);
        }
        else {
            return schematics.noop();
        }
    };
}

exports.svgIcons = svgIcons;
