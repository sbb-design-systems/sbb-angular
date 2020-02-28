import { ScrollStrategy } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';

/** Valid ARIA roles for a Dialog element. */
export type DialogRole = 'dialog' | 'alertdialog';

/** Possible overrides for a dialog's position. */
export interface DialogPosition {
  /** Override for the Dialog's top position. */
  top?: string;

  /** Override for the Dialog's bottom position. */
  bottom?: string;

  /** Override for the Dialog's left position. */
  left?: string;

  /** Override for the Dialog's right position. */
  right?: string;
}

/**
 * Configuration for opening a modal dialog with the Dialog service.
 */
export class DialogConfig<D = any> {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the Dialog. This does not affect where the Dialog
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** ID for the Dialog. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the Dialog element. */
  role?: DialogRole = 'dialog';

  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose? = false;

  /** Width of the Dialog overlay. */
  width?;

  /** Height of the Dialog overlay. */
  height?;

  /** Min-width of the Dialog. If a number is provided, assumes pixel units. */
  minWidth?: number | string;

  /** Min-height of the Dialog. If a number is provided, assumes pixel units. */
  minHeight?: number | string;

  /** Max-width of the Dialog. If a number is provided, assumes pixel units. Defaults to 80vw. */
  maxWidth?: number | string = '80vw';

  /** Max-height of the Dialog. If a number is provided, assumes pixel units. */
  maxHeight?: number | string = '96vh';

  /** Position overrides. */
  position?: DialogPosition;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** ID of the element that describes the Dialog. */
  ariaDescribedBy?: string | null = null;

  /** Aria label to assign to the Dialog element */
  ariaLabel?: string | null = null;

  /** Whether the Dialog should focus the first focusable element on open. */
  autoFocus? = true;

  /** Scroll strategy to be used for the dialog. */
  scrollStrategy?: ScrollStrategy;

  /** Whether the Dialog should close when the user goes backwards/forwards in history. */
  closeOnNavigation? = true;
}
