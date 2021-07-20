import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { A, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer, ScrollStrategy } from '@angular/cdk/overlay';
import { _supportsShadowDom } from '@angular/cdk/platform';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  Directive,
  Inject,
  Injector,
  NgModule,
  NgZone,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import {
  createKeyboardEvent,
  dispatchEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  patchElementFocus,
} from '@sbb-esta/angular/core/testing';
import { SbbDialogState } from '@sbb-esta/angular/dialog';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject } from 'rxjs';

import {
  SbbLightbox,
  SbbLightboxContainer,
  SbbLightboxModule,
  SbbLightboxRef,
  SBB_LIGHTBOX_DATA,
  SBB_LIGHTBOX_DEFAULT_OPTIONS,
} from './index';

describe('SbbLightbox', () => {
  let lightbox: SbbLightbox;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();
  let focusMonitor: FocusMonitor;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;
  let mockLocation: SpyLocation;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbLightboxModule, DialogTestModule],
      providers: [
        { provide: Location, useClass: SpyLocation },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject,
          }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [SbbLightbox, Location, OverlayContainer, FocusMonitor],
    (d: SbbLightbox, l: Location, oc: OverlayContainer, fm: FocusMonitor) => {
      lightbox = d;
      mockLocation = l as SpyLocation;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      focusMonitor = fm;
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should open a lightbox with a component', () => {
    const lightboxRef = lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(lightboxRef.componentInstance instanceof PizzaMsg).toBe(true);
    expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();
    const lightboxContainerElement =
      overlayContainerElement.querySelector('sbb-lightbox-container')!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should open a lightbox with a template', () => {
    const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRef);
    templateRefFixture.componentInstance.localValue = 'Bees';
    templateRefFixture.detectChanges();

    const data = { value: 'Knees' };

    const lightboxRef = lightbox.open(templateRefFixture.componentInstance.templateRef, { data });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Cheese Bees Knees');
    expect(templateRefFixture.componentInstance.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();

    const lightboxContainerElement =
      overlayContainerElement.querySelector('sbb-lightbox-container')!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');

    lightboxRef.close();
  });

  it('should emit when lightbox opening animation is complete', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    const spy = jasmine.createSpy('afterOpen spy');

    lightboxRef.afterOpened().subscribe(spy);

    viewContainerFixture.detectChanges();

    // callback should not be called before animation is complete
    expect(spy).not.toHaveBeenCalled();

    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));

  it('should use injector from viewContainerRef for DialogInjector', () => {
    const lightboxRef = lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    const lightboxInjector = lightboxRef.componentInstance.lightboxInjector;

    expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);
    expect(lightboxInjector.get<DirectiveWithViewContainer>(DirectiveWithViewContainer)).toBeTruthy(
      'Expected the lightbox component to be created with the injector from the viewContainerRef.'
    );
  });

  it('should open a lightbox with a component and no ViewContainerRef', () => {
    const lightboxRef = lightbox.open(PizzaMsg);

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(lightboxRef.componentInstance instanceof PizzaMsg).toBe(true);
    expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();
    const lightboxContainerElement =
      overlayContainerElement.querySelector('sbb-lightbox-container')!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should apply the configured role to the lightbox element', () => {
    lightbox.open(PizzaMsg, { role: 'alertdialog' });

    viewContainerFixture.detectChanges();

    const lightboxContainerElement =
      overlayContainerElement.querySelector('sbb-lightbox-container')!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('alertdialog');
  });

  it('should apply the specified `aria-describedby`', () => {
    lightbox.open(PizzaMsg, { ariaDescribedBy: 'description-element' });

    viewContainerFixture.detectChanges();

    const lightboxContainerElement =
      overlayContainerElement.querySelector('sbb-lightbox-container')!;
    expect(lightboxContainerElement.getAttribute('aria-describedby')).toBe('description-element');
  });

  it('should close a lightbox and get back a result', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    const afterCloseCallback = jasmine.createSpy('afterClose callback');

    lightboxRef.afterClosed().subscribe(afterCloseCallback);
    lightboxRef.close('Charmander');
    viewContainerFixture.detectChanges();
    flush();

    expect(afterCloseCallback).toHaveBeenCalledWith('Charmander');
    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should invoke the afterClosed callback inside the NgZone', fakeAsync(
    inject([NgZone], (zone: NgZone) => {
      const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
      const afterCloseCallback = jasmine.createSpy('afterClose callback');

      lightboxRef.afterClosed().subscribe(() => {
        afterCloseCallback(NgZone.isInAngularZone());
      });
      zone.run(() => {
        lightboxRef.close();
        viewContainerFixture.detectChanges();
        flush();
      });

      expect(afterCloseCallback).toHaveBeenCalledWith(true);
    })
  ));

  it('should dispose of lightbox if view container is destroyed while animating', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    viewContainerFixture.destroy();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it(
    'should dispatch the beforeClosed and afterClosed events when the ' +
      'overlay is detached externally',
    fakeAsync(
      inject([Overlay], (overlay: Overlay) => {
        const lightboxRef = lightbox.open(PizzaMsg, {
          viewContainerRef: testViewContainerRef,
          scrollStrategy: overlay.scrollStrategies.close(),
        });
        const beforeClosedCallback = jasmine.createSpy('beforeClosed callback');
        const afterCloseCallback = jasmine.createSpy('afterClosed callback');

        lightboxRef.beforeClosed().subscribe(beforeClosedCallback);
        lightboxRef.afterClosed().subscribe(afterCloseCallback);

        scrolledSubject.next();
        viewContainerFixture.detectChanges();
        flush();

        expect(beforeClosedCallback).toHaveBeenCalledTimes(1);
        expect(afterCloseCallback).toHaveBeenCalledTimes(1);
      })
    )
  );

  it('should close a lightbox and get back a result before it is closed', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    flush();
    viewContainerFixture.detectChanges();

    // beforeClose should emit before lightbox container is destroyed
    const beforeCloseHandler = jasmine.createSpy('beforeClose callback').and.callFake(() => {
      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).not.toBeNull(
        'lightbox container exists when beforeClose is called'
      );
    });

    lightboxRef.beforeClosed().subscribe(beforeCloseHandler);
    lightboxRef.close('Bulbasaur');
    viewContainerFixture.detectChanges();
    flush();

    expect(beforeCloseHandler).toHaveBeenCalledWith('Bulbasaur');
    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should close a lightbox via the escape key', fakeAsync(() => {
    lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    const event = dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
    expect(event.defaultPrevented).toBe(true);
  }));

  it('should not close a lightbox via the escape key with a modifier', fakeAsync(() => {
    lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
    dispatchEvent(document.body, event);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeTruthy();
    expect(event.defaultPrevented).toBe(false);
  }));

  it('should close from a ViewContainerRef with OnPush change detection', fakeAsync(() => {
    const onPushFixture = TestBed.createComponent(ComponentWithOnPushViewContainer);

    onPushFixture.detectChanges();

    const lightboxRef = lightbox.open(PizzaMsg, {
      viewContainerRef: onPushFixture.componentInstance.viewContainerRef,
    });

    flushMicrotasks();
    onPushFixture.detectChanges();
    flushMicrotasks();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(
      1,
      'Expected one open lightbox.'
    );

    lightboxRef.close();
    flushMicrotasks();
    onPushFixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(
      0,
      'Expected no open lightboxes.'
    );
  }));

  it('should close when clicking on the overlay backdrop', fakeAsync(() => {
    lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeFalsy();
  }));

  it('should emit the backdropClick stream when clicking on the overlay backdrop', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    const spy = jasmine.createSpy('backdropClick spy');
    lightboxRef.backdropClick().subscribe(spy);

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    expect(spy).toHaveBeenCalledTimes(1);

    viewContainerFixture.detectChanges();
    flush();

    // Additional clicks after the lightbox has closed should not be emitted
    backdrop.click();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should emit the keyboardEvent stream when key events target the overlay', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    const spy = jasmine.createSpy('keyboardEvent spy');
    lightboxRef.keydownEvents().subscribe(spy);

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    const container = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    ) as HTMLElement;
    dispatchKeyboardEvent(document.body, 'keydown', A);
    dispatchKeyboardEvent(backdrop, 'keydown', A);
    dispatchKeyboardEvent(container, 'keydown', A);

    expect(spy).toHaveBeenCalledTimes(3);
  }));

  it('should notify the observers if a lightbox has been opened', () => {
    lightbox.afterOpened.subscribe((ref) => {
      expect(
        lightbox.open(PizzaMsg, {
          viewContainerRef: testViewContainerRef,
        })
      ).toBe(ref);
    });
  });

  it('should notify the observers if all open lightboxes have finished closing', fakeAsync(() => {
    const ref1 = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    const ref2 = lightbox.open(ContentElementDialog, { viewContainerRef: testViewContainerRef });
    const spy = jasmine.createSpy('afterAllClosed spy');

    lightbox.afterAllClosed.subscribe(spy);

    ref1.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(spy).not.toHaveBeenCalled();

    ref2.close();
    viewContainerFixture.detectChanges();
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit the afterAllClosed stream on subscribe if there are no open lightboxes', () => {
    const spy = jasmine.createSpy('afterAllClosed spy');

    lightbox.afterAllClosed.subscribe(spy);

    expect(spy).toHaveBeenCalled();
  });

  it('should fall back to injecting the global direction if none is passed by the config', () => {
    const lightboxRef = lightbox.open(PizzaMsg, {});

    viewContainerFixture.detectChanges();

    expect(lightboxRef.componentInstance.directionality.value).toBe('ltr');
  });

  it('should use the passed in ViewContainerRef from the config', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    flush();

    // One view ref is for the container and one more for the component with the content.
    expect(testViewContainerRef.length).toBe(2);

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(testViewContainerRef.length).toBe(0);
  }));

  it('should close all of the lightboxes', fakeAsync(() => {
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(3);

    lightbox.closeAll();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should set the proper animation states', () => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    const lightboxContainer: SbbLightboxContainer = viewContainerFixture.debugElement.query(
      By.directive(SbbLightboxContainer)
    )!.componentInstance;

    expect(lightboxContainer._state).toBe('enter');

    lightboxRef.close();

    expect(lightboxContainer._state).toBe('exit');
  });

  it('should close all lightboxes when the user goes forwards/backwards in history', fakeAsync(() => {
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should close all open lightboxes when the location hash changes', fakeAsync(() => {
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateHashChange('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should close all of the lightboxes when the injectable is destroyed', fakeAsync(() => {
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(3);

    lightbox.ngOnDestroy();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should complete open and close streams when the injectable is destroyed', fakeAsync(() => {
    const afterOpenedSpy = jasmine.createSpy('after opened spy');
    const afterAllClosedSpy = jasmine.createSpy('after all closed spy');
    const afterOpenedSubscription = lightbox.afterOpened.subscribe({ complete: afterOpenedSpy });
    const afterAllClosedSubscription = lightbox.afterAllClosed.subscribe({
      complete: afterAllClosedSpy,
    });

    lightbox.ngOnDestroy();

    expect(afterOpenedSpy).toHaveBeenCalled();
    expect(afterAllClosedSpy).toHaveBeenCalled();

    afterOpenedSubscription.unsubscribe();
    afterAllClosedSubscription.unsubscribe();
  }));

  it('should allow the consumer to disable closing a lightbox on navigation', fakeAsync(() => {
    lightbox.open(PizzaMsg);
    lightbox.open(PizzaMsg, { closeOnNavigation: false });

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(1);
  }));

  it('should have the componentInstance available in the afterClosed callback', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg);
    const spy = jasmine.createSpy('afterClosed spy');

    flushMicrotasks();
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    lightboxRef.afterClosed().subscribe(() => {
      spy();
      expect(lightboxRef.componentInstance).toBeTruthy(
        'Expected component instance to be defined.'
      );
    });

    lightboxRef.close();

    flushMicrotasks();
    viewContainerFixture.detectChanges();
    tick(500);

    // Ensure that the callback actually fires.
    expect(spy).toHaveBeenCalled();
  }));

  it('should be able to attach a custom scroll strategy', fakeAsync(() => {
    const scrollStrategy: ScrollStrategy = {
      attach: () => {},
      enable: jasmine.createSpy('scroll strategy enable spy'),
      disable: () => {},
    };

    lightbox.open(PizzaMsg, { scrollStrategy });
    expect(scrollStrategy.enable).toHaveBeenCalled();
  }));

  it('should be able to pass in an alternate ComponentFactoryResolver', inject(
    [ComponentFactoryResolver],
    (resolver: ComponentFactoryResolver) => {
      spyOn(resolver, 'resolveComponentFactory').and.callThrough();

      lightbox.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        componentFactoryResolver: resolver,
      });
      viewContainerFixture.detectChanges();

      expect(resolver.resolveComponentFactory).toHaveBeenCalled();
    }
  ));

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      const config = {
        data: {
          stringParam: 'hello',
          dateParam: new Date(),
        },
      };

      const instance = lightbox.open(DialogWithInjectedData, config).componentInstance;

      expect(instance.data.stringParam).toBe(config.data.stringParam);
      expect(instance.data.dateParam).toBe(config.data.dateParam);
    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        const lightboxRef = lightbox.open(DialogWithInjectedData);
        expect(lightboxRef.componentInstance.data).toBeNull();
      }).not.toThrow();
    });
  });

  it('should not keep a reference to the component after the lightbox is closed', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg);

    expect(lightboxRef.componentInstance).toBeTruthy();

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(lightboxRef.componentInstance).toBeFalsy('Expected reference to have been cleared.');
  }));

  it('should assign a unique id to each lightbox', () => {
    const one = lightbox.open(PizzaMsg);
    const two = lightbox.open(PizzaMsg);

    expect(one.id).toBeTruthy();
    expect(two.id).toBeTruthy();
    expect(one.id).not.toBe(two.id);
  });

  it('should allow for the id to be overwritten', () => {
    const lightboxRef = lightbox.open(PizzaMsg, { id: 'pizza' });
    expect(lightboxRef.id).toBe('pizza');
  });

  it('should throw when trying to open a lightbox with the same id as another lightbox', () => {
    lightbox.open(PizzaMsg, { id: 'pizza' });
    expect(() => lightbox.open(PizzaMsg, { id: 'pizza' })).toThrowError(/must be unique/g);
  });

  it('should be able to find a lightbox by id', () => {
    const lightboxRef = lightbox.open(PizzaMsg, { id: 'pizza' });
    expect(lightbox.getDialogById('pizza')).toBe(lightboxRef);
  });

  it('should toggle `aria-hidden` on the overlay container siblings', fakeAsync(() => {
    const sibling = document.createElement('div');
    overlayContainerElement.parentNode!.appendChild(sibling);

    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    flush();

    expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to be hidden');
    expect(overlayContainerElement.hasAttribute('aria-hidden')).toBe(
      false,
      'Expected overlay container not to be hidden.'
    );

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(sibling.hasAttribute('aria-hidden')).toBe(
      false,
      'Expected sibling to no longer be hidden.'
    );
    sibling.parentNode!.removeChild(sibling);
  }));

  it('should restore `aria-hidden` to the overlay container siblings on close', fakeAsync(() => {
    const sibling = document.createElement('div');

    sibling.setAttribute('aria-hidden', 'true');
    overlayContainerElement.parentNode!.appendChild(sibling);

    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    flush();

    expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to be hidden.');

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to remain hidden.');
    sibling.parentNode!.removeChild(sibling);
  }));

  it('should not set `aria-hidden` on `aria-live` elements', fakeAsync(() => {
    const sibling = document.createElement('div');

    sibling.setAttribute('aria-live', 'polite');
    overlayContainerElement.parentNode!.appendChild(sibling);

    lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    flush();

    expect(sibling.hasAttribute('aria-hidden')).toBe(
      false,
      'Expected live element not to be hidden.'
    );
    sibling.parentNode!.removeChild(sibling);
  }));

  it('should add and remove classes while open', () => {
    const lightboxRef = lightbox.open(PizzaMsg, {
      disableClose: true,
      viewContainerRef: testViewContainerRef,
    });

    const pane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(pane.classList).not.toContain(
      'custom-class-one',
      'Expected class to be initially missing'
    );

    lightboxRef.addPanelClass('custom-class-one');
    expect(pane.classList).toContain('custom-class-one', 'Expected class to be added');

    lightboxRef.removePanelClass('custom-class-one');
    expect(pane.classList).not.toContain('custom-class-one', 'Expected class to be removed');
  });

  describe('disableClose option', () => {
    it('should prevent closing via clicks on the backdrop', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeTruthy();
    }));

    it('should prevent closing via the escape key', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeTruthy();
    }));

    it('should allow for the disableClose option to be updated while open', fakeAsync(() => {
      const lightboxRef = lightbox.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      backdrop.click();

      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeTruthy();

      lightboxRef.disableClose = false;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeFalsy();
    }));

    it('should recapture focus when clicking on the backdrop', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;
      const input = overlayContainerElement.querySelector('input') as HTMLInputElement;

      expect(document.activeElement).toBe(input, 'Expected input to be focused on open');

      input.blur(); // Programmatic clicks might not move focus so we simulate it.
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement).toBe(input, 'Expected input to stay focused after click');
    }));

    it(
      'should recapture focus to the container when clicking on the backdrop with ' +
        'autoFocus disabled',
      fakeAsync(() => {
        lightbox.open(PizzaMsg, {
          disableClose: true,
          viewContainerRef: testViewContainerRef,
          autoFocus: false,
        });

        viewContainerFixture.detectChanges();
        flushMicrotasks();

        const backdrop = overlayContainerElement.querySelector(
          '.cdk-overlay-backdrop'
        ) as HTMLElement;
        const container = overlayContainerElement.querySelector(
          '.sbb-lightbox-container'
        ) as HTMLInputElement;

        expect(document.activeElement).toBe(container, 'Expected container to be focused on open');

        container.blur(); // Programmatic clicks might not move focus so we simulate it.
        backdrop.click();
        viewContainerFixture.detectChanges();
        flush();

        expect(document.activeElement).toBe(
          container,
          'Expected container to stay focused after click'
        );
      })
    );
  });

  describe('panelClass option', () => {
    it('should have custom panel class', () => {
      lightbox.open(PizzaMsg, {
        panelClass: 'custom-panel-class',
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.custom-panel-class')).toBeTruthy();
    });
  });

  describe('focus management', () => {
    // When testing focus, all of the elements must be in the DOM.
    beforeEach(() => document.body.appendChild(overlayContainerElement));
    afterEach(() => document.body.removeChild(overlayContainerElement));

    it('should focus the first tabbable element of the lightbox on open', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'INPUT',
        'Expected first tabbable element (input) in the lightbox to be focused.'
      );
    }));

    it('should allow disabling focus of the first tabbable element', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        autoFocus: false,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).not.toBe('INPUT');
    }));

    it('should attach the focus trap even if automatic focus is disabled', fakeAsync(() => {
      lightbox.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        autoFocus: false,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(
        overlayContainerElement.querySelectorAll('.cdk-focus-trap-anchor').length
      ).toBeGreaterThan(0);
    }));

    it('should re-focus trigger element when lightbox closes', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      button.id = 'dialog-trigger';
      document.body.appendChild(button);
      button.focus();

      const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected the focus to change when lightbox was opened.'
      );

      lightboxRef.close();
      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expcted the focus not to have changed before the animation finishes.'
      );

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(document.activeElement!.id).toBe(
        'dialog-trigger',
        'Expected that the trigger was refocused after the lightbox is closed.'
      );

      document.body.removeChild(button);
    }));

    it('should re-focus trigger element inside the shadow DOM when lightbox closes', fakeAsync(() => {
      if (!_supportsShadowDom()) {
        return;
      }

      viewContainerFixture.destroy();
      const fixture = TestBed.createComponent(ShadowDomComponent);
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('button'))!.nativeElement;

      button.focus();

      const lightboxRef = lightbox.open(PizzaMsg);
      flushMicrotasks();
      fixture.detectChanges();
      flushMicrotasks();

      const spy = spyOn(button, 'focus').and.callThrough();
      lightboxRef.close();
      flushMicrotasks();
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('should re-focus the trigger via keyboard when closed via escape key', fakeAsync(() => {
      const button = document.createElement('button');
      let lastFocusOrigin: FocusOrigin = null;

      focusMonitor
        .monitor(button, false)
        .subscribe((focusOrigin) => (lastFocusOrigin = focusOrigin));

      document.body.appendChild(button);
      button.focus();

      // Patch the element focus after the initial and real focus, because otherwise the
      // `activeElement` won't be set, and the lightbox won't be able to restore focus to an element.
      patchElementFocus(button);

      lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();
      expect(lastFocusOrigin!).toBeNull('Expected the trigger button to be blurred');

      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(lastFocusOrigin!).toBe(
        'keyboard',
        'Expected the trigger button to be focused via keyboard'
      );

      focusMonitor.stopMonitoring(button);
      document.body.removeChild(button);
    }));

    it('should re-focus the trigger via mouse when backdrop has been clicked', fakeAsync(() => {
      const button = document.createElement('button');
      let lastFocusOrigin: FocusOrigin = null;

      focusMonitor
        .monitor(button, false)
        .subscribe((focusOrigin) => (lastFocusOrigin = focusOrigin));

      document.body.appendChild(button);
      button.focus();

      // Patch the element focus after the initial and real focus, because otherwise the
      // `activeElement` won't be set, and the lightbox won't be able to restore focus to an element.
      patchElementFocus(button);

      lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();
      expect(lastFocusOrigin!).toBeNull('Expected the trigger button to be blurred');

      const backdrop = overlayContainerElement.querySelector(
        '.cdk-overlay-backdrop'
      ) as HTMLElement;

      backdrop.click();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(lastFocusOrigin!).toBe('mouse', 'Expected the trigger button to be focused via mouse');

      focusMonitor.stopMonitoring(button);
      document.body.removeChild(button);
    }));

    it('should re-focus via keyboard if the close button has been triggered through keyboard', fakeAsync(() => {
      const button = document.createElement('button');
      let lastFocusOrigin: FocusOrigin = null;

      focusMonitor
        .monitor(button, false)
        .subscribe((focusOrigin) => (lastFocusOrigin = focusOrigin));

      document.body.appendChild(button);
      button.focus();

      // Patch the element focus after the initial and real focus, because otherwise the
      // `activeElement` won't be set, and the lightbox won't be able to restore focus to an element.
      patchElementFocus(button);

      lightbox.open(ContentElementDialog, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();
      expect(lastFocusOrigin!).toBeNull('Expected the trigger button to be blurred');

      const closeButton = overlayContainerElement.querySelector(
        'button[sbb-lightbox-close]'
      ) as HTMLElement;

      // Fake the behavior of pressing the SPACE key on a button element. Browsers fire a `click`
      // event with a MouseEvent, which has coordinates that are out of the element boundaries.
      dispatchMouseEvent(closeButton, 'click', 0, 0);

      viewContainerFixture.detectChanges();
      tick(500);

      expect(lastFocusOrigin!).toBe(
        'keyboard',
        'Expected the trigger button to be focused via keyboard'
      );

      focusMonitor.stopMonitoring(button);
      document.body.removeChild(button);
    }));

    it('should re-focus via mouse if the close button has been clicked', fakeAsync(() => {
      const button = document.createElement('button');
      let lastFocusOrigin: FocusOrigin = null;

      focusMonitor
        .monitor(button, false)
        .subscribe((focusOrigin) => (lastFocusOrigin = focusOrigin));

      document.body.appendChild(button);
      button.focus();

      // Patch the element focus after the initial and real focus, because otherwise the
      // `activeElement` won't be set, and the lightbox won't be able to restore focus to an element.
      patchElementFocus(button);

      lightbox.open(ContentElementDialog, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();
      expect(lastFocusOrigin!).toBeNull('Expected the trigger button to be blurred');

      const closeButton = overlayContainerElement.querySelector(
        'button[sbb-lightbox-close]'
      ) as HTMLElement;

      // The lightbox close button detects the focus origin by inspecting the click event. If
      // coordinates of the click are not present, it assumes that the click has been triggered
      // by keyboard.
      dispatchMouseEvent(closeButton, 'click', 10, 10);

      viewContainerFixture.detectChanges();
      tick(500);

      expect(lastFocusOrigin!).toBe('mouse', 'Expected the trigger button to be focused via mouse');

      focusMonitor.stopMonitoring(button);
      document.body.removeChild(button);
    }));

    it('should allow the consumer to shift focus in afterClosed', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      const input = document.createElement('input');

      button.id = 'dialog-trigger';
      input.id = 'input-to-be-focused';

      document.body.appendChild(button);
      document.body.appendChild(input);
      button.focus();

      const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();

      lightboxRef.afterClosed().subscribe(() => input.focus());
      lightboxRef.close();

      tick(500);
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id).toBe(
        'input-to-be-focused',
        'Expected that the trigger was refocused after the lightbox is closed.'
      );

      document.body.removeChild(button);
      document.body.removeChild(input);
      flush();
    }));

    it('should move focus to the container if there are no focusable elements in the lightbox', fakeAsync(() => {
      lightbox.open(DialogWithoutFocusableElements);

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'SBB-LIGHTBOX-CONTAINER',
        'Expected lightbox container to be focused.'
      );
    }));

    it('should be able to disable focus restoration', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      button.id = 'dialog-trigger';
      document.body.appendChild(button);
      button.focus();

      const lightboxRef = lightbox.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        restoreFocus: false,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected the focus to change when lightbox was opened.'
      );

      lightboxRef.close();
      flushMicrotasks();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected focus not to have been restored.'
      );

      document.body.removeChild(button);
    }));

    it('should not move focus if it was moved outside the lightbox while animating', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      const otherButton = document.createElement('button');
      const body = document.body;
      button.id = 'dialog-trigger';
      otherButton.id = 'other-button';
      body.appendChild(button);
      body.appendChild(otherButton);
      button.focus();

      const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected the focus to change when lightbox was opened.'
      );

      // Start the closing sequence and move focus out of lightbox.
      lightboxRef.close();
      otherButton.focus();

      expect(document.activeElement!.id).toBe(
        'other-button',
        'Expected focus to be on the alternate button.'
      );

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id).toBe(
        'other-button',
        'Expected focus to stay on the alternate button.'
      );

      body.removeChild(button);
      body.removeChild(otherButton);
    }));
  });

  describe('lightbox content elements', () => {
    let lightboxRef: SbbLightboxRef<any>;

    describe('inside component lightbox', () => {
      beforeEach(fakeAsync(() => {
        lightboxRef = lightbox.open(ContentElementDialog, {
          viewContainerRef: testViewContainerRef,
        });
        viewContainerFixture.detectChanges();
        flush();
      }));

      runContentElementTests();
    });

    describe('inside template portal', () => {
      beforeEach(fakeAsync(() => {
        const fixture = TestBed.createComponent(ComponentWithContentElementTemplateRef);
        fixture.detectChanges();

        lightboxRef = lightbox.open(fixture.componentInstance.templateRef, {
          viewContainerRef: testViewContainerRef,
        });

        viewContainerFixture.detectChanges();
        flush();
      }));

      runContentElementTests();
    });

    function runContentElementTests() {
      it('should close the lightbox when clicking on the close button', fakeAsync(() => {
        expect(overlayContainerElement.querySelectorAll('.sbb-lightbox-container').length).toBe(1);

        (
          overlayContainerElement.querySelector('button[sbb-lightbox-close]') as HTMLElement
        ).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelectorAll('.sbb-lightbox-container').length).toBe(0);
      }));

      it('should not close if [sbb-lightbox-close] is applied on a non-button node', () => {
        expect(overlayContainerElement.querySelectorAll('.sbb-lightbox-container').length).toBe(1);

        (overlayContainerElement.querySelector('div[sbb-lightbox-close]') as HTMLElement).click();

        expect(overlayContainerElement.querySelectorAll('.sbb-lightbox-container').length).toBe(1);
      });

      it('should allow for a user-specified aria-label on the close button', fakeAsync(() => {
        const button = overlayContainerElement.querySelector('.close-with-aria-label')!;

        expect(button.getAttribute('aria-label')).toBe('Best close button ever');
      }));

      it('should set the "type" attribute of the close button if not set manually', () => {
        const button = overlayContainerElement.querySelector('button[sbb-lightbox-close]')!;

        expect(button.getAttribute('type')).toBe('button');
      });

      it('should not override type attribute of the close button if set manually', () => {
        const button = overlayContainerElement.querySelector('button.with-submit')!;

        expect(button.getAttribute('type')).toBe('submit');
      });

      it('should return the [sbb-lightbox-close] result when clicking the close button', fakeAsync(() => {
        const afterCloseCallback = jasmine.createSpy('afterClose callback');
        lightboxRef.afterClosed().subscribe(afterCloseCallback);

        (overlayContainerElement.querySelector('button.close-with-true') as HTMLElement).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(afterCloseCallback).toHaveBeenCalledWith(true);
      }));

      it('should set the aria-labelledby attribute to the id of the title', fakeAsync(() => {
        const title = overlayContainerElement.querySelector('[sbb-lightbox-title]')!;
        const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;

        flush();
        viewContainerFixture.detectChanges();

        expect(title.id).toBeTruthy('Expected title element to have an id.');
        expect(container.getAttribute('aria-labelledby')).toBe(
          title.id,
          'Expected the aria-labelledby to match the title id.'
        );
      }));
    }
  });

  describe('aria-labelledby', () => {
    it('should be able to set a custom aria-labelledby', () => {
      lightbox.open(PizzaMsg, {
        ariaLabelledBy: 'Labelled By',
        viewContainerRef: testViewContainerRef,
      });
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
      expect(container.getAttribute('aria-labelledby')).toBe('Labelled By');
    });

    it(
      'should not set the aria-labelledby automatically if it has an aria-label ' +
        'and an aria-labelledby',
      fakeAsync(() => {
        lightbox.open(ContentElementDialog, {
          ariaLabel: 'Hello there',
          ariaLabelledBy: 'Labelled By',
          viewContainerRef: testViewContainerRef,
        });
        viewContainerFixture.detectChanges();
        tick();
        viewContainerFixture.detectChanges();

        const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
        expect(container.hasAttribute('aria-labelledby')).toBe(false);
      })
    );

    it(
      'should set the aria-labelledby attribute to the config provided aria-labelledby ' +
        'instead of the sbb-lightbox-title id',
      fakeAsync(() => {
        lightbox.open(ContentElementDialog, {
          ariaLabelledBy: 'Labelled By',
          viewContainerRef: testViewContainerRef,
        });
        viewContainerFixture.detectChanges();
        flush();
        const title = overlayContainerElement.querySelector('[sbb-lightbox-title]')!;
        const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
        flush();
        viewContainerFixture.detectChanges();

        expect(title.id).toBeTruthy('Expected title element to have an id.');
        expect(container.getAttribute('aria-labelledby')).toBe('Labelled By');
      })
    );
  });

  describe('aria-label', () => {
    it('should be able to set a custom aria-label', () => {
      lightbox.open(PizzaMsg, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef,
      });
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
      expect(container.getAttribute('aria-label')).toBe('Hello there');
    });

    it('should not set the aria-labelledby automatically if it has an aria-label', fakeAsync(() => {
      lightbox.open(ContentElementDialog, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef,
      });
      viewContainerFixture.detectChanges();
      tick();
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
      expect(container.hasAttribute('aria-labelledby')).toBe(false);
    }));
  });

  it('should dispose backdrop if containing lightbox view is destroyed', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeDefined();

    lightboxRef.close();
    viewContainerFixture.componentInstance.showChildView = false;
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBe(null);
  }));
});

