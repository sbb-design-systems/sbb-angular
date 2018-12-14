import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import {
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  PortalInjector,
  TemplatePortal } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { LightboxConfig } from './lightbox-config';
import { LightboxContainerComponent } from './lightbox-container.component';
import { LightboxRef } from './lightbox-ref';


/** Injection token that can be used to access the data that was passed in to a lightbox. */
export const LIGHTBOX_DATA = new InjectionToken<any>('LightboxData');

/** Injection token that can be used to specify default lightbox options. */
export const LIGHTBOX_DEFAULT_OPTIONS =
  new InjectionToken<LightboxConfig>('LightboxDefaultOptions');

/**
 * Service to open SBB Design modal lightboxes.
 */
@Injectable({
  providedIn: 'root',
})
export class Lightbox {
  private _openLightboxesAtThisLevel: LightboxRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenAtThisLevel = new Subject<LightboxRef<any>>();
  private _ariaHiddenElements = new Map<Element, string | null>();

  /** Keeps track of the currently-open lightboxes. */
  get openLightboxes(): LightboxRef<any>[] {
    return this._parentLightbox ? this._parentLightbox.openLightboxes : this._openLightboxesAtThisLevel;
  }

  /** Stream that emits when a lightbox has been opened. */
  get afterOpen(): Subject<LightboxRef<any>> {
    return this._parentLightbox ? this._parentLightbox.afterOpen : this._afterOpenAtThisLevel;
  }

  get _afterAllClosed() {
    const parent = this._parentLightbox;
    return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
  }

