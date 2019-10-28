import { ElementRef, Injectable } from '@angular/core';

import { DialogRef } from './dialog-ref';

@Injectable({ providedIn: 'root' })
export class DialogHelperService {
  /**
   * Finds the closest DialogRef to an element by looking at the DOM.
   * @param element Element relative to which to look for a dialog.
   * @param openDialogs References to the currently-open dialogs.
   */
  getClosestDialog(element: ElementRef<HTMLElement>, openDialogs: DialogRef<any>[]) {
    let parent: HTMLElement | null = element.nativeElement.parentElement;

    while (parent && !parent.classList.contains('sbb-dialog-container')) {
      parent = parent.parentElement;
    }

    return parent ? openDialogs.find(dialog => dialog.id === parent.id) : null;
  }
}
