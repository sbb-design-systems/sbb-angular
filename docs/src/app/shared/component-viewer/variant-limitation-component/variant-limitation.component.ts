import { Component, Input } from '@angular/core';

import { ShowcaseMetaEntry } from '../../meta';

@Component({
  selector: 'sbb-variant-limitation',
  templateUrl: './variant-limitation.component.html',
  styleUrls: ['./variant-limitation.component.scss'],
  standalone: false,
})
export class VariantLimitationComponent {
  @Input()
  showcaseMetaEntry!: ShowcaseMetaEntry;

  get variantOnly(): 'standard' | 'lean' {
    return this.showcaseMetaEntry?.variantOnly ?? 'standard';
  }

  get oppositeVariant(): 'standard' | 'lean' {
    if (this.variantOnly === 'standard') {
      return 'lean';
    }
    return 'standard';
  }
}
