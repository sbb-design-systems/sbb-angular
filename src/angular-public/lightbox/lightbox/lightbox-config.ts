import { ScrollStrategy } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';

/** Valid ARIA roles for a Lightbox element. */
export type SbbLightboxRole = 'dialog' | 'alertdialog';

/** Configuration for opening a modal lightbox with the Lightbox service. */
export class SbbLightboxConfig<D = any> {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the Lightbox. This does not affect where the Lightbox
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /** ID for the Lightbox. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the Lightbox element. */
  role?: SbbLightboxRole = 'dialog';

  /** Custom class for the overlay pane. */
  panelClass?: string | string[] = '';

  /** Whether the user can use escape or clicking on the backdrop to close the modal. */
  disableClose?: boolean = false;

  /** Width of the Lightbox. */
  width?: string = '100vw';

  /** Height of the Lightbox. */
  height?: string = '100vh';

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** ID of the element that describes the Lightbox. */
  ariaDescribedBy?: string | null = null;

  /** Aria label to assign to the Lightbox element */
  ariaLabel?: string | null = null;

  /** Whether the Lightbox should focus the first focusable element on open. */
  autoFocus?: boolean = true;

  /** Scroll strategy to be used for the dialog. */
  scrollStrategy?: ScrollStrategy;

  /** Whether the Lightbox should close when the user goes backwards/forwards in history. */
  closeOnNavigation?: boolean = true;
}
