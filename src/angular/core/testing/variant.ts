import { ComponentFixture } from '@angular/core/testing';
import { ɵvariant } from '@sbb-esta/angular/core';

declare function beforeEach(action: () => void): void;
declare function afterEach(action: () => void): void;

export function switchToLean(fixture?: ComponentFixture<any>) {
  beforeEach(() => {
    document.documentElement.classList.add('sbb-lean');
    ɵvariant.next('lean');
    if (fixture) {
      fixture.detectChanges();
    }
  });

  afterEach(() => {
    document.documentElement.classList.remove('sbb-lean');
    ɵvariant.next('standard');
    if (fixture) {
      fixture.detectChanges();
    }
  });
}
