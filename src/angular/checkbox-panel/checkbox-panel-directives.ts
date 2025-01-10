import { Component, Directive } from '@angular/core';

@Directive({
  selector: 'sbb-checkbox-panel-subtitle',
  exportAs: 'sbbCheckboxPanelSubtitle',
  host: {
    class: 'sbb-checkbox-panel-subtitle sbb-selection-panel-subtitle',
  },
})
export class SbbCheckboxPanelSubtitle {}

@Component({
  selector: 'sbb-checkbox-panel-warning',
  exportAs: 'sbbCheckboxPanelWarning',
  template: '<strong><ng-content></ng-content></strong>',
  host: {
    class: 'sbb-checkbox-panel-warning sbb-selection-panel-warning',
  },
})
export class SbbCheckboxPanelWarning {}

@Directive({
  selector: 'sbb-checkbox-panel-note',
  exportAs: 'sbbCheckboxPanelNote',
  host: {
    class: 'sbb-checkbox-panel-note sbb-selection-panel-note sbb-icon-scaled',
  },
})
export class SbbCheckboxPanelNote {}
