import { VERSION as CDK_VERSION } from '@angular/cdk';
import { HighContrastModeDetector } from '@angular/cdk/a11y';
import { _isTestEnvironment } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Inject, InjectionToken, NgModule, Optional } from '@angular/core';

import { VERSION } from '../version';

import { _global } from './localize/global';
import { _$localize } from './localize/localize';
import { ɵvariant } from './variant';

/** @docs-private */
export function SBB_SANITY_CHECKS_FACTORY(): SanityChecks {
  return true;
}

/** Injection token that configures whether the SBB sanity checks are enabled. */
export const SBB_SANITY_CHECKS = new InjectionToken<SanityChecks>('sbb-sanity-checks', {
  providedIn: 'root',
  factory: SBB_SANITY_CHECKS_FACTORY,
});

/**
 * Possible sanity checks that can be enabled. If set to
 * true/false, all checks will be enabled/disabled.
 */
export type SanityChecks = boolean | GranularSanityChecks;

/** Object that can be used to configure the sanity checks granularly. */
export interface GranularSanityChecks {
  doctype: boolean;
  typography: boolean;
  version: boolean;
}

/**
 * Module that captures anything that should be loaded and/or run for *all* sbb-angular
 * components. This includes variant, etc.
 *
 * This module should be imported to each top-level component module (e.g. SbbTabsModule).
 */
@NgModule()
export class SbbCommonModule {
  /** Whether we've done the global sanity checks (e.g. a theme is loaded, there is a doctype). */
  private _hasDoneGlobalChecks = false;

  constructor(
    highContrastModeDetector: HighContrastModeDetector,
    @Optional() @Inject(SBB_SANITY_CHECKS) private _sanityChecks: SanityChecks,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    // Check variant configuration at the beginning, as this might cause components
    // to render differently.
    ɵvariant.next(
      this._document.documentElement.classList.contains('sbb-lean') &&
        this._document.documentElement.classList.contains('sbb-dark')
        ? 'lean_dark'
        : this._document.documentElement.classList.contains('sbb-lean')
        ? 'lean'
        : 'standard',
    );

    // While A11yModule also does this, we repeat it here to avoid importing A11yModule
    // in SbbCommonModule.
    highContrastModeDetector._applyBodyHighContrastModeCssClasses();

    patch$localize();

    if (!this._hasDoneGlobalChecks) {
      this._hasDoneGlobalChecks = true;

      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (this._checkIsEnabled('doctype')) {
          _checkDoctypeIsDefined(this._document);
        }

        if (this._checkIsEnabled('typography')) {
          _checkTypographyIsPresent(this._document);
        }

        if (this._checkIsEnabled('version')) {
          _checkCdkVersionMatch();
        }
      }
    }
  }

  /** Gets whether a specific sanity check is enabled. */
  private _checkIsEnabled(name: keyof GranularSanityChecks): boolean {
    if (_isTestEnvironment()) {
      return false;
    }

    if (typeof this._sanityChecks === 'boolean') {
      return this._sanityChecks;
    }

    return !!this._sanityChecks[name];
  }
}

/** Checks that the page has a doctype. */
// tslint:disable-next-line: naming-convention
function _checkDoctypeIsDefined(doc: Document): void {
  if (!doc.doctype) {
    console.warn(
      'Current document does not have a doctype. This may cause ' +
        'some sbb-angular components not to behave as expected.',
    );
  }
}

/** Checks that the typography has been included. */
// tslint:disable-next-line: naming-convention
function _checkTypographyIsPresent(doc: Document): void {
  // We need to assert that the `body` is defined, because these checks run very early
  // and the `body` won't be defined if the consumer put their scripts in the `head`.
  if (!doc.body || typeof getComputedStyle !== 'function') {
    return;
  }

  // The --sbb-scaling-factor variable is available, if our typography is loaded as
  // a majority of variables and rules depend on this variable.
  const missingScalingFactorVariable = !getComputedStyle(doc.documentElement).getPropertyValue(
    '--sbb-scaling-factor',
  );

  if (missingScalingFactorVariable) {
    console.warn(
      'Could not find @sbb-esta/angular typography. Most @sbb-esta/angular ' +
        'components may not work as expected.',
    );
  }
}

/** Checks whether the @sbb-esta/angular version matches the CDK major version. */
// tslint:disable-next-line: naming-convention
function _checkCdkVersionMatch(): void {
  if (VERSION.major !== CDK_VERSION.major) {
    console.warn(
      `The @sbb-esta/angular version (${VERSION.full}) does not match the Angular CDK major version` +
        ` (${CDK_VERSION.full}).\nPlease ensure the major versions of these two packages match.`,
    );
  }
}

/**
 * If an app doesn't use localize, on production environment there is no $localize function.
 * In order to provide our translations we patch the $localize object with the original function.
 */
function patch$localize() {
  // In production mode and if localize is off, $localize is not a function
  if (typeof _global.$localize !== 'function') {
    // Merge $localize function with provided $localize object
    _global.$localize = Object.assign(_$localize, _global.$localize);
  }
}
