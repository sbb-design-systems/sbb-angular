import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  provideZoneChangeDetection,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import {
  SbbNotificationToast,
  SbbNotificationToastConfig,
  SbbNotificationToastModule,
} from './index';

describe('NotificationToast Zone.js integration', () => {
  let notificationToast: SbbNotificationToast;

  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbNotificationToastModule,
        SbbIconTestingModule,
        NoopAnimationsModule,
        ComponentWithChildViewContainer,
        DirectiveWithViewContainer,
      ],
      providers: [provideZoneChangeDetection()],
    }).compileComponents();
  }));

  beforeEach(inject([SbbNotificationToast], (nt: SbbNotificationToast) => {
    notificationToast = nt;
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
  });

  it('should clear the dismiss timeout when dismissed before timeout expiration', fakeAsync(() => {
    const config = new SbbNotificationToastConfig();
    config.duration = 1000;
    notificationToast.open('content', config);

    setTimeout(() => notificationToast.dismiss(), 500);

    tick();
    flush();

    expect(viewContainerFixture.isStable()).toBe(true);
  }));
});

@Directive({
  selector: 'dir-with-view-container',
  standalone: true,
})
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'arbitrary-component',
  template: `@if (childComponentExists()) {
    <dir-with-view-container></dir-with-view-container>
  }`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DirectiveWithViewContainer],
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  childComponentExists = signal(true);

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}