  /**
   * Stream that emits when all open lightbox have finished closing.
   * Will emit on subscribe if there are no open lightboxes to begin with.
   */
  readonly afterAllClosed: Observable<void> = defer<void>(() => this.openLightboxes.length ?
    this._afterAllClosed :
    this._afterAllClosed.pipe(startWith(undefined)));

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    @Optional() private _location: Location,
    @Optional() @Inject(LIGHTBOX_DEFAULT_OPTIONS) private _defaultOptions,
    @Optional() @SkipSelf() private _parentLightbox: Lightbox) { }

  /**
   * Opens a modal lightbox containing the given component.
   * @param componentOrTemplateRef Type of the component to load into the lightbox,
   *     or a TemplateRef to instantiate as the lightbox content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened lightbox.
   */
  open<T, D = any, R = any>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: LightboxConfig<D>): LightboxRef<T, R> {

    config = _applyConfigDefaults(config, this._defaultOptions || new LightboxConfig());

    if (config.id && this.getLightboxById(config.id)) {
      throw Error(`lightbox with id "${config.id}" exists already. The lightbox id must be unique.`);
    }

    const overlayRef = this._createOverlay(config);
    const lightboxContainer = this._attachLightboxContainer(overlayRef, config);
    const lightboxRef = this._attachLightboxContent<T, R>(componentOrTemplateRef,
      lightboxContainer,
      overlayRef,
      config);

    this.openLightboxes.push(lightboxRef);
    lightboxRef.afterClosed().subscribe(() => this._removeOpenLightbox(lightboxRef));
    this.afterOpen.next(lightboxRef);

    return lightboxRef;
  }

  /**
   * Closes all of the currently-open lightboxes.
   */
  closeAll(): void {
    let i = this.openLightboxes.length;

    while (i--) {
      // The `openLightboxes` property isn't updated after close until the rxjs subscription
      // runs on the next microtask, in addition to modifying the array as we're going
      // through it. We loop through all of them and call close without assuming that
      // they'll be removed from the list instantaneously.
      this.openLightboxes[i].close();
    }
  }

  /**
   * Finds an open lightbox by its id.
   * @param id ID to use when looking up the lightbox.
   */
  getLightboxById(id: string): LightboxRef<any> | undefined {
    return this.openLightboxes.find(lightbox => lightbox.id === id);
  }

  /**
   * Creates the overlay into which the lightbox will be loaded.
   * @param config The lightbox configuration.
   * @returns A promise resolving to the OverlayRef for the created overlay.
   */
  private _createOverlay(config: LightboxConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an overlay config from a lightbox config.
   * @param lightboxConfig The lightbox configuration.
   * @returns The overlay configuration.
   */
  private _getOverlayConfig(lightboxConfig: LightboxConfig): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      panelClass: lightboxConfig.panelClass,
      minWidth: lightboxConfig.minWidth,
      minHeight: lightboxConfig.minHeight,
      maxWidth: lightboxConfig.maxWidth,
      maxHeight: lightboxConfig.maxHeight
    });

    return state;
  }

  /**
   * Attaches an LightboxContainer to a lightbox's already-created overlay.
   * @param overlay Reference to the lightbox's underlying overlay.
   * @param config The lightbox configuration.
   * @returns A promise resolving to a ComponentRef for the attached container.
   */
  private _attachLightboxContainer(overlay: OverlayRef, config: LightboxConfig): LightboxContainerComponent {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = new PortalInjector(userInjector || this._injector, new WeakMap([
      [LightboxConfig, config]
    ]));
    const containerPortal = new ComponentPortal(LightboxContainerComponent, config.viewContainerRef, injector);
    const containerRef = overlay.attach<LightboxContainerComponent>(containerPortal);

    return containerRef.instance;
  }

  /**
   * Attaches the user-provided component to the already-created LightboxContainer.
   * @param componentOrTemplateRef The type of component being loaded into the lightbox,
   *     or a TemplateRef to instantiate as the content.
   * @param lightboxContainer Reference to the wrapping LightboxContainer.
   * @param overlayRef Reference to the overlay in which the lightbox resides.
   * @param config The lightbox configuration.
   * @returns A promise resolving to the LightboxRef that should be returned to the user.
   */
  private _attachLightboxContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    lightboxContainer: LightboxContainerComponent,
    overlayRef: OverlayRef,
    config: LightboxConfig): LightboxRef<T, R> {

    // Create a reference to the lightbox we're creating in order to give the user a handle
    // to modify and close it.
    const lightboxRef =
      new LightboxRef<T, R>(overlayRef, lightboxContainer, this._location, config.id);

    if (componentOrTemplateRef instanceof TemplateRef) {
      lightboxContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null,
          <any>{ $implicit: config.data, lightboxRef }));
    } else {
      const injector = this._createInjector<T>(config, lightboxRef, lightboxContainer);
      const contentRef = lightboxContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, undefined, injector));
      lightboxRef.componentInstance = contentRef.instance;
    }

    return lightboxRef;
  }

  /**
   * Creates a custom injector to be used inside the lightbox. This allows a component loaded inside
   * of a lightbox to close itself and, optionally, to return a value.
   * @param config Config object that is used to construct the lightbox.
   * @param lightboxRef Reference to the lightbox.
   * @param container lightbox container element that wraps all of the contents.
   * @returns The custom injector that can be used inside the lightbox.
   */
  private _createInjector<T>(
    config: LightboxConfig,
    lightboxRef: LightboxRef<T>,
    lightboxContainer: LightboxContainerComponent): PortalInjector {

    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    // The LightboxContainer is injected in the portal as the LightboxContainer and the lightbox's
    // content are created out of the same ViewContainerRef and as such, are siblings for injector
    // purposes. To allow the hierarchy that is expected, the LightboxContainer is explicitly
    // added to the injection tokens.
    const injectionTokens = new WeakMap<any, any>([
      [LightboxContainerComponent, lightboxContainer],
      [LIGHTBOX_DATA, config.data],
      [LightboxRef, lightboxRef]
    ]);

    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  /**
   * Removes a lightbox from the array of open lightboxes.
   * @param lightboxRef lightbox to be removed.
   */
  private _removeOpenLightbox(lightboxRef: LightboxRef<any>) {
    const index = this.openLightboxes.indexOf(lightboxRef);

    if (index > -1) {
      this.openLightboxes.splice(index, 1);

      // If all the lightboxes were closed, remove/restore the `aria-hidden`
      // to a the siblings and emit to the `afterAllClosed` stream.
      if (!this.openLightboxes.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();
        this._afterAllClosed.next();
      }
    }
  }

}

/**
 * Applies default options to the lightbox config.
 * @param config Config to be modified.
 * @param defaultOptions Default options provided.
 * @returns The new configuration object.
 */
function _applyConfigDefaults(
  config?: LightboxConfig, defaultOptions?: LightboxConfig): LightboxConfig {
  return { ...defaultOptions, ...config };
}
