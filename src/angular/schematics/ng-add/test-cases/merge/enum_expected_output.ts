import { Injectable } from '@angular/core';
import { FileTypeCategory } from '@sbb-esta/angular/file-selector';
import { SbbNotificationType } from '@sbb-esta/angular/notification';

@Injectable()
export class Test {
  test() {
    const test1: FileTypeCategory = 'doc';
    const test2 = ['audio', 'video'];
    const test3 = this.forward('pdf');
    const test4 = { test: 'zip' };
    const test5: SbbNotificationType = 'success';
  }

  forward<T>(value: T) {
    return value;
  }
}