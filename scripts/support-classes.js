class IconModuleInfo {
    constructor(components, path, name, fileName) {
        this.components = components;
        this.path = path;
        this.name = name;
        this.fileName = fileName;
    }
}

class IconComponentInfo {

    constructor(content, fileName, name, selector, svgTemplate, sourceFileName) {
        this.content = content;
        this.fileName = fileName;
        this.name = name;
        this.selector = selector;
        this.svgTemplate = svgTemplate;
        this.sourceFileName = sourceFileName;
    }
}

module.exports = { 'IconComponentInfo': IconComponentInfo, 'IconModuleInfo': IconModuleInfo };