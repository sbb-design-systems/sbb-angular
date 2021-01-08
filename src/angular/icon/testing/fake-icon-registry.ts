import { Injectable, NgModule, OnDestroy } from '@angular/core';
import { SbbIconRegistry } from '@sbb-esta/angular/icon';
import { Observable, of as observableOf } from 'rxjs';

// tslint:disable:no-any Impossible to tell param types.
type PublicApi<T> = {
  [K in keyof T]: T[K] extends (...x: any[]) => T ? (...x: any[]) => PublicApi<T> : T[K];
};
// tslint:enable:no-any

/**
 * A null icon registry that must be imported to allow disabling of custom
 * icons.
 */
@Injectable()
export class FakeSbbIconRegistry implements PublicApi<SbbIconRegistry>, OnDestroy {
  addSvgIcon(): this {
    return this;
  }

  addSvgIconLiteral(): this {
    return this;
  }

  addSvgIconInNamespace(): this {
    return this;
  }

  addSvgIconLiteralInNamespace(): this {
    return this;
  }

  addSvgIconSet(): this {
    return this;
  }

  addSvgIconSetLiteral(): this {
    return this;
  }

  addSvgIconSetInNamespace(): this {
    return this;
  }

  addSvgIconSetLiteralInNamespace(): this {
    return this;
  }

  registerFontClassAlias(): this {
    return this;
  }

  classNameForFontAlias(alias: string): string {
    return alias;
  }

  getDefaultFontSetClass() {
    return 'sbb-icons';
  }

  getSvgIconFromUrl(): Observable<SVGElement> {
    return observableOf(this._generateEmptySvg());
  }

  getNamedSvgIcon(): Observable<SVGElement> {
    return observableOf(this._generateEmptySvg());
  }

  setDefaultFontSetClass(): this {
    return this;
  }

  hasNamespaceSvgIcon(): boolean {
    return true;
  }

  ngOnDestroy() {}

  private _generateEmptySvg(): SVGElement {
    const emptySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    emptySvg.classList.add('fake-testing-svg');
    // Emulate real icon characteristics from `SbbIconRegistry` so size remains consistent in tests.
    emptySvg.setAttribute('fit', '');
    emptySvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    emptySvg.setAttribute('focusable', 'false');
    return emptySvg;
  }
}

/** Import this module in tests to install the null icon registry. */
@NgModule({
  providers: [{ provide: SbbIconRegistry, useClass: FakeSbbIconRegistry }],
})
export class SbbIconTestingModule {}