describe('SbbLightbox with a parent SbbLightbox', () => {
  let parentDialog: SbbLightbox;
  let childDialog: SbbLightbox;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesSbbLightbox>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbLightboxModule, DialogTestModule],
      declarations: [ComponentThatProvidesSbbLightbox],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
        { provide: Location, useClass: SpyLocation },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([SbbLightbox], (d: SbbLightbox) => {
    parentDialog = d;

    fixture = TestBed.createComponent(ComponentThatProvidesSbbLightbox);
    childDialog = fixture.componentInstance.lightbox;
    fixture.detectChanges();
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
  });

  it('should close lightboxes opened by a parent when calling closeAll on a child SbbLightbox', fakeAsync(() => {
    parentDialog.open(PizzaMsg);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );

    childDialog.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on child SbbLightbox to close lightbox opened by parent'
    );
  }));

  it('should close lightboxes opened by a child when calling closeAll on a parent SbbLightbox', fakeAsync(() => {
    childDialog.open(PizzaMsg);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );

    parentDialog.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on parent SbbLightbox to close lightbox opened by child'
    );
  }));

  it('should close the top lightbox via the escape key', fakeAsync(() => {
    childDialog.open(PizzaMsg);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should not close the parent lightboxes when a child is destroyed', fakeAsync(() => {
    parentDialog.open(PizzaMsg);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );

    childDialog.ngOnDestroy();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );
  }));
});

