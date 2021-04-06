import { Injectable } from '@angular/core';
import { FileTypeCategory } from '@sbb-esta/angular-public';

@Injectable()
export class Test {
  test() {
    const test1: FileTypeCategory = FileTypeCategory.DOC;
    const test2 = [FileTypeCategory.AUDIO, FileTypeCategory.VIDEO];
    const test3 = this.forward(FileTypeCategory.PDF);
    const test4 = { test: FileTypeCategory.ZIP };
  }

  forward<T>(value: T) {
    return value;
  }
}