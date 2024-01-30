import { Component, Directive } from '@angular/core';

@Directive({
  selector: 'sbb-radio-button-panel-subtitle',
  exportAs: 'sbbRadioButtonPanelSubtitle',
  host: {
    class: 'sbb-radio-button-panel-subtitle sbb-selection-panel-subtitle',
  },
  standalone: true,
})
export class SbbRadioButtonPanelSubtitle {}

@Component({
  selector: 'sbb-radio-button-panel-warning',
  exportAs: 'sbbRadioButtonPanelWarning',
  template: '<strong><ng-content></ng-content></strong>',
  host: {
    class: 'sbb-radio-button-panel-warning sbb-selection-panel-warning',
  },
  standalone: true,
})
export class SbbRadioButtonPanelWarning {}

@Directive({
  selector: 'sbb-radio-button-panel-note',
  exportAs: 'sbbRadioButtonPanelNote',
  host: {
    class: 'sbb-radio-button-panel-note sbb-selection-panel-note sbb-icon-scaled',
  },
  standalone: true,
})
export class SbbRadioButtonPanelNote {}