describe('SbbLightbox with default options', () => {
  let lightbox: SbbLightbox;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(fakeAsync(() => {
    const defaultConfig = {
      hasBackdrop: false,
      disableClose: true,
      width: '100px',
      height: '100px',
      minWidth: '50px',
      minHeight: '50px',
      maxWidth: '150px',
      maxHeight: '150px',
      autoFocus: false,
    };

    TestBed.configureTestingModule({
      imports: [SbbLightboxModule, DialogTestModule],
      providers: [{ provide: SBB_LIGHTBOX_DEFAULT_OPTIONS, useValue: defaultConfig }],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([SbbLightbox, OverlayContainer], (d: SbbLightbox, oc: OverlayContainer) => {
    lightbox = d;
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should use the provided defaults', () => {
    lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeFalsy();

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeTruthy();

    expect(document.activeElement!.tagName).not.toBe('INPUT');

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(overlayPane.style.width).toBe('');
    expect(overlayPane.style.height).toBe('');
    expect(overlayPane.style.minWidth).toBe('100vw');
    expect(overlayPane.style.minHeight).toBe('100vh');
    expect(overlayPane.style.maxWidth).toBe('100vw');
    expect(overlayPane.style.maxHeight).toBe('100vh');
  });

  it('should be overridable by open() options', fakeAsync(() => {
    lightbox.open(PizzaMsg, {
      disableClose: false,
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeFalsy();
  }));
});

describe('SbbLightbox with animations enabled', () => {
  let lightbox: SbbLightbox;
  let overlayContainer: OverlayContainer;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [SbbLightboxModule, DialogTestModule, BrowserAnimationsModule],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([SbbLightbox, OverlayContainer], (d: SbbLightbox, oc: OverlayContainer) => {
    lightbox = d;
    overlayContainer = oc;

    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);
    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should return the current state of the lightbox', fakeAsync(() => {
    const lightboxRef = lightbox.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    // Duration of the close animation in milliseconds. Extracted from the
    // Angular animations definition of the lightbox.
    const lightboxCloseDuration = 75;

    expect(lightboxRef.getState()).toBe(SbbDialogState.OPEN);
    lightboxRef.close();
    viewContainerFixture.detectChanges();

    expect(lightboxRef.getState()).toBe(SbbDialogState.CLOSING);

    // Ensure that the closing state is still set if half of the animation has
    // passed by. The lightbox state should be only set to `closed` when the lightbox
    // finished the close animation.
    tick(lightboxCloseDuration / 2);
    expect(lightboxRef.getState()).toBe(SbbDialogState.CLOSING);

    // Flush the remaining duration of the closing animation. We flush all other remaining
    // tasks (e.g. the fallback close timeout) to avoid fakeAsync pending timer failures.
    flush();
    expect(lightboxRef.getState()).toBe(SbbDialogState.CLOSED);
  }));
});

@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'hello',
})
class ComponentWithOnPushViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container *ngIf="showChildView"></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  showChildView = true;

  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'arbitrary-component-with-template-ref',
  template: `<ng-template let-data let-lightboxRef="lightboxRef">
    Cheese {{ localValue }} {{ data?.value }}{{ setDialogRef(lightboxRef) }}</ng-template
  >`,
})
class ComponentWithTemplateRef {
  localValue: string;
  lightboxRef: SbbLightboxRef<any>;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  setDialogRef(lightboxRef: SbbLightboxRef<any>): string {
    this.lightboxRef = lightboxRef;
    return '';
  }
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Pizza</p> <input> <button>Close</button>' })
class PizzaMsg {
  constructor(
    public lightboxRef: SbbLightboxRef<PizzaMsg>,
    public lightboxInjector: Injector,
    public directionality: Directionality
  ) {}
}

@Component({
  template: `
    <h1 sbb-lightbox-title>This is the title</h1>
    <sbb-lightbox-content>Lorem ipsum dolor sit amet.</sbb-lightbox-content>
    <sbb-lightbox-actions>
      <button sbb-lightbox-close>Close</button>
      <button class="close-with-true" [sbb-lightbox-close]="true">Close and return true</button>
      <button
        class="close-with-aria-label"
        aria-label="Best close button ever"
        [sbb-lightbox-close]="true"
      ></button>
      <div sbb-lightbox-close>Should not close</div>
      <button class="with-submit" type="submit" sbb-lightbox-close>Should have submit</button>
    </sbb-lightbox-actions>
  `,
})
class ContentElementDialog {}

@Component({
  template: `
    <ng-template>
      <h1 sbb-lightbox-title>This is the title</h1>
      <sbb-lightbox-content>Lorem ipsum dolor sit amet.</sbb-lightbox-content>
      <sbb-lightbox-actions>
        <button sbb-lightbox-close>Close</button>
        <button class="close-with-true" [sbb-lightbox-close]="true">Close and return true</button>
        <button
          class="close-with-aria-label"
          aria-label="Best close button ever"
          [sbb-lightbox-close]="true"
        ></button>
        <div sbb-lightbox-close>Should not close</div>
        <button class="with-submit" type="submit" sbb-lightbox-close>Should have submit</button>
      </sbb-lightbox-actions>
    </ng-template>
  `,
})
class ComponentWithContentElementTemplateRef {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
}

@Component({
  template: '',
  providers: [SbbLightbox],
})
class ComponentThatProvidesSbbLightbox {
  constructor(public lightbox: SbbLightbox) {}
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '' })
class DialogWithInjectedData {
  constructor(@Inject(SBB_LIGHTBOX_DATA) public data: any) {}
}

@Component({ template: '<p>Pasta</p>' })
class DialogWithoutFocusableElements {}

@Component({
  template: `<button>I'm a button</button>`,
  encapsulation: ViewEncapsulation.ShadowDom,
})
class ShadowDomComponent {}

// Create a real (non-test) NgModule as a workaround for
// https://github.com/angular/angular/issues/10760
const TEST_DIRECTIVES = [
  ComponentWithChildViewContainer,
  ComponentWithTemplateRef,
  PizzaMsg,
  DirectiveWithViewContainer,
  ComponentWithOnPushViewContainer,
  ContentElementDialog,
  DialogWithInjectedData,
  DialogWithoutFocusableElements,
  ComponentWithContentElementTemplateRef,
  ShadowDomComponent,
];

@NgModule({
  imports: [SbbLightboxModule, SbbIconTestingModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    ComponentWithChildViewContainer,
    ComponentWithTemplateRef,
    PizzaMsg,
    ContentElementDialog,
    DialogWithInjectedData,
    DialogWithoutFocusableElements,
  ],
})
class DialogTestModule {}
