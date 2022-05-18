import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterContentInit, Component, isDevMode, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Breakpoints } from '@sbb-esta/angular/core';
import { SbbIconRegistry } from '@sbb-esta/angular/icon';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { ROUTER_ANIMATION } from './shared/animations';
import { PACKAGES } from './shared/meta';
import { VariantSwitch } from './variant-switch';
// @ts-ignore versions.ts is generated automatically by bazel
import { angularVersion, libraryVersion } from './versions';

// TODO: To be removed, when experimental is "stable"
const DEV_PACKAGES = Object.entries(PACKAGES)
  .filter(([key, _value]) => key !== 'angular-experimental')
  .reduce((current, [key, value]) => Object.assign(current, { [key]: value }), {});

declare global {
  interface Window {
    LEGACY_VERSIONS?: string;
  }
}

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
  sbbVariant: FormControl = this._variantSwitch.sbbVariant;
  packages = isDevMode() ? PACKAGES : DEV_PACKAGES;
  previousMajorVersions: number[] =
    window.LEGACY_VERSIONS?.split(/[ ,]+/).map(Number).filter(Number.isInteger).sort() ?? [];
  private _destroyed = new Subject<void>();

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _variantSwitch: VariantSwitch,
    iconRegistry: SbbIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIconResolver((name, namespace) => {
      if (namespace === 'showcase') {
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
