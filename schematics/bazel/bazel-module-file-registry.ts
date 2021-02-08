import { PathFragment } from '@angular-devkit/core';
import { DirEntry, FileEntry } from '@angular-devkit/schematics';

export class BazelModuleFileRegistry {
  readonly markdownFiles: FileEntry[] = [];
  readonly tsFiles: FileEntry[] = [];
  readonly htmlFiles: FileEntry[] = [];
  readonly specFiles: FileEntry[] = [];
  readonly scssFiles: FileEntry[] = [];
  readonly scssLibaryFiles: FileEntry[] = [];
  readonly cssFiles: FileEntry[] = [];

  add(file: PathFragment, dir: DirEntry) {
    if (file.endsWith('.spec.ts')) {
      this.specFiles.push(dir.file(file)!);
    } else if (file.endsWith('.ts')) {
      this.tsFiles.push(dir.file(file)!);
    } else if (file.endsWith('.md')) {
      this.markdownFiles.push(dir.file(file)!);
    } else if (file.endsWith('.html')) {
      this.htmlFiles.push(dir.file(file)!);
    } else if (file.endsWith('.scss') && file.startsWith('_')) {
      this.scssLibaryFiles.push(dir.file(file)!);
    } else if (file.endsWith('.scss')) {
      this.scssFiles.push(dir.file(file)!);
    } else if (file.endsWith('.css')) {
      this.cssFiles.push(dir.file(file)!);
    }
  }
}
