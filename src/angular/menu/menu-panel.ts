import { FocusOrigin } from '@angular/cdk/a11y';
import { EventEmitter, InjectionToken, TemplateRef } from '@angular/core';

import { SbbMenuContent } from './menu-content';
import { SbbMenuPositionX, SbbMenuPositionY } from './menu-positions';

/**
 * Injection token used to provide the parent menu to menu-specific components.
 * @docs-private
 */
export const SBB_MENU_PANEL = new InjectionToken<SbbMenuPanel>('SBB_MENU_PANEL');

/**
 * Interface for a custom menu panel that can be used with `sbbMenuTriggerFor`.
 * @docs-private
 */
export interface SbbMenuPanel<T = any> {
  xPosition: SbbMenuPositionX;
  yPosition: SbbMenuPositionY;
  overlapTrigger: boolean;
  templateRef: TemplateRef<any>;
  closed: EventEmitter<void | 'click' | 'keydown' | 'tab'>;
  parentMenu?: SbbMenuPanel | undefined;
  focusFirstItem: (origin?: FocusOrigin) => void;
  resetActiveItem: () => void;
  setPositionClasses?: (x: SbbMenuPositionX, y: SbbMenuPositionY) => void;
  setElevation?(depth: number): void;
  lazyContent?: SbbMenuContent;
  backdropClass?: string;
  overlayPanelClass?: string | string[];
  hasBackdrop?: boolean;
  readonly panelId?: string;
  triggerWidth: number;
}
