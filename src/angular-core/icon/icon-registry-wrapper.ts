import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SbbIconRegistry } from './icon-registry';

@Injectable()
export class SbbIconRegistryWrapper extends SbbIconRegistry {
  constructor(
    @Optional() @SkipSelf() private _registry: SbbIconRegistry,
    @Optional() httpClient: HttpClient,
    sanitizer: DomSanitizer,
    @Optional() @Inject(DOCUMENT) document: any,
    errorHandler: ErrorHandler
  ) {
    super(httpClient, sanitizer, document, errorHandler);
  }

  /**
   * Returns an Observable that produces the icon (as an `<svg>` DOM element) with the given name
   * and namespace. The icon must have been previously registered with addIcon or addIconSet;
   * if not, the Observable will throw an error. Will first check the nested registry before resolving
   * to icons registered with this registry.
   *
   * @param name Name of the icon to be retrieved.
   * @param namespace Namespace in which to look for the icon.
   */
  getNamedSvgIcon(name: string, namespace: string = ''): Observable<SVGElement> {
    if (!this._registry) {
      return super.getNamedSvgIcon(name, namespace);
    }

    return this._registry
      .getNamedSvgIcon(name, namespace)
      .pipe(
        catchError((err) =>
          super.getNamedSvgIcon(name, namespace).pipe(catchError(() => throwError(err)))
        )
      );
  }
}
