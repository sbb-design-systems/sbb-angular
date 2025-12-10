// tslint:disable:require-property-typedef
import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, inject, isDevMode, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Breakpoints, VERSION } from '@sbb-esta/angular/core';
import { SbbIconRegistry } from '@sbb-esta/angular/icon';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { ROUTER_ANIMATION } from './shared/animations';
import { PACKAGES } from './shared/meta';
import { VariantSwitch } from './variant-switch';

// TODO: To be removed, when experimental is "stable"
const DEV_PACKAGES = Object.entries(PACKAGES)
  .filter(([key, _value]) => key !== 'angular-experimental')
  .reduce((current, [key, value]) => Object.assign(current, { [key]: value }), {});

declare global {
  interface Window {
    LEGACY_VERSIONS?: string;
    ENVIRONMENT_BANNER_TEXT?: string;
  }
}

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ROUTER_ANIMATION],
  standalone: false,
})
export class AppComponent implements AfterContentInit, OnDestroy {
  private _breakpointObserver = inject(BreakpointObserver);
  private _variantSwitch = inject(VariantSwitch);

  angularVersion = VERSION.full.match(/(\d+)/)![1];
  docsVersion = VERSION.full.match(/(\d+\.\d+\.\d+(?:[^\+]*))/)![1];
  expanded: boolean = true;
  sbbVariant = this._variantSwitch.sbbVariant;
  packages = isDevMode() ? PACKAGES : DEV_PACKAGES;
  previousMajorVersions: number[] =
    window.LEGACY_VERSIONS?.split(/[ ,]+/).map(Number).filter(Number.isInteger).sort() ?? [];
  environmentBannerText = window.ENVIRONMENT_BANNER_TEXT;
  private _destroyed = new Subject<void>();

  constructor() {
    const iconRegistry = inject(SbbIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIconResolver((name, namespace) => {
      if (namespace === 'docs') {
        return sanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${name}.svg`);
      }
      return null;
    });
  }
  ngAfterContentInit(): void {
    this._breakpointObserver
      .observe([Breakpoints.Mobile, Breakpoints.Tablet, Breakpoints.Desktop])
      .pipe(
        map((r) => r.matches),
        distinctUntilChanged(),
        takeUntil(this._destroyed),
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
