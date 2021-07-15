import { Overlay, OverlayContainer, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { SbbDialogConfig, _SbbDialogBase } from '@sbb-esta/angular/dialog';

import { SbbLightboxConfig } from './lightbox-config';
import { SbbLightboxContainer } from './lightbox-container';
import { SbbLightboxRef } from './lightbox-ref';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const SBB_LIGHTBOX_DATA = new InjectionToken<any>('SbbLightboxData');

/** Injection token that can be used to specify default dialog options. */
export const SBB_LIGHTBOX_DEFAULT_OPTIONS = new InjectionToken<SbbLightboxConfig>(
  'sbb-lightbox-default-options'
);

/** Injection token that determines the scroll handling while the dialog is open. */
export const SBB_LIGHTBOX_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-lightbox-scroll-strategy'
);

/** @docs-private */
export function SBB_LIGHTBOX_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export function SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_LIGHTBOX_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_LIGHTBOX_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

/**
 * Service to open modal lightboxes.
 */
@Injectable()
export class SbbLightbox extends _SbbDialogBase<SbbLightboxContainer, SbbLightboxRef<any>> {
  /** Keeps track of the currently-open lightboxes. */
  get openLightboxes(): SbbLightboxRef<any>[] {
    return this.openDialogs;
  }

  constructor(
    overlay: Overlay,
    injector: Injector,
    @Optional() @Inject(SBB_LIGHTBOX_DEFAULT_OPTIONS) defaultOptions: SbbLightboxConfig,
    @Inject(SBB_LIGHTBOX_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() @SkipSelf() parentDialog: SbbLightbox,
    overlayContainer: OverlayContainer
  ) {
    super(
      overlay,
      injector,
      defaultOptions,
      parentDialog as any,
      overlayContainer,
      scrollStrategy,
      SbbLightboxRef,
      SbbLightboxContainer,
      SBB_LIGHTBOX_DATA
    );
  }

  /**
   * Opens a modal lightbox containing the given template.
   * @param componentOrTemplateRef Component type or TemplateRef to instantiate as the lightbox content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened lightbox.
   */
  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: SbbLightboxConfig<D>
  ): SbbLightboxRef<T, R> {
    const dialogConfig: SbbDialogConfig<D> = {
      ...config,
      width: '100vw',
      minWidth: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      minHeight: '100vh',
      maxHeight: '100vh',
    };
    return super.open(componentOrTemplateRef, dialogConfig) as any;
  }

  /**
   * Finds an open lightbox by its id.
   * @param id ID to use when looking up the lightbox.
   * @alias getLightboxById
   */
  getDialogById(id: string): SbbLightboxRef<any> | undefined {
    return this.openDialogs.find((dialog) => dialog.id === id);
  }

  /**
   * Finds an open lightbox by its id.
   * @param id ID to use when looking up the lightbox.
   */
  getLightboxById(id: string): SbbLightboxRef<any> | undefined {
    return this.getDialogById(id);
  }
}
