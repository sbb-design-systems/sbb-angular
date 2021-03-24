import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Breakpoints, ɵvariant } from '@sbb-esta/angular/core';
import { fromEvent, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';

import { ROUTER_ANIMATION } from './shared/animations';
import { PACKAGES } from './shared/meta';
// @ts-ignore versions.ts is generated automatically by bazel
import { angularVersion, libraryVersion } from './versions';

const variantLocalstorageKey = 'sbbAngularVariant';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ROUTER_ANIMATION],
})
export class AppComponent implements AfterContentInit, OnDestroy {
  angularVersion = angularVersion;
  showcaseVersion = libraryVersion;
  expanded: boolean = true;
  sbbVariant: FormControl = new FormControl(
    localStorage.getItem(variantLocalstorageKey) || 'standard'
  );
  packages = PACKAGES;
  private _destroyed = new Subject();

  constructor(private _breakpointObserver: BreakpointObserver) {
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
  ngAfterContentInit(): void {
    this._breakpointObserver
      .observe([Breakpoints.Mobile, Breakpoints.Tablet, Breakpoints.Desktop])
      .pipe(
        map((r) => r.matches),
        distinctUntilChanged(),
        takeUntil(this._destroyed)
      )
      .subscribe((shouldCollapse) => {
        this.expanded = !shouldCollapse;
      });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
