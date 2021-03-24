import { Component, Input } from '@angular/core';

import { ShowcaseMetaEntry } from '../../meta';

@Component({
  selector: 'sbb-one-variant-only-notification',
  templateUrl: './one-variant-only-notification.component.html',
  styleUrls: ['./one-variant-only-notification.component.scss'],
})
export class OneVariantOnlyNotificationComponent {
  @Input()
  showcaseMetaEntry: ShowcaseMetaEntry;

  get variantOnly(): 'standard' | 'lean' {
    return this.showcaseMetaEntry.variantOnly;
  }

  oppositeVariant(variantOnly: 'standard' | 'lean'): 'standard' | 'lean' {
    if (variantOnly === 'standard') {
      return 'lean';
    }
    return 'standard';
  }
}
