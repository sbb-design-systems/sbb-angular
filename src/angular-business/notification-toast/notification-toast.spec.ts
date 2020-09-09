import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  Component,
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import {
  NotificationToastContainerComponent,
  NotificationToastModule,
  SbbNotificationToast,
  SbbNotificationToastConfig,
  SbbNotificationToastRef,
  SBB_NOTIFICATION_TOAST_DATA,
  SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS,
  SimpleNotificationComponent,
} from './index';

describe('SbbNotificationToast icons', () => {
  let testFixture: ComponentFixture<NotificationMockComponent>;
  let testComponent: NotificationMockComponent;
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationToastModule,
        NotificationToastTestModule,
        NoopAnimationsModule,
        SbbIconTestingModule,
      ],
      providers: [
        SbbNotificationToast,
        { provide: SBB_NOTIFICATION_TOAST_DATA, useValue: SbbNotificationToastConfig },
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    testFixture = TestBed.createComponent(NotificationMockComponent);
    testComponent = testFixture.componentInstance;
    testFixture.detectChanges();
  });

  it('should have error icon when type is ERROR', () => {
    testComponent.showNotification({ type: 'error' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-toast-error');
    expect(notifications.length).toBe(
      1,
      'Expected class .sbb-notification-toast-error to be assigned'
    );
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toMatch(/^kom:sign-exclamation-point-sma/);
  });

  it('should have tick icon when type is SUCCESS', () => {
    testComponent.showNotification({ type: 'success' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll(
      '.sbb-notification-toast-success'
    );
    expect(notifications.length).toBe(
      1,
      'Expected class .sbb-notification-toast-success to be assigned'
    );
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toEqual('kom:tick-small');
  });

  it('should have info icon when type is INFO', () => {
    testComponent.showNotification({ type: 'info' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-toast-info');
    expect(notifications.length).toBe(
      1,
      'Expected class .sbb-notification-toast-info to be assigned'
    );
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toEqual('kom:circle-information-small');
  });

  it('should have warn icon when type is WARN', () => {
    testComponent.showNotification({ type: 'warn' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-toast-warn');
    expect(notifications.length).toBe(
      1,
      'Expected class .sbb-notification-toast-warn to be assigned'
    );
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toMatch(/^kom:sign-exclamation-point-sma/);
  });
});

describe('SbbNotificationToast', () => {
  let notificationToast: SbbNotificationToast;
  let liveAnnouncer: LiveAnnouncer;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  const simpleMessage = 'Burritos are here!';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationToastModule,
        NotificationToastTestModule,
        NoopAnimationsModule,
        SbbIconTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(inject(
    [SbbNotificationToast, LiveAnnouncer, OverlayContainer],
    (sb: SbbNotificationToast, la: LiveAnnouncer, oc: OverlayContainer) => {
      notificationToast = sb;
      liveAnnouncer = la;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    liveAnnouncer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it(
    'should have the role of `alert` with an `assertive` politeness if no announcement message ' +
      'is provided',
    () => {
      notificationToast.openFromComponent(BurritosNotification, {
        announcementMessage: '',
        politeness: 'assertive',
      });

      viewContainerFixture.detectChanges();

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container'
      )!;
      expect(containerElement.getAttribute('role')).toBe(
        'alert',
        'Expected notification toast container to have role="alert"'
      );
    }
  );

  it(
    'should have the role of `status` with an `assertive` politeness if an announcement message ' +
      'is provided',
    () => {
      notificationToast.openFromComponent(BurritosNotification, {
        announcementMessage: 'Yay Burritos',
        politeness: 'assertive',
      });
      viewContainerFixture.detectChanges();

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container'
      )!;
      expect(containerElement.getAttribute('role')).toBe(
        'status',
        'Expected notification toast container to have role="status"'
      );
    }
  );

  it('should have the role of `status` with a `polite` politeness', () => {
    notificationToast.openFromComponent(BurritosNotification, { politeness: 'polite' });
    viewContainerFixture.detectChanges();

    const containerElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!;
    expect(containerElement.getAttribute('role')).toBe(
      'status',
      'Expected notification toast container to have role="status"'
    );
  });

  it('should remove the role if the politeness is turned off', () => {
    notificationToast.openFromComponent(BurritosNotification, { politeness: 'off' });
    viewContainerFixture.detectChanges();

    const containerElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!;
    expect(containerElement.getAttribute('role')).toBeFalsy('Expected role to be removed');
  });

  it('should open and close a notification toast without a ViewContainerRef', fakeAsync(() => {
    const notificationToastRef = notificationToast.open('Toast time!');
    viewContainerFixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!;
    expect(messageElement.textContent).toContain(
      'Toast time!',
      'Expected notification toast to show a message without a ViewContainerRef'
    );

    notificationToastRef.dismiss();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childNodes.length).toBe(
      0,
      'Expected notification toast to be dismissed without a ViewContainerRef'
    );
  }));

  it('should open a simple message', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);

    viewContainerFixture.detectChanges();

    expect(notificationToastRef.instance instanceof SimpleNotificationComponent).toBe(
      true,
      'Expected the notification toast content component to be SimpleNotificationComponent'
    );
    expect(notificationToastRef.instance.notificationToastRef).toBe(
      notificationToastRef,
      'Expected the notification toast reference to be placed in the component instance'
    );

    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!;
    expect(messageElement.textContent).toContain(
      simpleMessage,
      `Expected the notification toast message to be '${simpleMessage}'`
    );
  });

  it('should dismiss the notification toast and remove itself from the view', fakeAsync(() => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    const notificationToastRef = notificationToast.open(simpleMessage, config);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(
      0,
      'Expected overlay container element to have at least one child'
    );

    notificationToastRef.afterDismissed().subscribe({ complete: dismissCompleteSpy });

    notificationToastRef.dismiss();
    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!;
    expect(messageElement.hasAttribute('sbb-exit')).toBe(
      true,
      'Expected the notification toast container to have the "exit" attribute upon dismiss'
    );

    viewContainerFixture.detectChanges(); // Run through animations for dismissal
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    expect(overlayContainerElement.childElementCount).toBe(
      0,
      'Expected the overlay container element to have no child elements'
    );
  }));

  it('should clear the announcement message if it is the same as main message', fakeAsync(() => {
    spyOn(liveAnnouncer, 'announce');

    notificationToast.open(simpleMessage, { announcementMessage: simpleMessage });
    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.childElementCount).toBe(
      1,
      'Expected the overlay with the default announcement message to be added'
    );

    expect(liveAnnouncer.announce).not.toHaveBeenCalled();
  }));

  it('should be able to specify a custom announcement message', fakeAsync(() => {
    spyOn(liveAnnouncer, 'announce');

    notificationToast.open(simpleMessage, {
      announcementMessage: 'Custom announcement',
      politeness: 'assertive',
    });
    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.childElementCount).toBe(
      1,
      'Expected the overlay with a custom `announcementMessage` to be added'
    );

    expect(liveAnnouncer.announce).toHaveBeenCalledWith('Custom announcement', 'assertive');
  }));

  it('should be able to get dismissed through the service', fakeAsync(() => {
    notificationToast.open(simpleMessage);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    notificationToast.dismiss();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should clean itself up when the view container gets destroyed', fakeAsync(() => {
    notificationToast.open(simpleMessage, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    viewContainerFixture.componentInstance.childComponentExists = false;
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(
      0,
      'Expected notification toast to be removed after the view container was destroyed'
    );
  }));

  it('should set the animation state to visible on entry', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);

    viewContainerFixture.detectChanges();
    const container = notificationToastRef.containerInstance as NotificationToastContainerComponent;
    expect(container._animationState).toBe(
      'visible',
      `Expected the animation state would be 'visible'.`
    );
    notificationToastRef.dismiss();

    viewContainerFixture.detectChanges();
    expect(container._animationState).toBe(
      'hidden',
      `Expected the animation state would be 'hidden'.`
    );
  });

  it('should set the animation state to complete on exit', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);
    notificationToastRef.dismiss();

    viewContainerFixture.detectChanges();
    const container = notificationToastRef.containerInstance as NotificationToastContainerComponent;
    expect(container._animationState).toBe(
      'hidden',
      `Expected the animation state would be 'hidden'.`
    );
  });

  it(`should set the old notification toast animation state to complete and the new notification toast animation
      state to visible on entry of new notification toast`, fakeAsync(() => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    viewContainerFixture.detectChanges();
    const container1 = notificationToastRef.containerInstance as NotificationToastContainerComponent;
    expect(container1._animationState).toBe(
      'visible',
      `Expected the animation state would be 'visible'.`
    );

    const config2 = { viewContainerRef: testViewContainerRef };
    const notificationToastRef2 = notificationToast.open(simpleMessage, config2);

    viewContainerFixture.detectChanges();
    notificationToastRef.afterDismissed().subscribe({ complete: dismissCompleteSpy });
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    const container2 = notificationToastRef2.containerInstance as NotificationToastContainerComponent;
    expect(container1._animationState).toBe(
      'hidden',
      `Expected the animation state would be 'hidden'.`
    );
    expect(container2._animationState).toBe(
      'visible',
      `Expected the animation state would be 'visible'.`
    );
  }));

  it('should open a new notification toast after dismissing a previous notification toast', fakeAsync(() => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    let notificationToastRef = notificationToast.open(simpleMessage, config);

    viewContainerFixture.detectChanges();

    notificationToastRef.dismiss();
    viewContainerFixture.detectChanges();

    // Wait for the notification toast dismiss animation to finish.
    flush();
    notificationToastRef = notificationToast.open('Second notification toast', config);
    viewContainerFixture.detectChanges();

    // Wait for the notification toast open animation to finish.
    flush();
    const container = notificationToastRef.containerInstance as NotificationToastContainerComponent;
    expect(container._animationState).toBe(
      'visible',
      `Expected the animation state would be 'visible'.`
    );
  }));

  it('should remove past notification toasts when opening new notification toasts', fakeAsync(() => {
    notificationToast.open('First notification toast');
    viewContainerFixture.detectChanges();

    notificationToast.open('Second notification toast');
    viewContainerFixture.detectChanges();
    flush();

    notificationToast.open('Third notification toast');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe('Third notification toast');
  }));

  it('should remove notification toast if another is shown while its still animating open', fakeAsync(() => {
    notificationToast.open('First notification toast');
    viewContainerFixture.detectChanges();

    notificationToast.open('Second notification toast');
    viewContainerFixture.detectChanges();

    tick();
    expect(overlayContainerElement.textContent!.trim()).toBe('Second notification toast');

    // Let remaining animations run.
    tick(500);
  }));

  it('should dismiss automatically after a specified timeout', fakeAsync(() => {
    const config = new SbbNotificationToastConfig();
    config.duration = 250;
    const notificationToastRef = notificationToast.open('content', config);
    const afterDismissSpy = jasmine.createSpy('after dismiss spy');
    notificationToastRef.afterDismissed().subscribe(afterDismissSpy);

    viewContainerFixture.detectChanges();
    tick();
    expect(afterDismissSpy).not.toHaveBeenCalled();

    tick(1000);
    viewContainerFixture.detectChanges();
    tick();
    expect(afterDismissSpy).toHaveBeenCalled();
  }));

  it('should clear the dismiss timeout when dismissed before timeout expiration', fakeAsync(() => {
    const config = new SbbNotificationToastConfig();
    config.duration = 1000;
    notificationToast.open('content', config);

    setTimeout(() => notificationToast.dismiss(), 500);

    tick(600);
    viewContainerFixture.detectChanges();
    tick();

    expect(viewContainerFixture.isStable()).toBe(true);
  }));

  it('should add extra classes to the container', () => {
    notificationToast.open(simpleMessage, { panelClass: ['one', 'two'] });
    viewContainerFixture.detectChanges();

    const containerClasses = overlayContainerElement.querySelector(
      'sbb-notification-toast-container'
    )!.classList;

    expect(containerClasses).toContain('one');
    expect(containerClasses).toContain('two');
  });

  it('should be able to override the default config', fakeAsync(() => {
    overlayContainer.ngOnDestroy();
    viewContainerFixture.destroy();

    TestBed.resetTestingModule()
      .overrideProvider(SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS, {
        deps: [],
        useFactory: () => ({ panelClass: 'custom-class' }),
      })
      .configureTestingModule({
        imports: [NotificationToastModule, NoopAnimationsModule, SbbIconTestingModule],
      })
      .compileComponents();

    inject(
      [SbbNotificationToast, OverlayContainer],
      (sb: SbbNotificationToast, oc: OverlayContainer) => {
        notificationToast = sb;
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
      }
    )();

    notificationToast.open(simpleMessage);
    flush();

    expect(
      overlayContainerElement.querySelector('sbb-notification-toast-container')!.classList
    ).toContain('custom-class', 'Expected class applied through the defaults to be applied.');
  }));

  it('should dismiss the open notification toast on destroy', fakeAsync(() => {
    notificationToast.open(simpleMessage);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    notificationToast.ngOnDestroy();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBe(0);
  }));

  it('should cap the timeout to the maximum accepted delay in setTimeout', fakeAsync(() => {
    const config = new SbbNotificationToastConfig();
    config.duration = Infinity;
    notificationToast.open('content', config);
    viewContainerFixture.detectChanges();
    spyOn(window, 'setTimeout').and.callThrough();
    tick(100);

    expect(window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), Math.pow(2, 31) - 1);

    flush();
  }));

  describe('with custom component', () => {
    it('should open a custom component', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification);

      expect(notificationToastRef.instance instanceof BurritosNotification).toBe(
        true,
        'Expected the notification toast content component to be BurritosNotification'
      );
      expect(overlayContainerElement.textContent!.trim()).toBe(
        'Burritos are on the way.',
        'Expected component to have the proper text.'
      );
    });

    it('should inject the notification toast reference into the component', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification);

      expect(notificationToastRef.instance.notificationToastRef).toBe(
        notificationToastRef,
        'Expected component to have an injected notification toast reference.'
      );
    });

    it('should be able to inject arbitrary user data', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification, {
        data: {
          burritoType: 'Chimichanga',
        },
      });

      expect(notificationToastRef.instance.data).toBeTruthy(
        'Expected component to have a data object.'
      );
      expect(notificationToastRef.instance.data.burritoType).toBe(
        'Chimichanga',
        'Expected the injected data object to be the one the user provided.'
      );
    });
  });

  describe('with TemplateRef', () => {
    let templateFixture: ComponentFixture<ComponentWithTemplateRef>;

    beforeEach(() => {
      templateFixture = TestBed.createComponent(ComponentWithTemplateRef);
      templateFixture.detectChanges();
    });

    it('should be able to open a notification toast using a TemplateRef', () => {
      templateFixture.componentInstance.localValue = 'Pizza';
      notificationToast.openFromTemplate(templateFixture.componentInstance.templateRef);
      templateFixture.detectChanges();

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container'
      )!;

      expect(containerElement.textContent).toContain('Fries');
      expect(containerElement.textContent).toContain('Pizza');

      templateFixture.componentInstance.localValue = 'Pasta';
      templateFixture.detectChanges();

      expect(containerElement.textContent).toContain('Pasta');
    });

    it('should be able to pass in contextual data when opening with a TemplateRef', () => {
      notificationToast.openFromTemplate(templateFixture.componentInstance.templateRef, {
        data: { value: 'Oranges' },
      });

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container'
      )!;

      expect(containerElement.textContent).toContain('Oranges');
    });
  });
});

