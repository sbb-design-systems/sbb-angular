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

  @HostBinding('attr.aria-busy') isBusy = 'true';
  @HostBinding('attr.role') role = 'progressbar';
  @Input() @HostBinding('class') class = [];
  @Input() mode: Mode;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.removeFullscreenClass(this.class);
      if (changes.mode.currentValue === Mode.FULLSCREEN) {

        this.class.push(cssPrefix + 'fullscreen-container');
        this.class = Array.from(new Set(this.class));
      } else if (changes.mode.currentValue === Mode.FULLBOX) {

        this.class.push(cssPrefix + 'fullbox-container');
        this.class = Array.from(new Set(this.class));
      } else {
        this.class.push(cssPrefix + changes.mode.currentValue);
      }
    }
  }

  private removeFullscreenClass(classArray) {
    Object.keys(Mode).forEach((key) => {
      classArray.splice(classArray.indexOf(cssPrefix + Mode[key]), 1);
    });
  }


}
