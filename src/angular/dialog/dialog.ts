import { _IdGenerator } from '@angular/cdk/a11y';
import { Dialog, DialogConfig } from '@angular/cdk/dialog';
import {
  createBlockScrollStrategy,
  createGlobalPositionStrategy,
  Overlay,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import {
  ComponentRef,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  OnDestroy,
  TemplateRef,
  Type,
} from '@angular/core';
import { defer, Observable, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { SbbDialogConfig } from './dialog-config';
import { SbbDialogContainer } from './dialog-container';
import { SbbDialogRef } from './dialog-ref';

/** Injection token that can be used to access the data that was passed in to a dialog. */
export const SBB_DIALOG_DATA = new InjectionToken<any>('SbbDialogData');

/** Injection token that can be used to specify default dialog options. */
export const SBB_DIALOG_DEFAULT_OPTIONS = new InjectionToken<SbbDialogConfig>(
  'sbb-dialog-default-options',
);

/** Injection token that determines the scroll handling while the dialog is open. */
export const SBB_DIALOG_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-dialog-scroll-strategy',
  {
    providedIn: 'root',
    factory: () => {
      const injector = inject(Injector);
      return () => createBlockScrollStrategy(injector);
    },
  },
);

/**
 * Base class for dialog services. The base dialog service allows
 * for arbitrary dialog refs and dialog container components.
 */
@Injectable({ providedIn: 'root' })
// tslint:disable-next-line: class-name naming-convention
export abstract class _SbbDialogBase<
  C extends SbbDialogContainer,
  F extends SbbDialogRef<any> = SbbDialogRef<any>,
> implements OnDestroy
{
  private readonly _openDialogsAtThisLevel: F[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<F>();
  private _scrollStrategy: () => ScrollStrategy;
  protected _idGenerator: _IdGenerator = inject(_IdGenerator);
  protected _idPrefix: string = 'sbb-dialog-';
  private _dialog: Dialog;
  private _injector = inject(Injector);
  /** Keeps track of the currently-open dialogs. */
  get openDialogs(): F[] {
    return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
  }

  /** Stream that emits when a dialog has been opened. */
  get afterOpened(): Subject<F> {
    return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
  }

  private _getAfterAllClosed(): Subject<void> {
    const parent = this._parentDialog;
    return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
  }

  // TODO (jelbourn): tighten the typing right-hand side of this expression.
  /**
   * Stream that emits when all open dialog have finished closing.
   * Will emit on subscribe if there are no open dialogs to begin with.
   */
  readonly afterAllClosed: Observable<void> = defer(() =>
    this.openDialogs.length
      ? this._getAfterAllClosed()
      : this._getAfterAllClosed().pipe(startWith(undefined)),
  ) as Observable<any>;

  constructor(
    private _overlay: Overlay,
    injector: Injector,
    private _defaultOptions: SbbDialogConfig | null,
    private _parentDialog: _SbbDialogBase<C, F> | null,
    scrollStrategy: any,
    private _dialogRefConstructor: Type<F>,
    private _dialogContainerType: Type<C>,
    private _dialogDataToken: InjectionToken<any>,
  ) {
    this._scrollStrategy = scrollStrategy;
    this._dialog = injector.get(Dialog);
  }

  /**
   * Opens a modal dialog containing the given template.
   * @param componentOrTemplateRef Component type or TemplateRef to instantiate as the dialog content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened dialog.
   */
  open<T, D = any, R = any>(
    componentOrTemplateRef: ComponentType<T> | TemplateRef<T>,
    config?: SbbDialogConfig<D>,
  ): SbbDialogRef<T, R> {
    let dialogRef: F;
    config = { ...(this._defaultOptions || new SbbDialogConfig()), ...config };
    config.id = config.id || this._idGenerator.getId(this._idPrefix);
    config.scrollStrategy = config.scrollStrategy || this._scrollStrategy();
    config.backdropClass = config.backdropClass || 'sbb-overlay-background';

    const cdkRef = this._dialog.open<R, D, T>(componentOrTemplateRef, {
      ...config,
      positionStrategy: createGlobalPositionStrategy(this._injector)
        .centerHorizontally()
        .centerVertically(),
      // Disable closing since we need to sync it up to the animation ourselves.
      disableClose: true,
      // Disable closing on destroy, because this service cleans up its open dialogs as well.
      // We want to do the cleanup here, rather than the CDK service, because the CDK destroys
      // the dialogs immediately whereas we want it to wait for the animations to finish.
      closeOnDestroy: false,
      // Disable closing on detachments so that we can sync up the animation.
      closeOnOverlayDetachments: false,
      container: {
        type: this._dialogContainerType,
        providers: () => [
          // Provide our config as the CDK config as well since it has the same interface as the
          // CDK one, but it contains the actual values passed in by the user for things like
          // `disableClose` which we disable for the CDK dialog since we handle it ourselves.
          { provide: SbbDialogConfig, useValue: config },
          { provide: DialogConfig, useValue: config },
        ],
      },
      templateContext: () => ({ dialogRef, lightboxRef: dialogRef }),
      providers: (ref, cdkConfig, dialogContainer) => {
        dialogRef = new this._dialogRefConstructor(ref, config, dialogContainer);
        dialogRef.updatePosition(config?.position);
        return [
          { provide: this._dialogContainerType, useValue: dialogContainer },
          { provide: this._dialogDataToken, useValue: cdkConfig.data },
          { provide: this._dialogRefConstructor, useValue: dialogRef },
        ];
      },
    });

    // This can't be assigned in the `providers` callback, because
    // the instance hasn't been assigned to the CDK ref yet.
    (dialogRef! as { componentRef: ComponentRef<T> }).componentRef = cdkRef.componentRef!;
    dialogRef!.componentInstance = cdkRef.componentInstance!;

    this.openDialogs.push(dialogRef!);
    this.afterOpened.next(dialogRef!);

    dialogRef!.afterClosed().subscribe(() => {
      const index = this.openDialogs.indexOf(dialogRef);

      if (index > -1) {
        this.openDialogs.splice(index, 1);

        if (!this.openDialogs.length) {
          this._getAfterAllClosed().next();
        }
      }
    });

    return dialogRef!;
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
   */
  getDialogById(id: string): F | undefined {
    return this.openDialogs.find((dialog) => dialog.id === id);
  }

  ngOnDestroy() {
    // Only close the dialogs at this level on destroy
    // since the parent service may still be active.
    this._closeDialogs(this._openDialogsAtThisLevel);
    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
  }

  /** Closes all of the dialogs in an array. */
  private _closeDialogs(dialogs: F[]) {
    let i = dialogs.length;

    while (i--) {
      dialogs[i].close();
    }
  }
}

/**
 * Service to open modal dialogs.
 */
@Injectable({ providedIn: 'root' })
export class SbbDialog extends _SbbDialogBase<SbbDialogContainer> {
  constructor(...args: unknown[]);
  constructor() {
    const overlay = inject(Overlay);
    const injector = inject(Injector);
    const defaultOptions = inject<SbbDialogConfig>(SBB_DIALOG_DEFAULT_OPTIONS, { optional: true });
    const scrollStrategy = inject(SBB_DIALOG_SCROLL_STRATEGY);
    const parentDialog = inject(SbbDialog, { optional: true, skipSelf: true })!;

    super(
      overlay,
      injector,
      defaultOptions,
      parentDialog,
      scrollStrategy,
      SbbDialogRef,
      SbbDialogContainer,
      SBB_DIALOG_DATA,
    );
  }
}
