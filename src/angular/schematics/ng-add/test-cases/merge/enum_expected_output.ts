import { Injectable } from '@angular/core';
import { FileTypeCategory } from '@sbb-esta/angular/file-selector';

@Injectable()
export class Test {
  test() {
    const test1: FileTypeCategory = 'doc';
    const test2 = ['audio', 'video'];
    const test3 = this.forward('pdf');
    const test4 = { test: 'zip' };
  }

  forward<T>(value: T) {
    return value;
  }
}