import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ɵvariant } from '@sbb-esta/angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, startWith, takeUntil } from 'rxjs/operators';

const variantLocalstorageKey = 'sbbAngularVariant';

@Injectable({ providedIn: 'root' })
export class VariantSwitch implements CanActivate, OnDestroy {
  sbbVariant: FormControl = new FormControl(
    localStorage.getItem(variantLocalstorageKey) || 'standard'
  );
  private _destroyed = new Subject<void>();

  constructor(private _router: Router, @Inject(DOCUMENT) document: Document) {
    // listen to ctrl + shift + V to toggle variant
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter((value) => value.ctrlKey && value.shiftKey && value.key === 'V'),
        takeUntil(this._destroyed)
      )
      .subscribe(() =>
        this.sbbVariant.setValue(this.sbbVariant.value === 'standard' ? 'lean' : 'standard')
      );

    this.sbbVariant.valueChanges
      .pipe(startWith(this.sbbVariant.value), takeUntil(this._destroyed))
      .subscribe((value) => {
        if (value === 'standard') {
          document.documentElement.classList.remove('sbb-lean');
        } else {
          document.documentElement.classList.add(`sbb-lean`);
        }
        ɵvariant.next(value);
        localStorage.setItem(variantLocalstorageKey, value);
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /**
   * Reads the query parameter for variant, updates the current variant if necessary
   * and removes the query parameter from the url
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!route.queryParamMap.has('variant')) {
      return true;
    }

    const variant = route.queryParamMap.get('variant');
    if (this.sbbVariant.value !== variant) {
      this.sbbVariant.setValue(variant);
    }

    const urlTree = this._router.parseUrl(state.url);
    delete urlTree.queryParams.variant;

    return urlTree;
  }
}
