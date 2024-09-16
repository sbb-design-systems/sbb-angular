import { LiveAnnouncer } from '@angular/cdk/a11y';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Inject,
  NgModule,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import {
  SbbNotificationToast,
  SbbNotificationToastConfig,
  SbbNotificationToastContainer,
  SbbNotificationToastModule,
  SbbNotificationToastRef,
  SbbSimpleNotification,
  SBB_NOTIFICATION_TOAST_DATA,
  SBB_NOTIFICATION_TOAST_DEFAULT_OPTIONS,
} from './index';

describe('SbbNotificationToast icons', () => {
  let testFixture: ComponentFixture<NotificationMockComponent>;
  let testComponent: NotificationMockComponent;
  let overlayContainerElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotificationToastTestModule, NoopAnimationsModule, SbbIconTestingModule],
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
    expect(notifications.length)
      .withContext('Expected class .sbb-notification-toast-error to be assigned')
      .toBe(1);
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toMatch(/^sign-exclamation-point-sma/);
  });

  it('should have tick icon when type is SUCCESS', () => {
    testComponent.showNotification({ type: 'success' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll(
      '.sbb-notification-toast-success',
    );
    expect(notifications.length)
      .withContext('Expected class .sbb-notification-toast-success to be assigned')
      .toBe(1);
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toEqual('tick-small');
  });

  it('should have info icon when type is INFO', () => {
    testComponent.showNotification({ type: 'info' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-toast-info');
    expect(notifications.length)
      .withContext('Expected class .sbb-notification-toast-info to be assigned')
      .toBe(1);
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toEqual('circle-information-small');
  });

  it('should have warn icon when type is WARN', () => {
    testComponent.showNotification({ type: 'warn' });
    testFixture.detectChanges();
    const notifications = overlayContainerElement.querySelectorAll('.sbb-notification-toast-warn');
    expect(notifications.length)
      .withContext('Expected class .sbb-notification-toast-warn to be assigned')
      .toBe(1);
    const icons = overlayContainerElement.querySelectorAll('sbb-icon');
    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('ng-reflect-svg-icon')).toMatch(/^sign-exclamation-point-sma/);
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
      imports: [NotificationToastTestModule, NoopAnimationsModule, SbbIconTestingModule],
    }).compileComponents();
  }));

  beforeEach(inject(
    [SbbNotificationToast, LiveAnnouncer, OverlayContainer],
    (sb: SbbNotificationToast, la: LiveAnnouncer, oc: OverlayContainer) => {
      notificationToast = sb;
      liveAnnouncer = la;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    },
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
        'sbb-notification-toast-container',
      )!;
      expect(containerElement.getAttribute('role'))
        .withContext('Expected notification toast container to have role="alert"')
        .toBe('alert');
    },
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
        'sbb-notification-toast-container',
      )!;
      expect(containerElement.getAttribute('role'))
        .withContext('Expected notification toast container to have role="status"')
        .toBe('status');
    },
  );

  it('should have the role of `status` with a `polite` politeness', () => {
    notificationToast.openFromComponent(BurritosNotification, { politeness: 'polite' });
    viewContainerFixture.detectChanges();

    const containerElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
    )!;
    expect(containerElement.getAttribute('role'))
      .withContext('Expected notification toast container to have role="status"')
      .toBe('status');
  });

  it('should remove the role if the politeness is turned off', () => {
    notificationToast.openFromComponent(BurritosNotification, { politeness: 'off' });
    viewContainerFixture.detectChanges();

    const containerElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
    )!;
    expect(containerElement.getAttribute('role'))
      .withContext('Expected role to be removed')
      .toBeFalsy();
  });

  it('should open and close a notification toast without a ViewContainerRef', fakeAsync(() => {
    const notificationToastRef = notificationToast.open('Toast time!');
    viewContainerFixture.detectChanges();

    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
    )!;
    expect(messageElement.textContent)
      .withContext('Expected notification toast to show a message without a ViewContainerRef')
      .toContain('Toast time!');

    notificationToastRef.dismiss();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childNodes.length)
      .withContext('Expected notification toast to be dismissed without a ViewContainerRef')
      .toBe(0);
  }));

  it('should open a simple message', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);

    viewContainerFixture.detectChanges();

    expect(notificationToastRef.instance instanceof SbbSimpleNotification)
      .withContext(
        'Expected the notification toast content component to be SimpleNotificationComponent',
      )
      .toBe(true);
    expect(notificationToastRef.instance.notificationToastRef)
      .withContext(
        'Expected the notification toast reference to be placed in the component instance',
      )
      .toBe(notificationToastRef);

    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
    )!;
    expect(messageElement.textContent)
      .withContext(`Expected the notification toast message to be '${simpleMessage}'`)
      .toContain(simpleMessage);
  });

  it('should dismiss the notification toast and remove itself from the view', fakeAsync(() => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    const notificationToastRef = notificationToast.open(simpleMessage, config);
    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.childElementCount)
      .withContext('Expected overlay container element to have at least one child')
      .toBeGreaterThan(0);

    notificationToastRef.afterDismissed().subscribe({ complete: dismissCompleteSpy });

    notificationToastRef.dismiss();
    const messageElement = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
    )!;
    expect(messageElement.hasAttribute('sbb-exit'))
      .withContext(
        'Expected the notification toast container to have the "exit" attribute upon dismiss',
      )
      .toBe(true);

    viewContainerFixture.detectChanges(); // Run through animations for dismissal
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    expect(overlayContainerElement.childElementCount)
      .withContext('Expected the overlay container element to have no child elements')
      .toBe(0);
  }));

  it('should clear the announcement message if it is the same as main message', fakeAsync(() => {
    spyOn(liveAnnouncer, 'announce');

    notificationToast.open(simpleMessage, { announcementMessage: simpleMessage });
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount)
      .withContext('Expected the overlay with the default announcement message to be added')
      .toBe(1);

    expect(liveAnnouncer.announce).not.toHaveBeenCalled();
  }));

  it('should be able to specify a custom announcement message', fakeAsync(() => {
    spyOn(liveAnnouncer, 'announce');

    notificationToast.open(simpleMessage, {
      announcementMessage: 'Custom announcement',
      politeness: 'assertive',
    });
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount)
      .withContext('Expected the overlay with a custom `announcementMessage` to be added')
      .toBe(1);

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

    viewContainerFixture.componentInstance.childComponentExists.set(false);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.childElementCount)
      .withContext(
        'Expected notification toast to be removed after the view container was destroyed',
      )
      .toBe(0);
  }));

  it('should set the animation state to visible on entry', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);

    viewContainerFixture.detectChanges();
    const container = notificationToastRef.containerInstance as SbbNotificationToastContainer;
    expect(container._animationState)
      .withContext(`Expected the animation state would be 'visible'.`)
      .toBe('visible');
    notificationToastRef.dismiss();

    viewContainerFixture.detectChanges();
    expect(container._animationState)
      .withContext(`Expected the animation state would be 'hidden'.`)
      .toBe('hidden');
  });

  it('should set the animation state to complete on exit', () => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);
    notificationToastRef.dismiss();

    viewContainerFixture.detectChanges();
    const container = notificationToastRef.containerInstance as SbbNotificationToastContainer;
    expect(container._animationState)
      .withContext(`Expected the animation state would be 'hidden'.`)
      .toBe('hidden');
  });

  it(`should set the old notification toast animation state to complete and the new notification toast animation
      state to visible on entry of new notification toast`, fakeAsync(() => {
    const config: SbbNotificationToastConfig = { viewContainerRef: testViewContainerRef };
    const notificationToastRef = notificationToast.open(simpleMessage, config);
    const dismissCompleteSpy = jasmine.createSpy('dismiss complete spy');

    viewContainerFixture.detectChanges();
    const container1 = notificationToastRef.containerInstance as SbbNotificationToastContainer;
    expect(container1._animationState)
      .withContext(`Expected the animation state would be 'visible'.`)
      .toBe('visible');

    const config2 = { viewContainerRef: testViewContainerRef };
    const notificationToastRef2 = notificationToast.open(simpleMessage, config2);

    viewContainerFixture.detectChanges();
    notificationToastRef.afterDismissed().subscribe({ complete: dismissCompleteSpy });
    flush();

    expect(dismissCompleteSpy).toHaveBeenCalled();
    const container2 = notificationToastRef2.containerInstance as SbbNotificationToastContainer;
    expect(container1._animationState)
      .withContext(`Expected the animation state would be 'hidden'.`)
      .toBe('hidden');
    expect(container2._animationState)
      .withContext(`Expected the animation state would be 'visible'.`)
      .toBe('visible');
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
    const container = notificationToastRef.containerInstance as SbbNotificationToastContainer;
    expect(container._animationState)
      .withContext(`Expected the animation state would be 'visible'.`)
      .toBe('visible');
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

  it('should add extra classes to the container', () => {
    notificationToast.open(simpleMessage, { panelClass: ['one', 'two'] });
    viewContainerFixture.detectChanges();

    const containerClasses = overlayContainerElement.querySelector(
      'sbb-notification-toast-container',
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
        imports: [SbbNotificationToastModule, NoopAnimationsModule, SbbIconTestingModule],
      })
      .compileComponents();

    inject(
      [SbbNotificationToast, OverlayContainer],
      (sb: SbbNotificationToast, oc: OverlayContainer) => {
        notificationToast = sb;
        overlayContainer = oc;
        overlayContainerElement = oc.getContainerElement();
      },
    )();

    notificationToast.open(simpleMessage);
    flush();

    expect(
      overlayContainerElement.querySelector('sbb-notification-toast-container')!.classList,
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

  it('should only keep one snack bar in the DOM if multiple are opened at the same time', fakeAsync(() => {
    for (let i = 0; i < 10; i++) {
      notificationToast.open('Notification time!');
      viewContainerFixture.detectChanges();
    }

    flush();
    expect(
      overlayContainerElement.querySelectorAll('sbb-notification-toast-container').length,
    ).toBe(1);
  }));

  describe('with custom component', () => {
    it('should open a custom component', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification);

      expect(notificationToastRef.instance instanceof BurritosNotification)
        .withContext('Expected the notification toast content component to be BurritosNotification')
        .toBe(true);
      expect(overlayContainerElement.textContent!.trim())
        .withContext('Expected component to have the proper text.')
        .toBe('Burritos are on the way.');
    });

    it('should inject the notification toast reference into the component', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification);

      expect(notificationToastRef.instance.notificationToastRef)
        .withContext('Expected component to have an injected notification toast reference.')
        .toBe(notificationToastRef);
    });

    it('should be able to inject arbitrary user data', () => {
      const notificationToastRef = notificationToast.openFromComponent(BurritosNotification, {
        data: {
          burritoType: 'Chimichanga',
        },
      });

      expect(notificationToastRef.instance.data)
        .withContext('Expected component to have a data object.')
        .toBeTruthy();
      expect(notificationToastRef.instance.data.burritoType)
        .withContext('Expected the injected data object to be the one the user provided.')
        .toBe('Chimichanga');
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
      templateFixture.changeDetectorRef.markForCheck();
      templateFixture.detectChanges();

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container',
      )!;

      expect(containerElement.textContent).toContain('Fries');
      expect(containerElement.textContent).toContain('Pizza');

      templateFixture.componentInstance.localValue = 'Pasta';
      templateFixture.changeDetectorRef.markForCheck();
      templateFixture.detectChanges();

      expect(containerElement.textContent).toContain('Pasta');
    });

    it('should be able to pass in contextual data when opening with a TemplateRef', () => {
      notificationToast.openFromTemplate(templateFixture.componentInstance.templateRef, {
        data: { value: 'Oranges' },
      });

      const containerElement = overlayContainerElement.querySelector(
        'sbb-notification-toast-container',
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
      imports: [NotificationToastTestModule, NoopAnimationsModule, SbbIconTestingModule],
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
    },
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
    liveAnnouncer.ngOnDestroy();
  });

  it('should close notificationToasts opened by parent when opening from child', fakeAsync(() => {
    parentNotificationToast.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .withContext('Expected a notificationToast to be opened')
      .toContain('Pizza');

    childNotificationToast.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .withContext('Expected parent notification toast msg to be dismissed by opening from child')
      .toContain('Taco');
  }));

  it('should close notificationToasts opened by child when opening from parent', fakeAsync(() => {
    childNotificationToast.open('Pizza');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .withContext('Expected a notificationToast to be opened')
      .toContain('Pizza');

    parentNotificationToast.open('Taco');
    fixture.detectChanges();
    tick(1000);

    expect(overlayContainerElement.textContent)
      .withContext('Expected child notification toast msg to be dismissed by opening from parent')
      .toContain('Taco');
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
      imports: [NotificationToastTestModule, NoopAnimationsModule, SbbIconTestingModule],
    }).compileComponents();
  }));

  beforeEach(inject(
    [SbbNotificationToast, LiveAnnouncer, OverlayContainer],
    (sb: SbbNotificationToast, la: LiveAnnouncer, oc: OverlayContainer) => {
      notificationToast = sb;
      liveAnnouncer = la;
      overlayContainer = oc;
      overlayContainerEl = oc.getContainerElement();
    },
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
      'sbb-notification-toast-container',
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeFalsy();

    expect(overlayPaneEl.style.marginBottom)
      .withContext('Expected margin-bottom to be "0px"')
      .toBe('0px');
    expect(overlayPaneEl.style.marginTop).withContext('Expected margin-top to be ""').toBe('');
    expect(overlayPaneEl.style.marginRight).withContext('Expected margin-right to be ""').toBe('');
    expect(overlayPaneEl.style.marginLeft).withContext('Expected margin-left  to be ""').toBe('');
  }));

  it('should be in the bottom center', fakeAsync(() => {
    notificationToast.open(simpleMessage, {
      verticalPosition: 'bottom',
    });

    viewContainerFixture.detectChanges();
    flush();

    const containerEl = overlayContainerEl.querySelector(
      'sbb-notification-toast-container',
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeFalsy();
    expect(overlayPaneEl.style.marginBottom)
      .withContext('Expected margin-bottom to be "0px"')
      .toBe('0px');
    expect(overlayPaneEl.style.marginTop).withContext('Expected margin-top to be ""').toBe('');
    expect(overlayPaneEl.style.marginRight).withContext('Expected margin-right to be ""').toBe('');
    expect(overlayPaneEl.style.marginLeft).withContext('Expected margin-left  to be ""').toBe('');
  }));

  it('should be in the top center', fakeAsync(() => {
    notificationToast.open(simpleMessage, {
      verticalPosition: 'top',
    });

    viewContainerFixture.detectChanges();
    flush();

    const containerEl = overlayContainerEl.querySelector(
      'sbb-notification-toast-container',
    ) as HTMLElement;
    const overlayPaneEl = overlayContainerEl.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(containerEl.classList.contains('sbb-notification-toast-center')).toBeTruthy();
    expect(containerEl.classList.contains('sbb-notification-toast-top')).toBeTruthy();
    expect(overlayPaneEl.style.marginBottom)
      .withContext('Expected margin-bottom to be ""')
      .toBe('');
    expect(overlayPaneEl.style.marginTop)
      .withContext('Expected margin-top to be "0px"')
      .toBe('0px');
    expect(overlayPaneEl.style.marginRight).withContext('Expected margin-right to be ""').toBe('');
    expect(overlayPaneEl.style.marginLeft).withContext('Expected margin-left  to be ""').toBe('');
  }));
});

@Component({
  selector: 'sbb-notification-mock',
  template: '',
  standalone: true,
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

@Component({
  selector: 'arbitrary-component-with-template-ref',
  template: ` <ng-template let-data> Fries {{ localValue }} {{ data?.value }} </ng-template> `,
  standalone: true,
})
class ComponentWithTemplateRef {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  localValue: string;
}

/** Simple component for testing ComponentPortal. */
@Component({
  template: '<p>Burritos are on the way.</p>',
  standalone: true,
})
class BurritosNotification {
  constructor(
    public notificationToastRef: SbbNotificationToastRef<BurritosNotification>,
    @Inject(SBB_NOTIFICATION_TOAST_DATA) public data: any,
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
  imports: [SbbNotificationToastModule, ...TEST_DIRECTIVES],
  exports: TEST_DIRECTIVES,
})
class NotificationToastTestModule {}
