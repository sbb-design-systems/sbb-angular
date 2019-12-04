'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var core = require('@angular-devkit/core');
var dgeni = require('dgeni');
var fs = require('fs');
var hljs = _interopDefault(require('highlight.js'));
var htmlMinifier = require('html-minifier');
var marked = _interopDefault(require('marked'));
var path = require('path');
var typescript = require('typescript');
var ClassExportDoc = require('dgeni-packages/typescript/api-doc-types/ClassExportDoc');
var PropertyMemberDoc = require('dgeni-packages/typescript/api-doc-types/PropertyMemberDoc');
var MemberDoc = require('dgeni-packages/typescript/api-doc-types/MemberDoc');
var ApiDoc = require('dgeni-packages/typescript/api-doc-types/ApiDoc');
var ExportDoc = require('dgeni-packages/typescript/api-doc-types/ExportDoc');

// These type lacks type definitions.
const highlightJs = require('highlight.js');
/**
 * Transforms a given code block into its corresponding HTML output. We do this using
 * highlight.js because it allows us to show colored code blocks in our documentation.
 */
function highlightCodeBlock(code, language) {
    if (language) {
        return highlightJs.highlight(language.toLowerCase() === 'ts' ? 'typescript' : language, code)
            .value;
    }
    return code;
}

/**
 * Nunjucks extension that supports rendering highlighted content. Content that is placed in
 * between a {% highlight %} and {% end_highlight %} block will be automatically highlighted.
 *
 * HighlightJS cannot detect the code language automatically. Therefore, developers need to
 * specify the language manually as first tag-block argument.
 */
