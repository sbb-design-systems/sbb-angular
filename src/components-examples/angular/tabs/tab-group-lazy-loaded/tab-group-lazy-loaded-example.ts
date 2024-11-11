import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Tab group where the tab content is loaded lazily (when activated)
 * @order 30
 */
@Component({
  selector: 'sbb-tab-group-lazy-loaded-example',
  templateUrl: 'tab-group-lazy-loaded-example.html',
  imports: [SbbTabsModule, DatePipe],
})
export class TabGroupLazyLoadedExample {
  tabLoadTimes: Date[] = [];

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }
}
