import { ESCAPE } from '@angular/cdk/keycodes';
import { GlobalPositionStrategy, OverlayRef } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Observable, Subject, Subscription, SubscriptionLike } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { DialogPosition } from './dialog-config';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';

// Counter for unique dialog ids.
let uniqueId = 0;

/**
 * Reference to a dialog opened via the Dialog service.
 */
export class DialogRef<T, R = any> {
  /** The instance of component opened into the dialog. */
  componentInstance: T;

  /** Whether the user is allowed to close the dialog. */
  disableClose: boolean | undefined = this.containerInstance.config.disableClose;
  /** Observable to close manually a dialog. */
  manualCloseAction = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished opening. */
  private readonly _afterOpen = new Subject<void>();

  /** Subject for notifying the user that the dialog has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the dialog has started closing. */
  private readonly _beforeClose = new Subject<R | undefined>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Subscription to changes in the user's location. */
  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  constructor(
    /** The instance of the container component. */
    public containerInstance: DialogContainerComponent,
    /** Identifier of dialog. */
    readonly id: string = `sbb-dialog-${uniqueId++}`,
    private _overlayRef: OverlayRef,
    location?: Location
  ) {
    // Pass the id along to the container.
    containerInstance.id = id;

    // Emit when opening animation completes
    containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'enter'),
        first()
      )
      .subscribe(() => {
        this._afterOpen.next();
        this._afterOpen.complete();
      });

    // Dispose overlay when closing animation is complete
    containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'done' && event.toState === 'exit'),
        first()
      )
      .subscribe(() => this._overlayRef.dispose());

    _overlayRef.detachments().subscribe(() => {
      this._beforeClose.next(this._result);
      this._beforeClose.complete();
      this._locationChanges.unsubscribe();
      this._afterClosed.next(this._result);
      this._afterClosed.complete();
      this.componentInstance = null;
      this._overlayRef.dispose();
    });

    _overlayRef
      .keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && !this.disableClose))
      .subscribe(() => this.close());

    _overlayRef
      .keydownEvents()
      .pipe(filter(event => event.keyCode === ESCAPE && this.disableClose))
      .subscribe(() => this.manualCloseAction.next(null));

    if (location) {
      // Close the dialog when the user goes forwards/backwards in history or when the location
      // hash changes. Note that this usually doesn't include clicking on links (unless the user
      // is using the `HashLocationStrategy`).
      this._locationChanges = location.subscribe(() => {
        if (this.containerInstance.config.closeOnNavigation) {
          this.close();
        }
      });
    }
  }

  /**
   * Close the dialog.
   * @param dialogResult Optional result to return to the dialog opener.
   */
  close(dialogResult?: R): void {
    this._result = dialogResult;

    // Transition the backdrop in parallel to the dialog.
    this.containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'start'),
        first()
      )
      .subscribe(() => {
        this._beforeClose.next(dialogResult);
        this._beforeClose.complete();
        this._overlayRef.detachBackdrop();
      });

    this.containerInstance.startExitAnimation();
  }

  /**
   * Updates the dialog's position.
   * @param position New dialog position.
   */
  updatePosition(position?: DialogPosition): this {
    const strategy = this._getPositionStrategy();

    if (position && (position.left || position.right)) {
      position.left ? strategy.left(position.left) : strategy.right(position.right);
    } else {
      strategy.centerHorizontally();
    }

    if (position && (position.top || position.bottom)) {
      position.top ? strategy.top(position.top) : strategy.bottom(position.bottom);
    } else {
      strategy.centerVertically();
    }

    this._overlayRef.updatePosition();

    return this;
  }

  /**
   * Gets an observable that is notified when the dialog is finished opening.
   */
  afterOpen(): Observable<void> {
    return this._afterOpen.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Gets an observable that is notified when the dialog has started closing.
   */
  beforeClose(): Observable<R | undefined> {
    return this._beforeClose.asObservable();
  }

  /**
   * Gets an observable that emits when keydown events are targeted on the overlay.
   */
  keydownEvents(): Observable<KeyboardEvent> {
    return this._overlayRef.keydownEvents();
  }

  /** Fetches the position strategy object from the overlay ref. */
  private _getPositionStrategy(): GlobalPositionStrategy {
    return this._overlayRef.getConfig().positionStrategy as GlobalPositionStrategy;
  }
}
