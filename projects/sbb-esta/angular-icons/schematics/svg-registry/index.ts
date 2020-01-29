import { basename, dirname, join, Path, relative, split } from '@angular-devkit/core';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { DirEntry, Rule, Tree } from '@angular-devkit/schematics';

import { Registry } from './registry';
import { Schema } from './schema';

const registryFileName = 'svg-registry.json';

export function svgRegistry(options: Schema): Rule {
  return (tree: Tree): Tree => {
    const svgDir = tree.getDir(options.svgDir);
    const registryPath = join(svgDir.path, registryFileName);
    const registryFileContent = tree.read(registryPath);
    const registry: Registry = registryFileContent
      ? JSON.parse(registryFileContent.toString('utf8'))
      : {};
    findSvgFiles(svgDir)
      .map(f => relative(svgDir.path, f))
      .filter(f => !(f in registry))
      .forEach(file => {
        registry[file] = {
          normalizedName: normalizeName(file, options),
          collections: resolveCollections(file, options)
        };
      });

    const registryAsJson = toSortedJSON(registry);
    if (!registryFileContent) {
      tree.create(registryPath, registryAsJson);
    } else if (registryFileContent.toString('utf8') !== registryAsJson) {
      tree.overwrite(registryPath, registryAsJson);
    }

    return tree;
  };
}

function findSvgFiles(directory: DirEntry) {
  const result: Path[] = [];
  directory.visit(path => {
    if (path.endsWith('.svg')) {
      result.push(path);
    }
  });
  return result;
}

function normalizeName(file: Path, options: Schema): string {
  let filename: string = dasherize(basename(file)).replace(/\.svg$/, '');
  if (options.stripSbbInName) {
    filename = filename.replace(/(^sbb-|-sbb$)/g, '').replace(/-sbb-/g, '-');
  }
  if (options.stripNumberIds) {
    filename = filename.replace(/^\d+-/, '').replace(/-\d+-/g, '-');
  }

  return filename
    .replace(/^-+/, '')
    .replace(/-+/g, '-')
    .replace(/-+$/, '');
}

function resolveCollections(file: Path, options: Schema): string[] {
  const collectionParts = split(dirname(file));
  const collections = options.stripNumberIdInCollection
    ? collectionParts.map(c => c.replace(/^\d+[^a-zA-Z0-9]/, ''))
    : collectionParts;
  return collections.map(c => dasherize(c));
}

function toSortedJSON(registry: Registry) {
  const sortedRegistry = Object.keys(registry)
    .sort()
    .reduce((current, next) => Object.assign(current, { [next]: registry[next] }), {} as Registry);
  return JSON.stringify(sortedRegistry, null, 2);
}
