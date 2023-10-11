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
import { SbbVariant, ɵvariant } from '@sbb-esta/angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

const variantLocalstorageKey = 'sbbAngularVariant';

type SbbVariantLightDark = SbbVariant | 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class VariantSwitch implements CanActivate, OnDestroy {
  sbbVariant: FormControl<SbbVariantLightDark> = new FormControl(
    (localStorage.getItem(variantLocalstorageKey) as SbbVariantLightDark) || 'standard',
  );
  private _destroyed = new Subject<void>();

  constructor(
    private _router: Router,
    @Inject(DOCUMENT) document: Document,
  ) {
    // listen to ctrl + shift + V to toggle variant
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        filter((value) => value.ctrlKey && value.shiftKey && value.key === 'V'),
        takeUntil(this._destroyed),
        map(
          () =>
            ({
              standard: 'lean',
              lean: 'light',
              light: 'dark',
              dark: 'standard',
            })[this.sbbVariant.value] as SbbVariantLightDark,
        ),
      )
      .subscribe((newVariant) => this.sbbVariant.setValue(newVariant));

    this.sbbVariant.valueChanges
      .pipe(startWith(this.sbbVariant.value), takeUntil(this._destroyed))
      .subscribe((value) => {
        // switch between lean and standard variant
        if (value === 'standard') {
          document.documentElement.classList.remove('sbb-lean');
        } else {
          document.documentElement.classList.add(`sbb-lean`);
        }
        ɵvariant.next(value === 'standard' ? 'lean' : 'standard');
        localStorage.setItem(variantLocalstorageKey, value);

        // switch between light and dark mode
        document.documentElement.classList.remove('sbb-dark');
        document.documentElement.classList.remove('sbb-light');
        if (value === 'light') {
          document.documentElement.classList.add('sbb-light');
        } else if (value === 'dark') {
          document.documentElement.classList.add('sbb-dark');
        }
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
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!route.queryParamMap.has('variant')) {
      return true;
    }

    const variant = route.queryParamMap.get('variant') as SbbVariant;
    if (this.sbbVariant.value !== variant) {
      this.sbbVariant.setValue(variant);
    }

    const urlTree = this._router.parseUrl(state.url);
    delete urlTree.queryParams.variant;

    return urlTree;
  }
}
