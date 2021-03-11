'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var schematics = require('@angular-devkit/schematics');
var tasks = require('@angular-devkit/schematics/tasks');

function mergeMigrate(options) {
    return (tree, context) => {
        if (!options.module) {
            context.logger.error(`Parameter --module [name] is required!`);
            return;
        }
        const businessModuleDirectory = tree.getDir(`src/angular-business/${options.module}`);
        const publicModuleDirectory = tree.getDir(`src/angular-public/${options.module}`);
        const targetDirectory = tree.getDir(`src/angular/${options.module}`);
        if (businessModuleDirectory.subfiles.length) {
            migrateModule(businessModuleDirectory);
        }
        else if (publicModuleDirectory.subfiles.length) {
            migrateModule(publicModuleDirectory);
        }
        else {
            throw new schematics.SchematicsException(`Could not find module ${options.module}`);
        }
        context.addTask(new tasks.RunSchematicTask('bazel', { filter: 'angular' }));
        context.logger.warn(`${options.module} migrated. Manual checks required!`);
        function migrateModule(directory) {
            const flatten = directory.subdirs.length <= 2;
            directory.visit((path, entry) => {
                if (entry) {
                    let relativeTargetPath = core.relative(directory.path, path).replace('.component.', '.');
                    if (flatten) {
                        relativeTargetPath = core.basename(relativeTargetPath);
                    }
                    const targetPath = core.join(targetDirectory.path, relativeTargetPath);
                    if (tree.exists(targetPath)) {
                        context.logger.info(`${targetPath} already exists. Skipping...`);
                    }
                    else {
                        let content = entry.content
                            .toString()
                            .replace(/\.component'/g, `'`)
                            .replace(/\.component"/g, `"`)
                            .replace(/\.component\./g, '.')
                            .replace(/angular-public/g, 'angular')
                            .replace(/angular-business/g, 'angular')
                            .replace(/angular-core\/testing/g, 'angular/core/testing')
                            .replace(/angular-core/g, 'angular')
                            .replace(/\/base\//g, '/')
                            .replace(/@include publicOnly() /g, '/* TODO: Verify change */ html:not(.sbb-lean) & ')
                            .replace(/@include businessOnly() /g, '/* TODO: Verify change */ html.sbb-lean & ');
                        if (flatten) {
                            content = content.replace(/'\.\/[\w\/-]+\//g, `'./`).replace(/\.\.\//g, '.');
                        }
                        tree.create(targetPath, content);
                    }
                }
            });
        }
    };
}

exports.mergeMigrate = mergeMigrate;