class HighlightNunjucksExtension {
    constructor() {
        /** Tags that will be parsed by this Nunjucks extension. */
        this.tags = ['highlight'];
        /** Disable autoescaping for content that is rendered within this extension. */
        this.autoescape = false;
    }
    parse(parser, nodes) {
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
    render(_context, language, contentFn) {
        return highlightCodeBlock(contentFn(), language);
    }
}

/** Regular expression that matches TypeScript mixin names inside of the project. */
const mixinNameRegex = /_\w+Base/;
/**
 * Function that patches Dgeni's instantiated log service. The patch will hide warnings about
 * unresolved TypeScript symbols for the mixin base classes.
 *
 * ```
 * warn:   Unresolved TypeScript symbol(s): _MatToolbarMixinBase - doc "material/toolbar/MatToolbar"
 *    (class)  - from file "material/toolbar/toolbar.ts" - starting at line 37, ending at line 98
 * ```
 *
 * Those warnings are valid, but are not fixable because the base class is created dynamically
 * through mixin functions and will be stored as a constant.
 */
function patchLogService(log) {
    const _warnFn = log.warn;
    log.warn = function (message) {
        if (message.includes('Unresolved TypeScript symbol') && mixinNameRegex.test(message)) {
            return;
        }
        _warnFn.apply(this, [message]);
    };
}

function isMethod(doc) {
    return doc.hasOwnProperty('parameters') && !doc.isGetAccessor && !doc.isSetAccessor;
}
function isGenericTypeParameter(doc) {
    if (doc.containerDoc instanceof ClassExportDoc.ClassExportDoc) {
        return doc.containerDoc.typeParams && `<${doc.name}>` === doc.containerDoc.typeParams;
    }
    return false;
}
function isProperty(doc) {
    if (doc instanceof PropertyMemberDoc.PropertyMemberDoc ||
        // The latest Dgeni version no longer treats getters or setters as properties.
        // From a user perspective, these are still properties and should be handled the same
        // way as normal properties.
        (!isMethod(doc) && (doc.isGetAccessor || doc.isSetAccessor))) {
        return !isGenericTypeParameter(doc);
    }
    return false;
}
function isDirective(doc) {
    return hasClassDecorator(doc, 'Component') || hasClassDecorator(doc, 'Directive');
}
function isService(doc) {
    return hasClassDecorator(doc, 'Injectable');
}
function isNgModule(doc) {
    return hasClassDecorator(doc, 'NgModule');
}
function isDeprecatedDoc(doc) {
    return ((doc.tags && doc.tags.tags) || []).some((tag) => tag.tagName === 'deprecated');
}
/** Whether the given document is annotated with the "@docs-primary-module" jsdoc tag. */
function isPrimaryModuleDoc(doc) {
    return ((doc.tags && doc.tags.tags) || []).some((tag) => tag.tagName === 'docs-primary-module');
}
function getDirectiveSelectors(classDoc) {
    if (classDoc.directiveMetadata) {
        const directiveSelectors = classDoc.directiveMetadata.get('selector');
        if (directiveSelectors) {
            return directiveSelectors
                .replace(/[\r\n]/g, '')
                .split(/\s*,\s*/)
                .filter(s => s !== '');
        }
    }
    return undefined;
}
function hasMemberDecorator(doc, decoratorName) {
    return doc.docType == 'member' && hasDecorator(doc, decoratorName);
}
function hasClassDecorator(doc, decoratorName) {
    return doc.docType == 'class' && hasDecorator(doc, decoratorName);
}
function hasDecorator(doc, decoratorName) {
    return (!!doc.decorators &&
        doc.decorators.length > 0 &&
        doc.decorators.some(d => d.name == decoratorName));
}
function getBreakingChange(doc) {
    if (!doc.tags) {
        return null;
    }
    const breakingChange = doc.tags.tags.find((t) => t.tagName === 'breaking-change');
    return breakingChange ? breakingChange.description : null;
}
/**
 * Decorates public exposed docs. Creates a property on the doc that indicates whether
 * the item is deprecated or not.
 */
function decorateDeprecatedDoc(doc) {
    doc.isDeprecated = isDeprecatedDoc(doc);
    doc.breakingChange = getBreakingChange(doc);
    if (doc.isDeprecated && !doc.breakingChange) {
        console.warn('Warning: There is a deprecated item without a @breaking-change tag.', doc.id);
    }
}

/**
 * Determines the component or directive metadata from the specified Dgeni class doc. The resolved
 * directive metadata will be stored in a Map.
 *
 * Currently only string literal assignments and array literal assignments are supported. Other
 * value types are not necessary because they are not needed for any user-facing documentation.
 *
 * ```ts
 * @Component({
 *   inputs: ["red", "blue"],
 *   exportAs: "test"
 * })
 * export class MyComponent {}
 * ```
 */
function getDirectiveMetadata(classDoc) {
    const declaration = classDoc.symbol.valueDeclaration;
    if (!declaration || !declaration.decorators) {
        return null;
    }
    const expression = declaration.decorators
        .filter(decorator => decorator.expression && typescript.isCallExpression(decorator.expression))
        .map(decorator => decorator.expression)
        .find(callExpression => callExpression.expression.getText() === 'Component' ||
        callExpression.expression.getText() === 'Directive');
    if (!expression) {
        return null;
    }
    // The argument length of the CallExpression needs to be exactly one, because it's the single
    // JSON object in the @Component/@Directive decorator.
    if (expression.arguments.length !== 1) {
        return null;
    }
    const objectExpression = expression.arguments[0];
    const resultMetadata = new Map();
    objectExpression.properties.forEach(prop => {
        // Support ArrayLiteralExpression assignments in the directive metadata.
        if (prop.initializer.kind === typescript.SyntaxKind.ArrayLiteralExpression) {
            const arrayData = prop.initializer.elements.map(literal => literal.text);
            resultMetadata.set(prop.name.getText(), arrayData);
        }
        // Support normal StringLiteral and NoSubstitutionTemplateLiteral assignments
        if (prop.initializer.kind === typescript.SyntaxKind.StringLiteral ||
            prop.initializer.kind === typescript.SyntaxKind.NoSubstitutionTemplateLiteral) {
            resultMetadata.set(prop.name.getText(), prop.initializer.text);
        }
    });
    return resultMetadata;
}

/**
 * The `parameters` property are the parameters extracted from TypeScript and are strings
 * of the form "propertyName: propertyType" (literally what's written in the source).
 *
 * The `params` property is pulled from the `@param` JsDoc tag. We need to merge
 * the information of these to get name + type + description.
 *
 * We will use the `params` property to store the final normalized form since it is already
 * an object.
 */
function normalizeFunctionParameters(doc) {
    if (doc.parameters) {
        doc.parameters.forEach(parameter => {
            let [parameterName, parameterType] = parameter.split(':');
            // If the parameter is optional, the name here will contain a '?'. We store whether the
            // parameter is optional and remove the '?' for comparison.
            let isOptional = false;
            if (parameterName.includes('?')) {
                isOptional = true;
                parameterName = parameterName.replace('?', '');
            }
            doc.params = doc.params || [];
            if (!parameterType) {
                console.warn(`Missing parameter type information (${parameterName}) in ` +
                    `${doc.fileInfo.relativePath}:${doc.startingLine}`);
                return;
            }
            const existingParameterInfo = doc.params.find(p => p.name == parameterName);
            if (!existingParameterInfo) {
                doc.params.push({
                    name: parameterName,
                    type: parameterType.trim(),
                    isOptional: isOptional,
                    description: ''
                });
            }
            else {
                existingParameterInfo.type = parameterType.trim();
                existingParameterInfo.isOptional = isOptional;
            }
        });
    }
}

const INTERNAL_METHODS = [
    // Lifecycle methods
    'ngOnInit',
    'ngOnChanges',
    'ngDoCheck',
    'ngAfterContentInit',
    'ngAfterContentChecked',
    'ngAfterViewInit',
    'ngAfterViewChecked',
    'ngOnDestroy',
    // ControlValueAccessor methods
    'writeValue',
    'registerOnChange',
    'registerOnTouched',
    'setDisabledState',
    // Don't ever need to document constructors
    'constructor',
    // tabIndex exists on all elements, no need to document it
    'tabIndex'
];
/** Checks whether the given API document is public. */
function isPublicDoc(doc) {
    if (_isEnforcedPublicDoc(doc)) {
        return true;
    }
    if (_hasDocsPrivateTag(doc) || doc.name.startsWith('_')) {
        return false;
    }
    else if (doc instanceof MemberDoc.MemberDoc) {
        return !_isInternalMember(doc);
    }
    return true;
}
/** Gets the @docs-public tag from the given document if present. */
function getDocsPublicTag(doc) {
    const tags = doc.tags && doc.tags.tags;
    return tags ? tags.find((d) => d.tagName == 'docs-public') : undefined;
}
/** Whether the given method member is listed as an internal member. */
function _isInternalMember(memberDoc) {
    return INTERNAL_METHODS.includes(memberDoc.name);
}
/** Whether the given doc has a @docs-private tag set. */
function _hasDocsPrivateTag(doc) {
    const tags = doc.tags && doc.tags.tags;
    return tags ? tags.find((d) => d.tagName == 'docs-private') : false;
}
/**
 * Whether the given doc has the @docs-public tag specified and should be enforced as
 * public document. This allows symbols which are usually private to show up in the docs.
 *
 * Additionally symbols with "@docs-public" tag can specify a public name under which the
 * document should show up in the docs. This is useful for cases where a class needs to be
 * split up into several base classes to support the MDC prototypes. e.g. "_MatMenu" should
 * show up in the docs as "MatMenu".
 */
function _isEnforcedPublicDoc(doc) {
    return getDocsPublicTag(doc) !== undefined;
}

/**
 * Detects whether the specified property member is an input. If the property is an input, the
 * alias and input name will be returned.
 */
function getInputBindingData(doc, metadata) {
    return getBindingPropertyData(doc, metadata, 'inputs', 'Input');
}
/**
 * Detects whether the specified property member is an output. If the property is an output, the
 * alias and output name will be returned.
 */
function getOutputBindingData(doc, metadata) {
    return getBindingPropertyData(doc, metadata, 'outputs', 'Output');
}
/**
 * Method that detects the specified type of property binding (either "output" or "input") from
 * the directive metadata or from the associated decorator on the property.
 */
function getBindingPropertyData(doc, metadata, propertyName, decoratorName) {
    if (metadata) {
        const metadataValues = metadata.get(propertyName) || [];
        const foundValue = metadataValues.find(value => value.split(':')[0] === doc.name);
        if (foundValue) {
            return {
                name: doc.name,
                alias: foundValue.split(':')[1]
            };
        }
    }
    if (hasMemberDecorator(doc, decoratorName)) {
        return {
            name: doc.name,
            alias: doc.decorators.find(d => d.name == decoratorName).arguments[0]
        };
    }
    return undefined;
}

/** Sorts method members by deprecated status, member decorator, and name. */
function sortCategorizedMethodMembers(docA, docB) {
    // Sort deprecated docs to the end
    if (!docA.isDeprecated && docB.isDeprecated) {
        return -1;
    }
    if (docA.isDeprecated && !docB.isDeprecated) {
        return 1;
    }
    // Break ties by sorting alphabetically on the name
    if (docA.name < docB.name) {
        return -1;
    }
    if (docA.name > docB.name) {
        return 1;
    }
    return 0;
}
/** Sorts property members by deprecated status, member decorator, and name. */
function sortCategorizedPropertyMembers(docA, docB) {
    // Sort deprecated docs to the end
    if (!docA.isDeprecated && docB.isDeprecated) {
        return -1;
    }
    if (docA.isDeprecated && !docB.isDeprecated) {
        return 1;
    }
    // Sort in the order of: Inputs, Outputs, neither
    if ((docA.isDirectiveInput && !docB.isDirectiveInput) ||
        (docA.isDirectiveOutput && !docB.isDirectiveInput && !docB.isDirectiveOutput)) {
        return -1;
    }
    if ((docB.isDirectiveInput && !docA.isDirectiveInput) ||
        (docB.isDirectiveOutput && !docA.isDirectiveInput && !docA.isDirectiveOutput)) {
        return 1;
    }
    // Break ties by sorting alphabetically on the name
    if (docA.name < docB.name) {
        return -1;
    }
    if (docA.name > docB.name) {
        return 1;
    }
    return 0;
}

/**
 * Processor to add properties to docs objects.
 *
 * isMethod     | Whether the doc is for a method on a class.
 * isDirective  | Whether the doc is for a @Component or a @Directive
 * isService    | Whether the doc is for an @Injectable
 * isNgModule   | Whether the doc is for an NgModule
 */
class Categorizer {
    constructor() {
        this.name = 'categorizer';
        this.$runBefore = ['docs-processed'];
    }
    $process(docs) {
        docs
            .filter(doc => doc.docType === 'class' || doc.docType === 'interface')
            .forEach(doc => this._decorateClassLikeDoc(doc));
        docs
            .filter(doc => doc.docType === 'function')
            .forEach(doc => this._decorateFunctionExportDoc(doc));
        docs.filter(doc => doc.docType === 'const').forEach(doc => this._decorateConstExportDoc(doc));
        docs
            .filter(doc => doc.docType === 'type-alias')
            .forEach(doc => this._decorateTypeAliasExportDoc(doc));
    }
    /**
     * Decorates all class and interface docs inside of the dgeni pipeline.
     * - Members of a class and interface document will be extracted into separate variables.
     */
    _decorateClassLikeDoc(classLikeDoc) {
        // Resolve all methods and properties from the classDoc.
        classLikeDoc.methods = classLikeDoc.members
            .filter(isMethod)
            .filter(filterDuplicateMembers);
        classLikeDoc.properties = classLikeDoc.members
            .filter(isProperty)
            .filter(filterDuplicateMembers);
        // Special decorations for real class documents that don't apply for interfaces.
        if (classLikeDoc.docType === 'class') {
            this._decorateClassDoc(classLikeDoc);
            this._replaceMethodsWithOverload(classLikeDoc);
        }
        // Call decorate hooks that can modify the method and property docs.
        classLikeDoc.methods.forEach(doc => this._decorateMethodDoc(doc));
        classLikeDoc.properties.forEach(doc => this._decoratePropertyDoc(doc));
        decorateDeprecatedDoc(classLikeDoc);
        // Sort members
        classLikeDoc.methods.sort(sortCategorizedMethodMembers);
        classLikeDoc.properties.sort(sortCategorizedPropertyMembers);
    }
    /**
     * Decorates all Dgeni class documents for a simpler use inside of the template.
     * - Identifies directives, services or NgModules and marks them them inside of the doc.
     * - Links the Dgeni document to the Dgeni document that the current class extends from.
     */
    _decorateClassDoc(classDoc) {
        // Classes can only extend a single class. This means that there can't be multiple extend
        // clauses for the Dgeni document. To make the template syntax simpler and more readable,
        // store the extended class in a variable.
        classDoc.extendedDoc = classDoc.extendsClauses[0] ? classDoc.extendsClauses[0].doc : undefined;
        classDoc.directiveMetadata = getDirectiveMetadata(classDoc);
        // In case the extended document is not public, we don't want to print it in the
        // rendered class API doc. This causes confusion and also is not helpful as the
        // extended document is not part of the docs and cannot be viewed.
        if (classDoc.extendedDoc !== undefined && !isPublicDoc(classDoc.extendedDoc)) {
            classDoc.extendedDoc = undefined;
        }
        // Categorize the current visited classDoc into its Angular type.
        if (isDirective(classDoc) && classDoc.directiveMetadata) {
            classDoc.isDirective = true;
            classDoc.directiveExportAs = classDoc.directiveMetadata.get('exportAs');
            classDoc.directiveSelectors = getDirectiveSelectors(classDoc);
        }
        else if (isService(classDoc)) {
            classDoc.isService = true;
        }
        else if (isNgModule(classDoc)) {
            classDoc.isNgModule = true;
        }
    }
    /**
     * Method that will be called for each method doc. The parameters for the method-docs
     * will be normalized, so that they can be easily used inside of dgeni templates.
     */
    _decorateMethodDoc(methodDoc) {
        normalizeFunctionParameters(methodDoc);
        decorateDeprecatedDoc(methodDoc);
    }
    /**
     * Method that will be called for each function export doc. The parameters for the functions
     * will be normalized, so that they can be easily used inside of Dgeni templates.
     */
    _decorateFunctionExportDoc(functionDoc) {
        normalizeFunctionParameters(functionDoc);
        decorateDeprecatedDoc(functionDoc);
    }
    /**
     * Method that will be called for each const export document. We decorate the const
     * documents with a property that states whether the constant is deprecated or not.
     */
    _decorateConstExportDoc(doc) {
        decorateDeprecatedDoc(doc);
    }
    /**
     * Method that will be called for each type-alias export document. We decorate the type-alias
     * documents with a property that states whether the type-alias is deprecated or not.
     */
    _decorateTypeAliasExportDoc(doc) {
        decorateDeprecatedDoc(doc);
    }
    /**
     * Method that will be called for each property doc. Properties that are Angular inputs or
     * outputs will be marked. Aliases for the inputs or outputs will be stored as well.
     */
    _decoratePropertyDoc(propertyDoc) {
        decorateDeprecatedDoc(propertyDoc);
        const metadata = propertyDoc.containerDoc.docType === 'class'
            ? propertyDoc.containerDoc.directiveMetadata
            : null;
        const inputMetadata = metadata ? getInputBindingData(propertyDoc, metadata) : null;
        const outputMetadata = metadata ? getOutputBindingData(propertyDoc, metadata) : null;
        propertyDoc.isDirectiveInput = !!inputMetadata;
        propertyDoc.directiveInputAlias = (inputMetadata && inputMetadata.alias) || '';
        propertyDoc.isDirectiveOutput = !!outputMetadata;
        propertyDoc.directiveOutputAlias = (outputMetadata && outputMetadata.alias) || '';
    }
    /**
     * Walks through every method of the specified class doc and replaces the method
     * with its referenced overload method definitions, if the method is having overload definitions.
     */
    _replaceMethodsWithOverload(classDoc) {
        const methodsToAdd = [];
        classDoc.methods.forEach((methodDoc, index) => {
            if (methodDoc.overloads.length > 0) {
                // Add each method overload to the methods that will be shown in the docs.
                // Note that we cannot add the overloads immediately to the methods array because
                // that would cause the iteration to visit the new overloads.
                methodsToAdd.push(...methodDoc.overloads);
                // Remove the base method for the overloads from the documentation.
                classDoc.methods.splice(index, 1);
            }
        });
        classDoc.methods.push(...methodsToAdd);
    }
}
/** Filters any duplicate classDoc members from an array */
function filterDuplicateMembers(item, _index, array) {
    return array.filter(memberDoc => memberDoc.name === item.name)[0] === item;
}

/**
 * Processor to filter out symbols that should not be shown in the Material docs.
 */
class DocsPrivateFilter {
    constructor() {
        this.name = 'docs-private-filter';
        this.$runBefore = ['categorizer'];
    }
    $process(docs) {
        return docs.filter(doc => {
            const isPublic = isPublicDoc(doc);
            // Update the API document name in case the "@docs-public" tag is used
            // with an alias name.
            if (isPublic && doc instanceof ApiDoc.BaseApiDoc) {
                const docsPublicTag = getDocsPublicTag(doc);
                if (docsPublicTag !== undefined && docsPublicTag.description) {
                    doc.name = docsPublicTag.description;
                }
            }
            // Filter out private class members which could be annotated
            // with the "@docs-private" tag.
            if (isPublic && doc instanceof ClassExportDoc.ClassExportDoc) {
                doc.members = doc.members.filter(memberDoc => isPublicDoc(memberDoc));
            }
            return isPublic;
        });
    }
}

/**
 * Computes an URL that refers to the given API document in the docs. Note that this logic
 * needs to be kept in sync with the routes from the sbb-angular project.
 */
function computeApiDocumentUrl(apiDoc, moduleInfo) {
    const baseUrl = moduleInfo.packageName.split('-')[1];
    return baseUrl === 'core'
        ? `${baseUrl}/api/${moduleInfo.entryPointName}#${apiDoc.name}`
        : `${baseUrl}/components/${moduleInfo.entryPointName}/api#${apiDoc.name}`;
}

/** Document type for an entry-point. */
class EntryPointDoc {
    constructor(name) {
        /** Unique document type for Dgeni. */
        this.docType = 'entry-point';
        /** Known aliases for the entry-point. This is only needed for the `computeIdsProcessor`. */
        this.aliases = [];
        /** List of categorized class docs that are defining a directive. */
        this.directives = [];
        /** List of categorized class docs that are defining a service. */
        this.services = [];
        /** Classes that belong to the entry-point. */
        this.classes = [];
        /** Interfaces that belong to the entry-point. */
        this.interfaces = [];
        /** Type aliases that belong to the entry-point. */
        this.typeAliases = [];
        /** Functions that belong to the entry-point. */
        this.functions = [];
        /** Constants that belong to the entry-point. */
        this.constants = [];
        /** List of NgModules which are exported in the current entry-point. */
        this.exportedNgModules = [];
        /** NgModule that defines the current entry-point. Null if no module could be found. */
        this.ngModule = null;
        this.name = name;
        this.id = `entry-point-${name}`;
    }
}
/**
 * Processor to group docs into entry-points that consist of directives, component, classes,
 * interfaces, functions or type aliases.
 */
class EntryPointGrouper {
    constructor() {
        this.name = 'entry-point-grouper';
        this.$runBefore = ['docs-processed'];
    }
    $process(docs) {
        const entryPoints = new Map();
        docs.forEach(doc => {
            const moduleInfo = getModulePackageInfo(doc);
            const packageName = moduleInfo.packageName;
            const packageDisplayName = packageName === 'cdk' ? 'CDK' : 'Material';
            const moduleImportPath = `@sbb-esta/${packageName}/${moduleInfo.entryPointName}`;
            const entryPointName = packageName + '-' + moduleInfo.name;
            // Compute a public URL that refers to the document. This is helpful if we want to
            // make references to other API documents. e.g. showing the extended class.
            doc.publicUrl = computeApiDocumentUrl(doc, moduleInfo);
            // Get the entry-point for this doc, or, if one does not exist, create it.
            let entryPoint;
            if (entryPoints.has(entryPointName)) {
                entryPoint = entryPoints.get(entryPointName);
            }
            else {
                entryPoint = new EntryPointDoc(entryPointName);
                entryPoints.set(entryPointName, entryPoint);
            }
            entryPoint.displayName = moduleInfo.name;
            entryPoint.moduleImportPath = moduleImportPath;
            entryPoint.packageName = packageName;
            entryPoint.packageDisplayName = packageDisplayName;
            // Put this doc into the appropriate list in the entry-point doc.
            if (doc.isDirective) {
                entryPoint.directives.push(doc);
            }
            else if (doc.isService) {
                entryPoint.services.push(doc);
            }
            else if (doc.isNgModule) {
                entryPoint.exportedNgModules.push(doc);
                // If the module is explicitly marked as primary module using the "@docs-primary-module"
                // annotation, we set is as primary entry-point module.
                if (isPrimaryModuleDoc(doc)) {
                    entryPoint.ngModule = doc;
                }
            }
            else if (doc.docType === 'class') {
                entryPoint.classes.push(doc);
            }
            else if (doc.docType === 'interface') {
                entryPoint.interfaces.push(doc);
            }
            else if (doc.docType === 'type-alias') {
                entryPoint.typeAliases.push(doc);
            }
            else if (doc.docType === 'function') {
                entryPoint.functions.push(doc);
            }
            else if (doc.docType === 'const') {
                entryPoint.constants.push(doc);
            }
        });
        // For each entry-point we determine a primary NgModule that defines the entry-point
        // if no primary module has been explicitly declared (using "@docs-primary-module").
        entryPoints.forEach(entryPoint => {
            if (entryPoint.ngModule !== null) {
                return;
            }
            // Usually the first module that is not deprecated is used, but in case there are
            // only deprecated modules, the last deprecated module is used. We don't want to
            // always skip deprecated modules as they could be still needed for documentation
            // of a deprecated entry-point.
            for (let ngModule of entryPoint.exportedNgModules) {
                entryPoint.ngModule = ngModule;
                if (!isDeprecatedDoc(ngModule)) {
                    break;
                }
            }
        });
        return Array.from(entryPoints.values());
    }
}
/** Resolves module package information of the given Dgeni document. */
function getModulePackageInfo(doc) {
    // Full path to the file for this doc.
    const basePath = doc.fileInfo.basePath;
    const filePath = doc.fileInfo.filePath;
    // All of the component documentation is under either `src/material` or `src/cdk`.
    // We group the docs up by the directory immediately under that root.
    const pathSegments = path.relative(basePath, filePath).split(path.sep);
    // The module name is usually the entry-point (e.g. slide-toggle, toolbar), but this is not
    // guaranteed because we can also export a module from material/core. e.g. the ripple module.
    let moduleName = pathSegments[1];
    // The ripples are technically part of the `@angular/material/core` entry-point, but we
    // want to show the ripple API separately in the docs. In order to archive this, we treat
    // the ripple folder as its own module.
    if (pathSegments[1] === 'core' && pathSegments[2] === 'ripple') {
        moduleName = 'ripple';
    }
    return {
        name: moduleName,
        packageName: pathSegments[0],
        entryPointName: pathSegments[1]
    };
}

/**
 * Processor to filter out Dgeni documents that are exported multiple times. This is necessary
 * to avoid that API entries are showing up multiple times in the docs.
 *
 * ```ts
 *   // Some file in @angular/cdk/scrolling
 *   export {ScrollDispatcher} from './scroll-dispatcher';
 *
 *   // Other file in @angular/cdk/overlay
 *   export {ScrollDispatcher} from '@angular/cdk/scrolling';
 *
 *   // Re-export of the same export with a different name (alias).
 *   export {ScrollDispatcher as X} from './scroll-dispatcher';
 * ```
 *
 * This issue occurs sometimes in the Angular Material repository, because some imports are
 * re-exported with a different name (for deprecation), or from a different secondary entry-point.
 */
class FilterDuplicateExports {
    constructor() {
        this.name = 'filter-duplicate-exports';
        this.$runBefore = ['categorizer'];
    }
    $process(docs) {
        const duplicateDocs = this.findDuplicateExports(docs);
        return docs.filter(d => !duplicateDocs.has(d));
    }
    findDuplicateExports(docs) {
        const duplicates = new Set();
        docs.forEach(doc => {
            if (!(doc instanceof ExportDoc.ExportDoc)) {
                return;
            }
            // Check for Dgeni documents that refer to the same TypeScript symbol. Those can be
            // considered as duplicates of the current document.
            const similarDocs = docs.filter(d => d.symbol === doc.symbol);
            if (similarDocs.length > 1) {
                // If there are multiple docs that refer to the same TypeScript symbol, but have a
                // different name than the resolved symbol, we can remove those documents, since they
                // are just aliasing an already existing export.
                similarDocs.filter(d => d.symbol.name !== d.name).forEach(d => duplicates.add(d));
                const docsWithSameName = similarDocs.filter(d => d.symbol.name === d.name);
                // If there are multiple docs that refer to the same TypeScript symbol and have
                // the same name, we need to remove all of those duplicates except one.
                if (docsWithSameName.length > 1) {
                    docsWithSameName.slice(1).forEach(d => duplicates.add(d));
                }
            }
        });
        return duplicates;
    }
}

/**
 * Processor that merges inherited properties of a class with the class doc. This is necessary
 * to properly show public properties from TypeScript mixin interfaces in the API.
 */
class MergeInheritedProperties {
    constructor() {
        this.name = 'merge-inherited-properties';
        this.$runBefore = ['categorizer'];
    }
    $process(docs) {
        return docs
            .filter(doc => doc.docType === 'class')
            .forEach(doc => this._addInheritedProperties(doc));
    }
    _addInheritedProperties(doc) {
        doc.implementsClauses
            .filter(clause => clause.doc)
            .forEach(clause => {
            clause.doc.members.forEach(member => this._addMemberDocIfNotPresent(doc, member));
        });
        doc.extendsClauses
            .filter(clause => clause.doc)
            .forEach(clause => {
            clause.doc.members.forEach(member => this._addMemberDocIfNotPresent(doc, member));
        });
    }
    _addMemberDocIfNotPresent(destination, memberDoc) {
        if (!destination.members.find(member => member.name === memberDoc.name)) {
            // To be able to differentiate between member docs from the heritage clause and the
            // member doc for the destination class, we clone the member doc. It's important to keep
            // the prototype and reference because later, Dgeni identifies members and properties
            // by using an instance comparison.
            const newMemberDoc = Object.assign(Object.create(memberDoc), memberDoc);
            newMemberDoc.containerDoc = destination;
            destination.members.push(newMemberDoc);
        }
    }
}

// Dgeni packages that the Material docs package depends on.
const jsdocPackage = require('dgeni-packages/jsdoc');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typescriptPackage = require('dgeni-packages/typescript');
/**
 * Dgeni package for the sbb-angular docs. This just defines the package, but doesn't
 * generate the docs yet.
 *
 * Dgeni packages are very similar to AngularJS modules. Those can contain:
 *
 *  - Services that can be injected
 *  - Templates that are used to convert the data into HTML output.
 *  - Processors that can modify the doc items (like a build pipeline).
 *
 * Similar to AngularJS, there is also a `config` lifecycle hook, that can be used to
 * configure specific processors, services before the procession begins.
 */
// tslint:disable-next-line: naming-convention
const apiDocsPackage = new dgeni.Package('sbb-angular', [
    jsdocPackage,
    nunjucksPackage,
    typescriptPackage
]);
// Processor that filters out duplicate exports that should not be shown in the docs.
apiDocsPackage.processor(new FilterDuplicateExports());
// Processor that merges inherited properties of a class with the class doc.
apiDocsPackage.processor(new MergeInheritedProperties());
// Processor that filters out symbols that should not be shown in the docs.
apiDocsPackage.processor(new DocsPrivateFilter());
// Processor that appends categorization flags to the docs, e.g. `isDirective`, `isNgModule`, etc.
apiDocsPackage.processor(new Categorizer());
// Processor to group docs into top-level entry-points such as "tabs", "sidenav", etc.
apiDocsPackage.processor(new EntryPointGrouper());
// Configure the log level of the API docs dgeni package.
apiDocsPackage.config(function (log) {
    return (log.level = 'warning');
});
// Configure the processor for reading files from the file system.
apiDocsPackage.config(function (readFilesProcessor) {
    // Disable we currently only use the "readTypeScriptModules" processor
    readFilesProcessor.$enabled = false;
});
// Patches Dgeni's log service to not print warnings about unresolved mixin base symbols.
apiDocsPackage.config(function (log) {
    return patchLogService(log);
});
// Configure the output path for written files (i.e., file names).
apiDocsPackage.config(function (computePathsProcessor) {
    computePathsProcessor.pathTemplates = [
        {
            docTypes: ['entry-point'],
            pathTemplate: '${name}',
            outputPathTemplate: '${name}.html'
        }
    ];
});
// Configure custom JsDoc tags.
apiDocsPackage.config(function (parseTagsProcessor) {
    parseTagsProcessor.tagDefinitions = parseTagsProcessor.tagDefinitions.concat([
        { name: 'docs-private' },
        { name: 'docs-public' },
        { name: 'docs-primary-module' },
        { name: 'breaking-change' }
    ]);
});
apiDocsPackage.config(function (checkAnchorLinksProcessor) {
    // This ensures that Dgeni will fail if we generate links that don't follow this format.
    checkAnchorLinksProcessor.ignoredLinks.push(/(components|cdk)\/[\w-]+\/api#\w+/);
});
// Configure the processor for understanding TypeScript.
apiDocsPackage.config(function (readTypeScriptModules) {
    readTypeScriptModules.hidePrivateMembers = true;
});
apiDocsPackage.config(function (tsHost) {
    // Disable concatenation of multiple leading comments for a TypeScript node. Since all shipped
    // source files have a license banner at top, the license banner comment would be incorrectly
    // considered as "comment" for the first TypeScript node of a given file. Since there are
    // various files in the Material project where the first node of a source file is exported and
    // should only use the first leading comment, we need to disable comment concatenation.
    // See for example: src/cdk/coercion/boolean-property.ts
    tsHost.concatMultipleLeadingComments = false;
    // Explicitly disable truncation for types that will be displayed as strings. Otherwise
    // TypeScript by default truncates long types and causes misleading API documentation.
    tsHost.typeFormatFlags = typescript.TypeFormatFlags.NoTruncation;
});
// Configure processor for finding nunjucks templates.
apiDocsPackage.config(function (templateFinder, templateEngine) {
    // Standard patterns for matching docs to templates
    templateFinder.templatePatterns = [
        '${ doc.template }',
        '${ doc.id }.${ doc.docType }.template.html',
        '${ doc.id }.template.html',
        '${ doc.docType }.template.html',
        '${ doc.id }.${ doc.docType }.template.js',
        '${ doc.id }.template.js',
        '${ doc.docType }.template.js',
        '${ doc.id }.${ doc.docType }.template.json',
        '${ doc.id }.template.json',
        '${ doc.docType }.template.json',
        'common.template.html'
    ];
    // Dgeni disables autoescape by default, but we want this turned on.
    templateEngine.config.autoescape = true;
    // Nunjucks and Angular conflict in their template bindings so change Nunjucks
    templateEngine.config.tags = {
        variableStart: '{$',
        variableEnd: '$}'
    };
    templateEngine.tags.push(new HighlightNunjucksExtension());
});

function documentation(_options) {
    return async (tree, _context) => {
        for (const library of ['angular-core', 'angular-public', 'angular-business']) {
            renderHtmlForMarkdownFilesForLibrary(tree, library);
            renderExampleFilesForLibrary(tree, library);
        }
        for (const library of ['angular-keycloak', 'angular-icons']) {
            renderHtmlForMarkdownFilesForLibrary(tree, library);
        }
        await buildApiDocumentationForLibrary(['angular-core', 'angular-public', 'angular-business']);
    };
}
function renderHtmlForMarkdownFilesForLibrary(tree, library) {
    const libraryDirectory = tree.getDir(`projects/sbb-esta/${library}`);
    const files = findMarkdownFiles(libraryDirectory);
    files.forEach((entry, path) => {
        const htmlPath = path.replace(/\.md$/, '.html');
        const targetFile = core.normalize(`projects/angular-showcase/src/assets/docs/${library}/${htmlPath}`);
        const htmlContent = markdownToHtml(entry.content.toString('utf8'));
        if (tree.exists(targetFile)) {
            tree.overwrite(targetFile, htmlContent);
        }
        else {
            tree.create(targetFile, htmlContent);
        }
    });
}
function findMarkdownFiles(root) {
    const map = new Map();
    root.visit((path, entry) => {
        if (core.extname(path) === '.md' && entry) {
            map.set(core.basename(path), entry);
        }
    });
    return map;
}
function markdownToHtml(content) {
    const html = marked(content, { highlight });
    return htmlMinifier.minify(html, {
        collapseWhitespace: true,
        removeComments: true,
        caseSensitive: true,
        removeAttributeQuotes: false
    });
}
function renderExampleFilesForLibrary(tree, library) {
    const shortName = library.split('-')[1];
    const examplesDirectory = tree.getDir(`projects/angular-showcase/src/app/${shortName}/${shortName}-examples`);
    const files = findExampleFiles(examplesDirectory);
    files.forEach((entry, fragment) => {
        const targetFile = core.normalize(`projects/angular-showcase/src/assets/docs/${library}/examples/${fragment}.html`);
        const language = core.extname(fragment).substring(1);
        const htmlContent = highlight(entry.content.toString('utf8'), language);
        if (tree.exists(targetFile)) {
            tree.overwrite(targetFile, htmlContent);
        }
        else {
            tree.create(targetFile, htmlContent);
        }
    });
}
function findExampleFiles(root) {
    const map = new Map();
    const fileExtensions = ['.ts', '.scss', '.html'];
    root.visit((path, entry) => {
        if (fileExtensions.includes(core.extname(path)) && entry) {
            map.set(core.basename(path), entry);
        }
    });
    return map;
}
function highlight(code, language) {
    if (language) {
        // highlight.js expects "typescript" written out, while Github supports "ts".
        const lang = language.toLowerCase() === 'ts' ? 'typescript' : language;
        return hljs.highlight(lang, code).value;
    }
    return code;
}
// @TODO: Blocked by https://github.com/sbb-design-systems/sbb-angular/issues/147
async function buildApiDocumentationForLibrary(packageNames) {
    const execRootPath = process.cwd();
    const packagePath = path.join(execRootPath, 'projects/sbb-esta');
    const outputDirPath = path.join(execRootPath, `projects/angular-showcase/src/assets/docs/api`);
    // Configure the Dgeni docs package to respect our passed options from the Bazel rule.
    apiDocsPackage.config(function (readTypeScriptModules, tsParser, templateFinder, writeFilesProcessor, readFilesProcessor) {
        // Set the base path for the "readFilesProcessor" to the execroot. This is necessary because
        // otherwise the "writeFilesProcessor" is not able to write to the specified output path.
        readFilesProcessor.basePath = execRootPath;
        // Set the base path for parsing the TypeScript source files to the directory that includes
        // all sources (also known as the path to the current Bazel target). This makes it easier for
        // custom processors (such as the `entry-point-grouper) to compute entry-point paths.
        readTypeScriptModules.basePath = packagePath;
        // Initialize the "tsParser" path mappings. These will be passed to the TypeScript program
        // and therefore use the same syntax as the "paths" option in a tsconfig.
        tsParser.options.paths = {};
        // For each package we want to setup all entry points in Dgeni so that their API
        // will be generated. Packages and their associated entry points are passed in pairs.
        // The first argument will be always the package name, and the second argument will be a
        // joined string containing names of all entry points for that specific package.
        // e.g. "cdk" "platform,bidi,a11y"
        for (const packageName of packageNames) {
            const sourceDirectory = path.resolve(__dirname, `../../projects/sbb-esta/${packageName}`);
            const entryPoints = fs.readdirSync(sourceDirectory, { withFileTypes: true })
                .filter(d => d.isDirectory() && d.name !== 'svg-icons' && d.name !== 'styles')
                .map(d => d.name);
            // Walk through each entry point of the current package and add it to the
            // "readTypeScriptModules" processor so that it will parse it. Additionally we want
            // to setup path mapping for that entry-point, so that we are able to merge
            // inherited class members across entry points or packages.
            entryPoints.forEach(entryPointName => {
                const entryPointPath = `${packageName}/${entryPointName}`;
                const entryPointIndexPath = `${entryPointPath}/index.ts`;
                // tslint:disable-next-line: no-non-null-assertion
                tsParser.options.paths[`@sbb-esta/${entryPointPath}`] = [entryPointIndexPath];
                readTypeScriptModules.sourceFiles.push(entryPointIndexPath);
            });
        }
        // Base URL for the `tsParser`. The base URL refer to the directory that includes all
        // package sources that need to be processed by Dgeni.
        tsParser.options.baseUrl = packagePath;
        // This is ensures that the Dgeni TypeScript processor is able to parse node modules such
        // as the Angular packages which might be needed for doc items. e.g. if a class implements
        // the "AfterViewInit" interface from "@angular/core". This needs to be relative to the
        // "baseUrl" that has been specified for the "tsParser" compiler options.
        // tslint:disable-next-line: no-non-null-assertion
        tsParser.options.paths['*'] = [path.relative(packagePath, path.join(execRootPath, 'node_modules/*'))];
        // Since our base directory is the Bazel execroot, we need to make sure that Dgeni can
        // find all templates needed to output the API docs.
        templateFinder.templateFolders = [
            path.join(execRootPath, 'schematics/documentation/dgeni/templates/')
        ];
        // The output path for files will be computed by joining the output folder with the base path
        // from the "readFilesProcessors". Since the base path is the execroot, we can just use
        // the output path passed from Bazel (e.g. $EXECROOT/bazel-out/bin/src/docs-content)
        writeFilesProcessor.outputFolder = outputDirPath;
    });
    const docs = new dgeni.Dgeni([apiDocsPackage]);
    await docs.generate().catch((e) => {
        console.error(e);
        process.exit(1);
    });
}

exports.documentation = documentation;