describe('SbbNotificationToast with parent SbbNotificationToast', () => {
  let parentNotificationToast: SbbNotificationToast;
  let childNotificationToast: SbbNotificationToast;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesSbbNotificationToast>;
  let liveAnnouncer: LiveAnnouncer;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationToastModule,
        NotificationToastTestModule,
        NoopAnimationsModule,
        SbbIconTestingModule,
      ],
      declarations: [ComponentThatProvidesSbbNotificationToast],
    }).compileComponents();
  }));

  beforeEach(inject(
    [SbbNotificationToast, LiveAnnouncer, OverlayContainer],
    (sb: SbbNotificationToast, la: LiveAnnouncer, oc: OverlayContainer) => {
      parentNotificationToast = sb;
      liveAnnouncer = la;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();

      fixture = TestBed.createComponent(ComponentThatProvidesSbbNotificationToast);
      childNotificationToast = fixture.componentInstance.notificationToast;
      fixture.detectChanges();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    liveAnnouncer.ngOnDestroy();
  });

  it('should close notificationToasts opened by parent when opening from child', fakeAsync(() => {
    parentNotificationToast.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a notificationToast to be opened'
    );

    childNotificationToast.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent).toContain(
      'Taco',
      'Expected parent notification toast msg to be dismissed by opening from child'
    );
  }));

  it('should close notificationToasts opened by child when opening from parent', fakeAsync(() => {
    childNotificationToast.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a notificationToast to be opened'
    );

    parentNotificationToast.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent).toContain(
      'Taco',
      'Expected child notification toast msg to be dismissed by opening from parent'
    );
  }));

  it('should not dismiss parent notification toast if child is destroyed', fakeAsync(() => {
    parentNotificationToast.open('Pizza');
    fixture.detectChanges();
    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);

    childNotificationToast.ngOnDestroy();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount).toBeGreaterThan(0);
  }));
});

