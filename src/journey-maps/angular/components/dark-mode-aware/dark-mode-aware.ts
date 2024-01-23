import { Component, Input } from '@angular/core';

import { SbbStyleMode } from '../../journey-maps.interfaces';

@Component({
  template: '',
})
export abstract class SbbDarkModeAware {
  @Input() styleMode: SbbStyleMode | undefined = 'bright';

  get isDarkMode(): boolean {
    return !!this.styleMode && this.styleMode === 'dark';
  }
}
