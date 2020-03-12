import { Overlay, OverlayConfig, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import {
  ComponentPortal,
  ComponentType,
  PortalInjector,
  TemplatePortal
} from '@angular/cdk/portal';
import { Location } from '@angular/common';
import {
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  TemplateRef
} from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { DialogContainerComponent } from '../dialog-container/dialog-container.component';

import { DialogConfig } from './dialog-config';
import { DialogRef } from './dialog-ref';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const DIALOG_DATA = new InjectionToken<any>('DialogData');

/** Injection token that can be used to specify default dialog options. */
export const DIALOG_DEFAULT_OPTIONS = new InjectionToken<DialogConfig>('DialogDefaultOptions');

/** Injection token that determines the scroll handling while the dialog is open. */
export const DIALOG_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'DialogScrollStrategy'
);

/** @docs-private */
export function SBB_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY
};

/**
 * Service to open SBB Design modal dialogs.
 */
@Injectable()
export class Dialog implements OnDestroy {
  private _openDialogsAtThisLevel: DialogRef<any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<DialogRef<any>>();

  /** Keeps track of the currently-open dialogs. */
  get openDialogs(): DialogRef<any>[] {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }

  /** Stream that emits when a dialog has been opened. */
  get afterOpen(): Subject<DialogRef<any>> {
    return this._parentDialog ? this._parentDialog.afterOpen : this._afterOpenedAtThisLevel;
  }

  get _afterAllClosed(): Subject<void> {
    const parent = this._parentDialog;
    return parent ? parent._afterAllClosed : this._afterAllClosedAtThisLevel;
  }