describe('SbbNotificationToast Positioning', () => {
  let notificationToast: SbbNotificationToast;
  let liveAnnouncer: LiveAnnouncer;
  let overlayContainer: OverlayContainer;
  let overlayContainerEl: HTMLElement;

  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  const simpleMessage = 'Burritos are here!';

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationToastModule,
        NotificationToastTestModule,
        NoopAnimationsModule,
        SbbIconTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(inject(
    [SbbNotificationToast, LiveAnnouncer, OverlayContainer],
    (sb: SbbNotificationToast, la: LiveAnnouncer, oc: OverlayContainer) => {
      notificationToast = sb;
      liveAnnouncer = la;
      overlayContainer = oc;
      overlayContainerEl = oc.getContainerElement();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    liveAnnouncer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);
    viewContainerFixture.detectChanges();
  });

  it('should default to bottom center', fakeAsync(() => {
    notificationToast.open(simpleMessage);

    viewContainerFixture.detectChanges();
    flush();

    const containerEl = overlayContainerEl.querySelector(
      'sbb-notification-toast-container'
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeFalsy();

    expect(overlayPaneEl.style.marginBottom).toBe('0px', 'Expected margin-bottom to be "0px"');
    expect(overlayPaneEl.style.marginTop).toBe('', 'Expected margin-top to be ""');
    expect(overlayPaneEl.style.marginRight).toBe('', 'Expected margin-right to be ""');
    expect(overlayPaneEl.style.marginLeft).toBe('', 'Expected margin-left  to be ""');
  }));

  it('should be in the bottom center', fakeAsync(() => {
    notificationToast.open(simpleMessage, {
      verticalPosition: 'bottom',
    });

    viewContainerFixture.detectChanges();
    flush();

    const containerEl = overlayContainerEl.querySelector(
      'sbb-notification-toast-container'
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeFalsy();
    expect(overlayPaneEl.style.marginBottom).toBe('0px', 'Expected margin-bottom to be "0px"');
    expect(overlayPaneEl.style.marginTop).toBe('', 'Expected margin-top to be ""');
    expect(overlayPaneEl.style.marginRight).toBe('', 'Expected margin-right to be ""');
    expect(overlayPaneEl.style.marginLeft).toBe('', 'Expected margin-left  to be ""');
  }));

  it('should be in the top center', fakeAsync(() => {
    notificationToast.open(simpleMessage, {
      verticalPosition: 'top',
    });

    viewContainerFixture.detectChanges();
    flush();

    const containerEl = overlayContainerEl.querySelector(
      'sbb-notification-toast-container'
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeTruthy();
    expect(overlayPaneEl.style.marginBottom).toBe('', 'Expected margin-bottom to be ""');
    expect(overlayPaneEl.style.marginTop).toBe('0px', 'Expected margin-top to be "0px"');
    expect(overlayPaneEl.style.marginRight).toBe('', 'Expected margin-right to be ""');
    expect(overlayPaneEl.style.marginLeft).toBe('', 'Expected margin-left  to be ""');
  }));
});

@Component({
  selector: 'sbb-notification-mock',
  template: '',
})
export class NotificationMockComponent {
  dismissed: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _notification: SbbNotificationToast) {}

  showNotification(config: SbbNotificationToastConfig) {
    this._notification
      .open(config.announcementMessage || 'test', {
        type: config.type,
        verticalPosition: config.verticalPosition,
        announcementMessage: config.announcementMessage,
      })
      .afterDismissed()
      .subscribe(() => this.dismissed.emit());
  }
}

@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container *ngIf="childComponentExists"></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  childComponentExists: boolean = true;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'arbitrary-component-with-template-ref',
  template: ` <ng-template let-data> Fries {{ localValue }} {{ data?.value }} </ng-template> `,
})
class ComponentWithTemplateRef {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  localValue: string;
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Burritos are on the way.</p>' })
class BurritosNotification {
  constructor(
    public notificationToastRef: SbbNotificationToastRef<BurritosNotification>,
    @Inject(SBB_NOTIFICATION_TOAST_DATA) public data: any
  ) {}
}

@Component({
  template: '',
  providers: [SbbNotificationToast],
})
class ComponentThatProvidesSbbNotificationToast {
  constructor(public notificationToast: SbbNotificationToast) {}
}

/**
 * Simple component to open notification toasts from.
 * Create a real (non-test) NgModule as a workaround forRoot
 * https://github.com/angular/angular/issues/10760
 */
const TEST_DIRECTIVES = [
  NotificationMockComponent,
  ComponentWithChildViewContainer,
  BurritosNotification,
  DirectiveWithViewContainer,
  ComponentWithTemplateRef,
];
@NgModule({
  imports: [CommonModule, NotificationToastModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [ComponentWithChildViewContainer, BurritosNotification],
})
class NotificationToastTestModule {}
