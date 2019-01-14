import { Component, HostBinding, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Mode } from './loading-mode.enum';

const cssPrefix = 'sbb-loading-';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent implements OnChanges {
  /** The aria-busy of loading component. */
  @HostBinding('attr.aria-busy') isBusy = 'true';
  /** The role of loading component. */
  @HostBinding('attr.role') role = 'progressbar';
  /** Class of loading component. */
  @Input() class = '';
  /** Class mode of loading component. */
  @HostBinding('class') modeClasses: string;
  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' = 'medium';

  private modeClassList = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.removeModesClasses(this.class);
      if (changes.mode.currentValue === Mode.FULLSCREEN) {
        this.modeClassList.push(cssPrefix + 'fullscreen-container');
      } else if (changes.mode.currentValue === Mode.FULLBOX) {
        this.modeClassList.push(cssPrefix + 'fullbox-container');
      } else {
        this.modeClassList.push(cssPrefix + changes.mode.currentValue);
      }

      this.modeClasses = `${this.class} ${this.modeClassList.join(' ')}`;
    }
  }

  private removeModesClasses(classList) {
    Object.keys(Mode).forEach((key) => {
      const classArray = classList.split(' ');
      classArray.splice(classArray.indexOf(cssPrefix + Mode[key]), 1);
    });
  }


}
