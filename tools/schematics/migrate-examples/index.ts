import { basename, join, Path, relative } from '@angular-devkit/core';
import {
  FileEntry,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
} from '@angular-devkit/schematics';
import { RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { readFileSync, unlinkSync } from 'fs';
import { Configuration, Linter } from 'tslint';

const prettier: {
  format: (source: string, options: { parser: string }) => string;
} = require('prettier');

function lintFix(content: string): string {
  const linter = new Linter({
    fix: true,
  });
  const configuration = Configuration.findConfiguration('tslint.json').results;
  const tempFileName = '.tempfile';
  linter.lint(tempFileName, content, configuration);
  content = readFileSync(tempFileName, 'utf8');
  unlinkSync(tempFileName);
  return content;
}

export function migrateExamples(options: { module: string }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!options.module) {
      throw new SchematicsException('--module [module] is required!');
    } else if (options.module.match(/-examples$/)) {
      options.module = options.module.replace(/-examples$/, '');
      context.logger.warn(`Normalized ${options.module}-examples to ${options.module}`);
    }

    const publicExamplesDir = tree.getDir(
      `src/showcase/app/public/public-examples/${options.module}-examples`
    );
    const businessExamplesDir = tree.getDir(
      `src/showcase/app/business/business-examples/${options.module}-examples`
    );
    if (!publicExamplesDir.subfiles.length && !businessExamplesDir.subfiles.length) {
      context.logger.warn(`No examples found for ${options.module}`);
      return;
    }

    const targetDir = tree.getDir(`src/components-examples/angular/${options.module}`);
    if (targetDir.subfiles.length) {
      context.logger.warn(`${options.module} is already migrated`);
      return;
    }

    let order = 0;
    tree.create(join(targetDir.path, 'BUILD.bazel'), '');
    [publicExamplesDir, businessExamplesDir].forEach((exampleDir) => {
      exampleDir.visit((path, entry) => {
        if (path.endsWith('BUILD.bazel')) {
          // Do not copy BUILD.bazel. It will be generated after this migration.
        } else if (path.endsWith('.module.ts')) {
          migrateModuleDeclaration(entry!);
        } else {
          migrateExampleFile(entry!, exampleDir.path);
        }
      });
    });
    context.addTask(new RunSchematicTask('bazel', { filter: 'components-examples' }));

    function migrateModuleDeclaration(entry: FileEntry) {
      let content = entry!.content
        .toString()
        .replace(/  providers: \[provideExamples\('[^']+', '[^']+', EXAMPLE_INDEX\)\],\n/, '')
        .replace(
          /\nimport \{ provideExamples \} from '..\/..\/..\/shared\/example-provider';\n/,
          ''
        )
        .replace(/const EXAMPLE_INDEX = \{[^\}]+\};\n/, '')
        .replace(/-example\//g, '/')
        .replace(/.component'/g, `'`)
        .replace(/ExampleComponent/g, 'Example')
        .replace(
          new RegExp(`angular-(business|public)\\/${options.module}`, 'g'),
          `angular/${options.module}`
        );

      const exportDeclaration = `export {${
        content.match(/const EXAMPLES = \[(.*)\];\n/s)![1]
      }};\n\n`;
      const exportDeclarationInserPosition = content.indexOf('const EXAMPLES');
      content =
        content.slice(0, exportDeclarationInserPosition) +
        exportDeclaration +
        content.slice(exportDeclarationInserPosition);

      content = prettier.format(lintFix(content), {
        parser: 'typescript',
        ...require('../../../package.json').prettier,
      });
      const indexPath = join(targetDir.path, 'index.ts');
      if (tree.exists(indexPath)) {
        context.logger.warn(
          `${basename(indexPath)} already exists (probably from public). Manual merge of ${basename(
            entry.path
          )} required.`
        );
      } else {
        tree.create(join(targetDir.path, 'index.ts'), content);
      }
    }

    function migrateExampleFile(entry: FileEntry, root: Path) {
      const adaptedPath = relative(root, entry.path)
        .replace(/-example\//, '/')
        .replace('.component', '')
        .replace('.scss', '.css');
      const targetPath = join(targetDir.path, adaptedPath);
      if (entry.path.endsWith('.scss')) {
        context.logger.warn(
          `Changed ${entry.path} to ${targetPath}, since examples don't support scss`
        );
      }

      let content = entry.content
        .toString()
        .replace(/.component./g, '.')
        .replace(/ExampleComponent/g, 'Example');
      if (entry.path.endsWith('.ts')) {
        const title = basename(targetPath)
          .replace(/-example.ts$/, '')
          .replace(/(^\w|-\w)/g, (m) => m.replace('-', ' ').toUpperCase());
        content = content
          .replace(
            '@Component',
            `/**\n * @title ${title}\n * @order ${++order * 10}\n */\n@Component`
          )
          .replace(
            new RegExp(`angular-(business|public)\\/${options.module}`, 'g'),
            `angular/${options.module}`
          );
        content = prettier.format(content, {
          parser: 'typescript',
          ...require('../../../package.json').prettier,
        });
      }
      if (tree.exists(targetPath)) {
        context.logger.warn(
          `${targetPath} already exists (probably from public). Manual check of ${entry.path} recommended.`
        );
      } else {
        tree.create(targetPath, content);
      }
    }
  };
}
