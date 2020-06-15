import { Directive } from '@angular/core';

/**
 * Tab content that will be rendered lazily
 * after the tab is active.
 */
@Directive({
  selector: 'ng-template[sbbTabContent]',
})
export class TabContent {}