  /**
   * Stream that emits when all open dialog have finished closing.
   * Will emit on subscribe if there are no open dialogs to begin with.
   */
  readonly afterAllClosed: Observable<any> = defer<any>(() =>
    this.openDialogs.length
      ? this._afterAllClosed
      : this._afterAllClosed.pipe(startWith(undefined as unknown))
  );

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    @Optional() private _location: Location,
    @Optional() @Inject(DIALOG_DEFAULT_OPTIONS) private _defaultOptions,
    @Inject(DIALOG_SCROLL_STRATEGY) private _scrollStrategy,
    @Optional() @SkipSelf() private _parentDialog: Dialog
  ) {}

  /**
   * Opens a modal dialog containing the given component.
   * @param componentOrTemplateRef Type of the component to load into the dialog,
   *     or a TemplateRef to instantiate as the dialog content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened dialog.
   * @deprecated use openDialog() instead
   */
  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: DialogConfig<D>
  ): DialogRef<T, R> {
    return this.openDialog(componentOrTemplateRef, config);
  }

  /**
   * Opens a modal dialog containing the given component.
   * @param componentOrTemplateRef Type of the component to load into the dialog,
   *     or a TemplateRef to instantiate as the dialog content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened dialog.
   */
  openDialog<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: DialogConfig<D>
  ): DialogRef<T, R> {
    config = { ...(this._defaultOptions || new DialogConfig()), ...config };
    if (config.id && this.getDialogById(config.id)) {
      throw Error(`dialog with id "${config.id}" exists already. The dialog id must be unique.`);
    }

    const overlayRef = this._createOverlay(config);
    const dialogContainer = this._attachDialogContainer(overlayRef, config);
    const dialogRef = this._attachDialogContent<T, R>(
      componentOrTemplateRef,
      dialogContainer,
      overlayRef,
      config
    );

    this.openDialogs.push(dialogRef);
    dialogRef.afterClosed().subscribe(() => this._removeOpenDialog(dialogRef));
    this.afterOpen.next(dialogRef);

    return dialogRef;
  }

  /**
   * Closes all of the currently-open dialogs.
   */
  closeAll(): void {
    this._closeDialogs(this.openDialogs);
  }

  /**
   * Finds an open dialog by its id.
   * @param id ID to use when looking up the dialog.
   * @returns Dialog reference associated to the input id.
   */
  getDialogById(id: string): DialogRef<any> | undefined {
    return this.openDialogs.find(dialog => dialog.id === id);
  }

  ngOnDestroy() {
    // Only close the dialogs at this level on destroy
    // since the parent service may still be active.
    this._closeDialogs(this._openDialogsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  /**
   * Creates the overlay into which the dialog will be loaded.
   * @param config The dialog configuration.
   * @returns A promise resolving to the OverlayRef for the created overlay.
   */
  private _createOverlay(config: DialogConfig): OverlayRef {
    const overlayConfig = this._getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * Creates an overlay config from a dialog config.
   * @param dialogConfig The dialog configuration.
   * @returns The overlay configuration.
   */
  private _getOverlayConfig(dialogConfig: DialogConfig): OverlayConfig {
    return new OverlayConfig({
      positionStrategy: this._overlay.position().global(),
      scrollStrategy: dialogConfig.scrollStrategy || this._scrollStrategy(),
      panelClass: dialogConfig.panelClass,
      hasBackdrop: true,
      backdropClass: 'sbb-overlay-background',
      minWidth: dialogConfig.minWidth,
      maxWidth: dialogConfig.maxWidth,
      minHeight: dialogConfig.minHeight,
      maxHeight: dialogConfig.maxHeight,
      width: dialogConfig.width,
      height: dialogConfig.height
    });
  }

  /**
   * Attaches an DialogContainer to a dialog's already-created overlay.
   * @param overlay Reference to the dialog's underlying overlay.
   * @param config The dialog configuration.
   * @returns A promise resolving to a ComponentRef for the attached container.
   */
  private _attachDialogContainer(
    overlay: OverlayRef,
    config: DialogConfig
  ): DialogContainerComponent {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;
    const injector = new PortalInjector(
      userInjector || this._injector,
      new WeakMap([[DialogConfig, config]])
    );
    const containerPortal = new ComponentPortal(
      DialogContainerComponent,
      config.viewContainerRef,
      injector
    );
    const containerRef = overlay.attach<DialogContainerComponent>(containerPortal);

    return containerRef.instance;
  }

  /**
   * Attaches the user-provided component to the already-created DialogContainer.
   * @param componentOrTemplateRef The type of component being loaded into the dialog,
   *     or a TemplateRef to instantiate as the content.
   * @param dialogContainer Reference to the wrapping DialogContainer.
   * @param overlayRef Reference to the overlay in which the dialog resides.
   * @param config The dialog configuration.
   * @returns A promise resolving to the DialogRef that should be returned to the user.
   */
  private _attachDialogContent<T, R>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    dialogContainer: DialogContainerComponent,
    overlayRef: OverlayRef,
    config: DialogConfig
  ): DialogRef<T, R> {
    // Create a reference to the dialog we're creating in order to give the user a handle
    // to modify and close it.
    const dialogRef = new DialogRef<T, R>(dialogContainer, config.id, overlayRef, this._location);

    if (componentOrTemplateRef instanceof TemplateRef) {
      dialogContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null, <any>{
          $implicit: config.data,
          dialogRef
        })
      );
    } else {
      const injector = this._createInjector<T>(config, dialogRef, dialogContainer);
      const contentRef = dialogContainer.attachComponentPortal<T>(
        new ComponentPortal(componentOrTemplateRef, undefined, injector)
      );
      dialogRef.componentInstance = contentRef.instance;
    }

    dialogRef.updatePosition(config.position);

    return dialogRef;
  }

  /**
   * Creates a custom injector to be used inside the dialog. This allows a component loaded inside
   * of a dialog to close itself and, optionally, to return a value.
   * @param config Config object that is used to construct the dialog.
   * @param dialogRef Reference to the dialog.
   * @param dialogContainer dialog container element that wraps all of the contents.
   * @returns The custom injector that can be used inside the dialog.
   */
  private _createInjector<T>(
    config: DialogConfig,
    dialogRef: DialogRef<T>,
    dialogContainer: DialogContainerComponent
  ): PortalInjector {
    const userInjector = config && config.viewContainerRef && config.viewContainerRef.injector;

    // The DialogContainer is injected in the portal as the Dialog and the dialog's
    // content are created out of the same ViewContainerRef and as such, are siblings for injector
    // purposes. To allow the hierarchy that is expected, the DialogContainer is explicitly
    // added to the injection tokens.
    const injectionTokens = new WeakMap<any, any>([
      [DialogContainerComponent, dialogContainer],
      [DIALOG_DATA, config.data],
      [DialogRef, dialogRef]
    ]);

    return new PortalInjector(userInjector || this._injector, injectionTokens);
  }

  /**
   * Removes a dialog from the array of open dialogs.
   * @param dialogRef dialog to be removed.
   */
  private _removeOpenDialog(dialogRef: DialogRef<any>) {
    const index = this.openDialogs.indexOf(dialogRef);

    if (index > -1) {
      this.openDialogs.splice(index, 1);

      // emit to the `afterAllClosed` stream.
      if (!this.openDialogs.length) {
        this._afterAllClosed.next();
      }
    }
  }

  /** Closes all of the dialogs in an array. */
  private _closeDialogs(dialogs: DialogRef<any>[]) {
    let i = dialogs.length;

    while (i--) {
      // The `_openDialogs` property isn't updated after close until the rxjs subscription
      // runs on the next microtask, in addition to modifying the array as we're going
      // through it. We loop through all of them and call close without assuming that
      // they'll be removed from the list instantaneously.
      dialogs[i].close();
    }
  }
}
