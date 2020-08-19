#!/usr/bin/env node

import { restoreCache, saveCache } from '@actions/cache';
import { createHash } from 'crypto';
import { existsSync, readdirSync, statSync, unlinkSync } from 'fs';
import minimist from 'minimist';
import { homedir } from 'os';
import { basename, join } from 'path';

/** Bazel cache location (See Remote Disk Caching in .bazelrc) */
const bazelCacheDir = join(homedir(), '.bazel-cache/sbb-angular');

class FileEntry {
  readonly size: number;
  readonly modified: Date;
  readonly name: string;

  constructor(readonly path: string) {
    const stats = statSync(this.path);
    this.size = stats.size;
    this.modified = stats.mtime;
    this.name = basename(this.path);
  }
}

class LRUCache {
  /** Entries sorted by modified descending */
  private _entries: FileEntry[];

  constructor(readonly path: string) {
    this._entries = existsSync(this.path)
      ? readdirSync(this.path, { withFileTypes: true })
          .filter((d) => d.isFile())
          .map((d) => new FileEntry(join(this.path, d.name)))
          .sort((a, b) => b.modified.valueOf() - a.modified.valueOf())
      : [];
  }

  removeOldestExceeding(size: number) {
    let combinedSize = 0;
    let reducedSize = 0;
    let removedAmount = 0;
    this._entries
      .filter((e) => {
        if (combinedSize < size && combinedSize + e.size > size) {
          reducedSize = combinedSize;
        }
        combinedSize += e.size;
        const isExceeding = combinedSize > size;
        if (isExceeding) {
          removedAmount += 1;
        }
        return isExceeding;
      })
      .forEach((e) => this._deleteEntry(e));
    return {
      totalSize: combinedSize,
      reducedSize,
      removedAmount,
    };
  }

  /**
   * Calculates a sha256 has value from all file names.
   */
  calculateHash() {
    const hash = createHash('sha512');
    this._entries.forEach((e) => hash.write(e.name));
    return hash.digest('hex');
  }

  private _deleteEntry(entry: FileEntry) {
    const index = this._entries.indexOf(entry);
    if (index >= 0) {
      this._entries.splice(index, 1);
    }
    unlinkSync(entry.path);
  }
}

if (module === require.main) {
  const options = minimist(process.argv.slice(2));
  const [target, key] = options._;
  const hashKey = (k: string) => `bazel-artifacts-${k}-`;
  if (!target) {
    throw new Error('Target parameter required');
  }

  if (target === 'clean') {
    cleanBazelCache(options.path || bazelCacheDir, options.maxSize);
  } else if (!key) {
    throw new Error(
      'key is required for cache restore or save! (e.g. yarn bazel:cache restore <key>)'
    );
  } else if (target === 'restore') {
    restoreBazelCache(bazelCacheDir, hashKey(key));
  } else if (target === 'save') {
    saveBazelCache(bazelCacheDir, hashKey(key));
  }
}

/**
 * Restores the remote bazel disk cache.
 */
async function restoreBazelCache(path: string, key: string) {
  if (!process.env.GITHUB_SHA) {
    console.log('Restoring cache can only be executed on GitHub. Skipping...');
    return;
  }

  await restoreCache([path], `${key}${process.env.GITHUB_SHA}`, [key]);
}

/**
 * Saves the remote bazel disk cache.
 */
async function saveBazelCache(path: string, key: string) {
  if (!process.env.GITHUB_SHA) {
    console.log('Saving cache can only be executed on GitHub. Skipping...');
    return;
  }

  const cache = new LRUCache(path);

  try {
    await saveCache([path], `${key}${cache.calculateHash()}`);
  } catch {
    // Might happen if nothing changed. GitHub caches are immutable.
  }
}

/**
 * Removes files which exeed the max size. Oldest files are removed first.
 * @param path The path to the disk cache.
 * @param maxSize The max allowed cache size.
 */
function cleanBazelCache(path: string, maxSize = '') {
  const cache = new LRUCache(path);
  const maxSizeInBytes = resolveMaxSize(maxSize);
  const result = cache.removeOldestExceeding(maxSizeInBytes);
  if (result.removedAmount === 0) {
    console.log(
      `Total size of ${path} ${formatBytes(
        result.totalSize
      )} smaller than ${maxSize}. Nothing was removed...`
    );
  } else {
    console.log(
      `Reduced size of ${path} from ${formatBytes(result.totalSize)} to ${formatBytes(
        result.reducedSize
      )}. Removed ${result.removedAmount} files...`
    );
  }
}

function resolveMaxSize(maxSize: string) {
  const [fullMatch, m1, m2] = maxSize.match(/^(\d+)(Bytes|B|KB|MB|GB|TB)?$/i) || [];
  if (!fullMatch) {
    throw new Error('Invalid --maxSize! Expected e.g. 200MB, 1GB');
  }

  const digits = +m1;
  const dimension = m2 ? m2.toUpperCase() : '';
  const dimensionResolution: { [dimension: string]: number } = {
    KB: 1,
    MB: 2,
    GB: 3,
    TB: 4,
  };

  return digits * (2 ** 10) ** (dimensionResolution[dimension] || 0);
}

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
