import { createBlockScrollStrategy, Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable, InjectionToken, Injector, TemplateRef } from '@angular/core';
import { SbbDialogConfig, _SbbDialogBase } from '@sbb-esta/angular/dialog';

import { SbbLightboxConfig } from './lightbox-config';
import { SbbLightboxContainer } from './lightbox-container';
import { SbbLightboxRef } from './lightbox-ref';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const SBB_LIGHTBOX_DATA = new InjectionToken<any>('SbbLightboxData');

/** Injection token that can be used to specify default dialog options. */
export const SBB_LIGHTBOX_DEFAULT_OPTIONS = new InjectionToken<SbbLightboxConfig>(
  'sbb-lightbox-default-options',
);

/** Injection token that determines the scroll handling while the dialog is open. */
export const SBB_LIGHTBOX_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-lightbox-scroll-strategy',
  {
    providedIn: 'root',
    factory: () => {
      const injector = inject(Injector);
      return () => createBlockScrollStrategy(injector);
    },
  },
);

/**
 * Service to open modal lightboxes.
 */
@Injectable({ providedIn: 'root' })
export class SbbLightbox extends _SbbDialogBase<SbbLightboxContainer, SbbLightboxRef<any>> {
  protected override _idPrefix: string = 'sbb-lightbox-';

  /** Keeps track of the currently-open lightboxes. */
  get openLightboxes(): SbbLightboxRef<any>[] {
    return this.openDialogs;
  }

  constructor(...args: unknown[]);
  constructor() {
    const overlay = inject(Overlay);
    const injector = inject(Injector);
    const defaultOptions = inject<SbbLightboxConfig>(SBB_LIGHTBOX_DEFAULT_OPTIONS, {
      optional: true,
    });
    const scrollStrategy = inject(SBB_LIGHTBOX_SCROLL_STRATEGY);
    const parentDialog = inject(SbbLightbox, { optional: true, skipSelf: true });

    super(
      overlay,
      injector,
      defaultOptions,
      parentDialog,
      scrollStrategy,
      SbbLightboxRef,
      SbbLightboxContainer,
      SBB_LIGHTBOX_DATA,
    );
  }

  /**
   * Opens a modal lightbox containing the given template.
   * @param componentOrTemplateRef Component type or TemplateRef to instantiate as the lightbox content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened lightbox.
   */
  override open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: SbbLightboxConfig<D>,
  ): SbbLightboxRef<T, R> {
    const dialogConfig: SbbDialogConfig<D> = {
      ...config,
      width: '100vw',
      minWidth: '100vw',
      maxWidth: '100vw',
      height: '100vh',
      minHeight: 'auto',
      maxHeight: 'none',
    };
    dialogConfig.id = dialogConfig.id || this._idGenerator.getId(this._idPrefix);
    return super.open(componentOrTemplateRef, dialogConfig) as any;
  }

  /**
   * Finds an open lightbox by its id.
   * @param id ID to use when looking up the lightbox.
   * @alias getLightboxById
   */
  override getDialogById(id: string): SbbLightboxRef<any> | undefined {
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
