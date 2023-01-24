import { CdkScrollable } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbAccordionModule } from './index';

describe('SbbNbc', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbAccordionModule, SbbIconTestingModule, ScrollingModule],
      declarations: [StandardNbc],
    });
    TestBed.compileComponents();
  }));

  describe('Standard Nbc component', () => {
    let fixture: ComponentFixture<StandardNbc>;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandardNbc);
      fixture.detectChanges();
    });

    it('should collapse ...', fakeAsync(() => {
      fixture.componentInstance.scroll(50);
      tick(100);
      fixture.detectChanges();
    }));
  });
});

@Component({
  styles: ['.panel-body { height: 300px; }'],
  template: ` <div cdkScrollable style="height: 200px; width: 700px; overflow: auto;">
    <sbb-nbc>
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Panel one title</sbb-expansion-panel-header>
        <div class="panel-body">Panel one content</div>
      </sbb-expansion-panel>
      <sbb-expansion-panel>
        <sbb-expansion-panel-header>Panel two title</sbb-expansion-panel-header>
        <div class="panel-body">Panel two content</div>
      </sbb-expansion-panel>
    </sbb-nbc>
    <div style="height: 1000px"></div>
  </div>`,
})
class StandardNbc {
  @ViewChild(CdkScrollable) scrollingContainer: CdkScrollable;

  scroll(amount: number) {
    const scrollingContainerEl = this.scrollingContainer.getElementRef().nativeElement;
    scrollingContainerEl.scrollTop = amount;
    dispatchFakeEvent(scrollingContainerEl, 'scroll');
  }
}
