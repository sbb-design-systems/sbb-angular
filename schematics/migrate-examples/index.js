'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@angular-devkit/core');
var schematics = require('@angular-devkit/schematics');
var tasks = require('@angular-devkit/schematics/tasks');

const prettier = require('prettier');
function migrateExamples(options) {
    return (tree, _context) => {
        if (!options.module) {
            throw new schematics.SchematicsException('--module [module] is required!');
        }
        else if (options.module.match(/-examples$/)) {
            options.module = options.module.replace(/-examples$/, '');
            _context.logger.warn(`Normalized ${options.module}-examples to ${options.module}`);
        }
        const publicExamplesDir = tree.getDir(`src/showcase/app/public/public-examples/${options.module}-examples`);
        const businessExamplesDir = tree.getDir(`src/showcase/app/business/business-examples/${options.module}-examples`);
        if (!publicExamplesDir.subfiles.length && !businessExamplesDir.subfiles.length) {
            _context.logger.warn(`No examples found for ${options.module}`);
            return;
        }
        const targetDir = tree.getDir(`src/components-examples/angular/${options.module}`);
        if (targetDir.subfiles.length) {
            _context.logger.warn(`${options.module} is already migrated`);
            return;
        }
        let order = 0;
        tree.create(core.join(targetDir.path, 'BUILD.bazel'), '');
        [publicExamplesDir, businessExamplesDir].forEach((exampleDir) => {
            exampleDir.visit((path, entry) => {
                if (path.endsWith('BUILD.bazel')) ;
                else if (path.endsWith('.module.ts')) {
                    migrateModuleDeclaration(entry);
                }
                else {
                    migrateExampleFile(entry, exampleDir.path);
                }
            });
        });
        _context.addTask(new tasks.RunSchematicTask('bazel', { filter: 'components-examples' }));
        function migrateModuleDeclaration(entry) {
            let content = entry.content
                .toString()
                .replace(/  providers: \[provideExamples\('[^']+', '[^']+', EXAMPLE_INDEX\)\],\n/, '')
                .replace(/\nimport \{ provideExamples \} from '..\/..\/..\/shared\/example-provider';\n/, '')
                .replace(/const EXAMPLE_INDEX = \{[^\}]+\};\n/, '')
                .replace(/-example\//g, '/')
                .replace(/.component'/g, `'`)
                .replace(/ExampleComponent/g, 'Example')
                .replace(new RegExp(`angular-(business|public)\\/${options.module}`, 'g'), `angular/${options.module}`);
            content = prettier.format(content, {
                parser: 'typescript',
                ...require('../../package.json').prettier,
            });
            const indexPath = core.join(targetDir.path, 'index.ts');
            if (tree.exists(indexPath)) {
                _context.logger.warn(`${indexPath} already exists (probably from public). Manual merge of ${entry.path} required.`);
            }
            else {
                tree.create(core.join(targetDir.path, 'index.ts'), content);
            }
        }
        function migrateExampleFile(entry, root) {
            const adaptedPath = core.relative(root, entry.path)
                .replace(/-example\//, '/')
                .replace('.component', '')
                .replace('.scss', '.css');
            const targetPath = core.join(targetDir.path, adaptedPath);
            if (entry.path.endsWith('.scss')) {
                _context.logger.warn(`Changed ${entry.path} to ${targetPath}, since examples don't support scss`);
            }
            let content = entry.content
                .toString()
                .replace(/.component./g, '.')
                .replace(/ExampleComponent/g, 'Example');
            if (entry.path.endsWith('.ts')) {
                const title = core.basename(targetPath)
                    .replace(/-example.ts$/, '')
                    .replace(/(^\w|-\w)/g, (m) => m.replace('-', ' ').toUpperCase());
                content = content
                    .replace('@Component', `/**\n * @title ${title}\n * @order ${++order * 10}\n */\n@Component`)
                    .replace(new RegExp(`angular-(business|public)\\/${options.module}`, 'g'), `angular/${options.module}`);
                content = prettier.format(content, {
                    parser: 'typescript',
                    ...require('../../package.json').prettier,
                });
            }
            if (tree.exists(targetPath)) {
                _context.logger.warn(`${targetPath} already exists (probably from public). Manual check of ${entry.path} recommended.`);
            }
            else {
                tree.create(targetPath, content);
            }
        }
    };
}

exports.migrateExamples = migrateExamples;
