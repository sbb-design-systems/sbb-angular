import { Component, Directive } from '@angular/core';

@Directive({
  selector: 'sbb-radio-button-panel-subtitle',
  exportAs: 'sbbRadioButtonPanelSubtitle',
  host: {
    class: 'sbb-radio-button-panel-subtitle sbb-selection-panel-subtitle',
  },
})
export class SbbRadioButtonPanelSubtitle {}

@Component({
  selector: 'sbb-radio-button-panel-warning',
  exportAs: 'sbbRadioButtonPanelWarning',
  template: '<strong><ng-content></ng-content></strong>',
  host: {
    class: 'sbb-radio-button-panel-warning sbb-selection-panel-warning',
  },
})
export class SbbRadioButtonPanelWarning {}

@Directive({
  selector: 'sbb-radio-button-panel-note',
  exportAs: 'sbbRadioButtonPanelNote',
  host: {
    class: 'sbb-radio-button-panel-note sbb-selection-panel-note sbb-icon-scaled',
  },
})
export class SbbRadioButtonPanelNote {}
