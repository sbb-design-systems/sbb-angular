import { Directionality } from '@angular/cdk/bidi';
import { CdkScrollable, OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  DebugElement,
  NgZone,
  provideZoneChangeDetection,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';
import { Subject } from 'rxjs';

import { SbbTooltip, SbbTooltipModule } from './index';

const initialTooltipMessage = 'initial tooltip message';

describe('SbbTooltip Zone.js integration', () => {
  let fixture: ComponentFixture<ScrollableTooltipDemo>;
  let buttonDebugElement: DebugElement;
  let tooltipDirective: SbbTooltip;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbTooltipModule, OverlayModule, ScrollableTooltipDemo],
      providers: [
        provideZoneChangeDetection(),
        {
          provide: Directionality,
          useFactory: () => ({ value: 'ltr', change: new Subject() }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollableTooltipDemo);
    fixture.detectChanges();
    buttonDebugElement = fixture.debugElement.query(By.css('button'))!;
    tooltipDirective = buttonDebugElement.injector.get(SbbTooltip);
  });

  it('should execute the `hide` call, after scrolling away, inside the NgZone', fakeAsync(() => {
    const inZoneSpy = jasmine.createSpy('in zone spy');

    tooltipDirective.show();
    fixture.detectChanges();
    tick(0);

    spyOn(tooltipDirective._tooltipInstance!, 'hide').and.callFake(() => {
      inZoneSpy(NgZone.isInAngularZone());
    });

    fixture.componentInstance.scrollDown();
    tick(100);
    fixture.detectChanges();

    expect(inZoneSpy).toHaveBeenCalled();
    expect(inZoneSpy).toHaveBeenCalledWith(true);
  }));
});
@Component({
  selector: 'app',
  template: ` <div
    cdkScrollable
    style="padding: 100px; margin: 300px;
      height: 200px; width: 200px; overflow: auto;"
  >
    @if (showButton) {
      <button style="margin-bottom: 600px" [sbbTooltip]="message">Button</button>
    }
  </div>`,
  standalone: true,
  imports: [SbbTooltipModule],
})
class ScrollableTooltipDemo {
  message: string = initialTooltipMessage;
  showButton: boolean = true;

  @ViewChild(CdkScrollable) scrollingContainer: CdkScrollable;

  scrollDown() {
    const scrollingContainerEl = this.scrollingContainer.getElementRef().nativeElement;
    scrollingContainerEl.scrollTop = 250;

    // Emit a scroll event from the scrolling element in our component.
    // This event should be picked up by the scrollable directive and notify.
    // The notification should be picked up by the service.
    dispatchFakeEvent(scrollingContainerEl, 'scroll');
  }
}
