import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Observable, Subject, Subscription, SubscriptionLike } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { LightboxContainerComponent } from './lightbox-container.component';

// Counter for unique lightbox ids.
let uniqueId = 0;

/**
 * Reference to a lightbox opened via the Lightbox service.
 */
export class LightboxRef<T, R = any> {
  /** The instance of component opened into the lightbox. */
  componentInstance: T | null;

  /** Whether the user is allowed to close the dialog. */
  disableClose: boolean | undefined = this.containerInstance.config.disableClose;
  /** Observable to close manually a lightbox. */
  manualCloseAction = new Subject<void>();

  /** Subject for notifying the user that the lightbox has finished opening. */
  private readonly _afterOpen = new Subject<void>();

  /** Subject for notifying the user that the lightbox has finished closing. */
  private readonly _afterClosed = new Subject<R | undefined>();

  /** Subject for notifying the user that the lightbox has started closing. */
  private readonly _beforeClose = new Subject<R | undefined>();

  /** Result to be passed to afterClosed. */
  private _result: R | undefined;

  /** Subscription to changes in the user's location. */
  private _locationChanges: SubscriptionLike = Subscription.EMPTY;

  constructor(
    /** The instance of the container component. */
    public containerInstance: LightboxContainerComponent,
    /** Identifier of lightbox. */
    readonly id: string = `sbb-lightbox-${uniqueId++}`,
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
      .pipe(filter(event => event.keyCode === ESCAPE && !!this.disableClose))
      .subscribe(() => this.manualCloseAction.next());

    if (location) {
      // Close the lightbox when the user goes forwards/backwards in history or when the location
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
   * Close the lightbox.
   * @param lightboxResult Optional result to return to the lightbox opener.
   */
  close(lightboxResult?: R): void {
    this._result = lightboxResult;

    // Transition the backdrop in parallel to the lightbox.
    this.containerInstance.animationStateChanged
      .pipe(
        filter(event => event.phaseName === 'start'),
        first()
      )
      .subscribe(() => {
        this._beforeClose.next(lightboxResult);
        this._beforeClose.complete();
        this._overlayRef.detachBackdrop();
      });

    this.containerInstance.startExitAnimation();
  }

  /**
   * Gets an observable that is notified when the lightbox is finished opening.
   */
  afterOpen(): Observable<void> {
    return this._afterOpen.asObservable();
  }

  /**
   * Gets an observable that is notified when the lightbox is finished closing.
   */
  afterClosed(): Observable<R | undefined> {
    return this._afterClosed.asObservable();
  }

  /**
   * Gets an observable that is notified when the lightbox has started closing.
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
}
