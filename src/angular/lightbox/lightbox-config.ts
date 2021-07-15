import { ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { SbbDialogRole } from '@sbb-esta/angular/dialog';

/**
 * Configuration for opening a modal dialog with the SbbLightbox service.
 */
export class SbbLightboxConfig<D = any> {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the dialog. This does not affect where the dialog
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** ID for the dialog. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the dialog element. */
  role?: SbbDialogRole = 'dialog';

  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose?: boolean = false;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** ID of the element that describes the dialog. */
  ariaDescribedBy?: string | null = null;

  /** ID of the element that labels the dialog. */
  ariaLabelledBy?: string | null = null;

  /** Aria label to assign to the dialog element. */
  ariaLabel?: string | null = null;

  /** Whether the dialog should focus the first focusable element on open. */
  autoFocus?: boolean = true;

  /**
   * Whether the dialog should restore focus to the
   * previously-focused element, after it's closed.
   */
  restoreFocus?: boolean = true;

  /** Scroll strategy to be used for the dialog. */
  scrollStrategy?: ScrollStrategy;

  /**
   * Whether the dialog should close when the user goes backwards/forwards in history.
   * Note that this usually doesn't include clicking on links (unless the user is using
   * the `HashLocationStrategy`).
   */
  closeOnNavigation?: boolean = true;

  /** Alternate `ComponentFactoryResolver` to use when resolving the associated component. */
  componentFactoryResolver?: ComponentFactoryResolver;

  // TODO(jelbourn): add configuration for lifecycle hooks, ARIA labelling.
}
