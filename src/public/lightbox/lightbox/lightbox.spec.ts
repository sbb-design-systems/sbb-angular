import { A, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer, ScrollDispatcher } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Inject,
  Injector,
  NgModule,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Lightbox, LIGHTBOX_DATA, LightboxModule, LightboxRef } from '../public-api';

import { LightboxContainerComponent } from './lightbox-container.component';

// tslint:disable:i18n
@Directive({ selector: '[sbbDirWithViewContainer]' })
class DirectiveWithViewContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'hello'
})
class ComponentWithOnPushViewContainerComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'sbb-arbitrary-component',
  template: `
    <div sbbDirWithViewContainer></div>
  `
})
class ComponentWithChildViewContainerComponent {
  @ViewChild(DirectiveWithViewContainerDirective, { static: true })
  childWithViewContainer: DirectiveWithViewContainerDirective;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'sbb-rbitrary-component-with-template-ref',
  template: `
    <ng-template let-data let-lightboxRef="lightboxRef">
      Cheese {{ localValue }} {{ data?.value }}{{ setLightboxRef(lightboxRef) }}</ng-template
    >
  `
})
class ComponentWithTemplateRefComponent {
  localValue: string;
  lightboxRef: LightboxRef<any>;

  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;

  setLightboxRef(lightboxRef: LightboxRef<any>): string {
    this.lightboxRef = lightboxRef;
    return '';
  }
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Pizza</p> <input> <button>Close</button>' })
class PizzaMsgComponent {
  constructor(
    public lightboxRef: LightboxRef<PizzaMsgComponent>,
    public lightboxInjector: Injector
  ) {}
}

@Component({
  template: `
    <h1 sbbLightboxTitle>This is the title</h1>
    <sbb-lightbox-content>Lorem ipsum dolor sit amet.</sbb-lightbox-content>
    <sbb-lightbox-footer>
      <button sbbLightboxClose>Close</button>
      <button class="close-with-true" [sbbLightboxClose]="true">
        Close and return true
      </button>
      <button
        class="close-with-aria-label"
        aria-label="Best close button ever"
        [sbbLightboxClose]="true"
      >
        Close
      </button>
      <div sbbLightboxClose>Should not close</div>
    </sbb-lightbox-footer>
  `
})
class ContentElementLightboxComponent {}

@Component({
  template: `
    <ng-template>
      <h1 sbbLightboxTitle>This is the title</h1>
      <sbb-lightbox-content>Lorem ipsum dolor sit amet.</sbb-lightbox-content>
      <sbb-lightbox-footer>
        <button sbbLightboxClose>Close</button>
        <button class="close-with-true" [sbbLightboxClose]="true">
          Close and return true
        </button>
        <button
          class="close-with-aria-label"
          aria-label="Best close button ever"
          [sbbLightboxClose]="true"
        >
          Close
        </button>
        <div sbbLightboxClose>Should not close</div>
      </sbb-lightbox-footer>
    </ng-template>
  `
})
class ComponentWithContentElementTemplateRefComponent {
  @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;
}

@Component({
  template: '',
  providers: [Lightbox]
})
class ComponentThatProvidesLightboxComponent {
  constructor(public lightbox: Lightbox) {}
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '' })
class LightboxWithInjectedDataComponent {
  constructor(@Inject(LIGHTBOX_DATA) public data: any) {}
}

@Component({ template: '<p>Pasta</p>' })
class LightboxWithoutFocusableElementsComponent {}

// Create a real (non-test) NgModule as a workaround for
// https://github.com/angular/angular/issues/10760
const TEST_DIRECTIVES = [
  ComponentWithChildViewContainerComponent,
  ComponentWithTemplateRefComponent,
  PizzaMsgComponent,
  DirectiveWithViewContainerDirective,
  ComponentWithOnPushViewContainerComponent,
  ContentElementLightboxComponent,
  LightboxWithInjectedDataComponent,
  LightboxWithoutFocusableElementsComponent,
  ComponentWithContentElementTemplateRefComponent
];

@NgModule({
  imports: [LightboxModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    ComponentWithChildViewContainerComponent,
    ComponentWithTemplateRefComponent,
    PizzaMsgComponent,
    ContentElementLightboxComponent,
    LightboxWithInjectedDataComponent,
    LightboxWithoutFocusableElementsComponent
  ]
})
class LightboxTestModule {}

describe('Lightbox', () => {
  let lightbox: Lightbox;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainerComponent>;
  let mockLocation: SpyLocation;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [LightboxModule, LightboxTestModule],
      providers: [
        { provide: Location, useClass: SpyLocation },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
            register() {},
            deregister() {}
          })
        }
      ]
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [Lightbox, Location, OverlayContainer],
    (l: Lightbox, loc: Location, oc: OverlayContainer) => {
      lightbox = l;
      mockLocation = loc as SpyLocation;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }
  ));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainerComponent);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should open a lightbox with a component', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(lightboxRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
    expect(lightboxRef.componentInstance!.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();
    const lightboxContainerElement = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    )!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should open a lightbox with a template', () => {
    const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRefComponent);
    templateRefFixture.componentInstance.localValue = 'Bees';
    templateRefFixture.detectChanges();

    const data = { value: 'Knees' };

    const lightboxRef = lightbox.openLightbox(templateRefFixture.componentInstance.templateRef, {
      data
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Cheese Bees Knees');
    expect(templateRefFixture.componentInstance.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();

    const lightboxContainerElement = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    )!;
    expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');

    lightboxRef.close();
  });

  it('should emit when lightbox opening animation is complete', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });
    const spy = jasmine.createSpy('afterOpen spy');

    lightboxRef.afterOpen().subscribe(spy);

    viewContainerFixture.detectChanges();

    // callback should not be called before animation is complete
    expect(spy).not.toHaveBeenCalled();

    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));

  it('should use injector from viewContainerRef for lightboxInjector', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });

    viewContainerFixture.detectChanges();

    const lightboxInjector = lightboxRef.componentInstance!.lightboxInjector;

    expect(lightboxRef.componentInstance!.lightboxRef).toBe(lightboxRef);
    expect(
      lightboxInjector.get<DirectiveWithViewContainerDirective>(DirectiveWithViewContainerDirective)
    ).toBeTruthy(
      'Expected the lightbox component to be created with the injector from the viewContainerRef.'
    );
  });

  it('should open a lightbox with a component and no ViewContainerRef', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent);

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(lightboxRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
    expect(lightboxRef.componentInstance!.lightboxRef).toBe(lightboxRef);

    viewContainerFixture.detectChanges();
    const lightboxContainerElement = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    );
    expect(lightboxContainerElement!.getAttribute('role')).toBe('dialog');
  });

  it('should apply the configured role to the lightbox element', () => {
    lightbox.openLightbox(PizzaMsgComponent, { role: 'alertdialog' });

    viewContainerFixture.detectChanges();

    const lightboxContainerElement = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    );
    expect(lightboxContainerElement!.getAttribute('role')).toBe('alertdialog');
  });

  it('should apply the specified `aria-describedby`', () => {
    lightbox.openLightbox(PizzaMsgComponent, {
      ariaDescribedBy: 'description-element'
    });

    viewContainerFixture.detectChanges();

    const lightboxContainerElement = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    );
    expect(lightboxContainerElement!.getAttribute('aria-describedby')).toBe('description-element');
  });

  it('should close a lightbox and get back a result', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });
    const afterCloseCallback = jasmine.createSpy('afterClose callback');

    lightboxRef.afterClosed().subscribe(afterCloseCallback);
    lightboxRef.close('Goofy');
    viewContainerFixture.detectChanges();
    flush();

    expect(afterCloseCallback).toHaveBeenCalledWith('Goofy');
    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should dispatch the beforeClose and afterClose events when the overlay is detached externally', fakeAsync(
    inject([Overlay], (overlay: Overlay) => {
      const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
        scrollStrategy: overlay.scrollStrategies.close()
      });
      const beforeCloseCallback = jasmine.createSpy('beforeClosed callback');
      const afterCloseCallback = jasmine.createSpy('afterClosed callback');

      lightboxRef.beforeClose().subscribe(beforeCloseCallback);
      lightboxRef.afterClosed().subscribe(afterCloseCallback);

      scrolledSubject.next();
      viewContainerFixture.detectChanges();
      flush();

      expect(beforeCloseCallback).toHaveBeenCalledTimes(1);
      expect(afterCloseCallback).toHaveBeenCalledTimes(1);
    })
  ));

  it('should close a lightbox and get back a result before it is closed', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });

    flush();
    viewContainerFixture.detectChanges();

    // beforeClose should emit before lightbox container is destroyed
    const beforeCloseHandler = jasmine.createSpy('beforeClose callback').and.callFake(() => {
      expect(overlayContainerElement.querySelector('sbb-lightbox-container')).not.toBeNull(
        'lightbox container exists when beforeClose is called'
      );
    });

    lightboxRef.beforeClose().subscribe(beforeCloseHandler);
    lightboxRef.close('Bulbasaur');
    viewContainerFixture.detectChanges();
    flush();

    expect(beforeCloseHandler).toHaveBeenCalledWith('Bulbasaur');
    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should close a lightbox via the escape key', fakeAsync(() => {
    lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));

  it('should close from a ViewContainerRef with OnPush change detection', fakeAsync(() => {
    const onPushFixture = TestBed.createComponent(ComponentWithOnPushViewContainerComponent);

    onPushFixture.detectChanges();

    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: onPushFixture.componentInstance.viewContainerRef
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

  it('should emit the keyboardEvent stream when key events target the overlay', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });

    const spy = jasmine.createSpy('keyboardEvent spy');
    lightboxRef.keydownEvents().subscribe(spy);

    viewContainerFixture.detectChanges();

    const container = overlayContainerElement.querySelector(
      'sbb-lightbox-container'
    ) as HTMLElement;
    dispatchKeyboardEvent(document.body, 'keydown', A);
    dispatchKeyboardEvent(document.body, 'keydown', A, undefined, container);

    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should notify the observers if a lightbox has been opened', done => {
    let lightboxRef: LightboxRef<any>;

    lightbox.afterOpen.pipe(delay(0)).subscribe(ref => {
      expect(lightboxRef).toBe(ref);
      done();
    });

    lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });
  });

  it('should notify the observers if all open lightboxes have finished closing', fakeAsync(() => {
    const ref1 = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });
    const ref2 = lightbox.openLightbox(ContentElementLightboxComponent, {
      viewContainerRef: testViewContainerRef
    });
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

  it('should close all of the lightboxes', fakeAsync(() => {
    lightbox.openLightbox(PizzaMsgComponent);
    lightbox.openLightbox(PizzaMsgComponent);
    lightbox.openLightbox(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(3);

    lightbox.closeAll();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should set the proper animation states', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef
    });
    const lightboxContainer: LightboxContainerComponent = viewContainerFixture.debugElement.query(
      By.directive(LightboxContainerComponent)
    ).componentInstance;

    expect(lightboxContainer.state).toBe('enter');

    lightboxRef.close();

    expect(lightboxContainer.state).toBe('exit');
  });

  it('should close all lightboxes when the user goes forwards/backwards in history', fakeAsync(() => {
    lightbox.openLightbox(PizzaMsgComponent);
    lightbox.openLightbox(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should close all open lightboxes when the location hash changes', fakeAsync(() => {
    lightbox.openLightbox(PizzaMsgComponent);
    lightbox.openLightbox(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateHashChange('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(0);
  }));

  it('should allow the consumer to disable closing a lightbox on navigation', fakeAsync(() => {
    lightbox.openLightbox(PizzaMsgComponent);
    lightbox.openLightbox(PizzaMsgComponent, { closeOnNavigation: false });

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(1);
  }));

  it('should have the componentInstance available in the afterClosed callback', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent);
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

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      const config = {
        data: {
          stringParam: 'hello',
          dateParam: new Date()
        }
      };

      const instance = lightbox.openLightbox(LightboxWithInjectedDataComponent, config)
        .componentInstance!;

      expect(instance.data.stringParam).toBe(config.data.stringParam);
      expect(instance.data.dateParam).toBe(config.data.dateParam);
    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        const lightboxRef = lightbox.openLightbox(LightboxWithInjectedDataComponent);
        expect(lightboxRef.componentInstance!.data).toBeNull();
      }).not.toThrow();
    });
  });

  it('should not keep a reference to the component after the lightbox is closed', fakeAsync(() => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent);

    expect(lightboxRef.componentInstance).toBeTruthy();

    lightboxRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(lightboxRef.componentInstance).toBeFalsy('Expected reference to have been cleared.');
  }));

  it('should assign a unique id to each lightbox', () => {
    const one = lightbox.openLightbox(PizzaMsgComponent);
    const two = lightbox.openLightbox(PizzaMsgComponent);

    expect(one.id).toBeTruthy();
    expect(two.id).toBeTruthy();
    expect(one.id).not.toBe(two.id);
  });

  it('should allow for the id to be overwritten', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, { id: 'pizza' });
    expect(lightboxRef.id).toBe('pizza');
  });

  it('should throw an error when trying to open a lightbox with the same id as another lightbox', () => {
    lightbox.openLightbox(PizzaMsgComponent, { id: 'pizza' });
    expect(() => lightbox.openLightbox(PizzaMsgComponent, { id: 'pizza' })).toThrowError(
      /must be unique/g
    );
  });

  it('should be able to find a lightbox by id', () => {
    const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, { id: 'pizza' });
    expect(lightbox.getLightboxById('pizza')).toBe(lightboxRef);
  });

  describe('panelClass option', () => {
    it('should have custom panel class', () => {
      lightbox.openLightbox(PizzaMsgComponent, {
        panelClass: 'custom-panel-class',
        viewContainerRef: testViewContainerRef
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
      lightbox.openLightbox(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'INPUT',
        'Expected first tabbable element (input) in the lightbox to be focused.'
      );
    }));

    it('should allow disabling focus of the first tabbable element', fakeAsync(() => {
      lightbox.openLightbox(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
        autoFocus: false
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).not.toBe('INPUT');
    }));

    it('should re-focus trigger element when lightbox closes', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      button.id = 'lightbox-trigger';
      document.body.appendChild(button);
      button.focus();

      const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'lightbox-trigger',
        'Expected the focus to change when lightbox was opened.'
      );

      lightboxRef.close();
      expect(document.activeElement!.id).not.toBe(
        'lightbox-trigger',
        'Expcted the focus not to have changed before the animation finishes.'
      );

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(document.activeElement!.id).toBe(
        'lightbox-trigger',
        'Expected that the trigger was refocused after the lightbox is closed.'
      );

      document.body.removeChild(button);
    }));

    it('should allow the consumer to shift focus in afterClosed', fakeAsync(() => {
      // Create a element that has focus before the lightbox is opened.
      const button = document.createElement('button');
      const input = document.createElement('input');

      button.id = 'lightbox-trigger';
      input.id = 'input-to-be-focused';

      document.body.appendChild(button);
      document.body.appendChild(input);
      button.focus();

      const lightboxRef = lightbox.openLightbox(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef
      });

      tick(500);
      viewContainerFixture.detectChanges();

      lightboxRef.afterClosed().subscribe(() => input.focus());
      lightboxRef.close();

      tick(500);
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).toBe(
        'input-to-be-focused',
        'Expected that the trigger was refocused after the lightbox is closed.'
      );

      document.body.removeChild(button);
      document.body.removeChild(input);
    }));

    it('should move focus to the container if there are no focusable elements in the lightbox', fakeAsync(() => {
      lightbox.openLightbox(LightboxWithoutFocusableElementsComponent);

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'SBB-LIGHTBOX-CONTAINER',
        'Expected lightbox container to be focused.'
      );
    }));
  });

  describe('lightbox content elements', () => {
    let lightboxRef: LightboxRef<any>;

    describe('inside component lightbox', () => {
      beforeEach(fakeAsync(() => {
        lightboxRef = lightbox.openLightbox(ContentElementLightboxComponent, {
          viewContainerRef: testViewContainerRef
        });
        viewContainerFixture.detectChanges();
        flush();
      }));

      runContentElementTests();
    });

    describe('inside template portal', () => {
      beforeEach(fakeAsync(() => {
        const fixture = TestBed.createComponent(ComponentWithContentElementTemplateRefComponent);
        fixture.detectChanges();

        lightboxRef = lightbox.openLightbox(fixture.componentInstance.templateRef, {
          viewContainerRef: testViewContainerRef
        });

        viewContainerFixture.detectChanges();
        flush();
      }));

      runContentElementTests();
    });

    function runContentElementTests() {
      it('should close the lightbox when clicking on the close button', fakeAsync(() => {
        expect(overlayContainerElement.querySelectorAll('sbb-lightbox-container').length).toBe(1);

        (overlayContainerElement.querySelector('button[sbbLightboxClose]') as HTMLElement).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelectorAll('.sbb-lightbox-container').length).toBe(0);
      }));

      it('should override the "type" attribute of the close button', () => {
        const button = overlayContainerElement.querySelector('button[sbbLightboxClose]')!;

        expect(button.getAttribute('type')).toBe('button');
      });

      it('should return the [sbbLightboxClose] result when clicking the close button', fakeAsync(() => {
        const afterCloseCallback = jasmine.createSpy('afterClose callback');
        lightboxRef.afterClosed().subscribe(afterCloseCallback);

        (overlayContainerElement.querySelector('button.close-with-true') as HTMLElement).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(afterCloseCallback).toHaveBeenCalledWith(true);
      }));

      it('should set the aria-labelledby attribute to the id of the title', fakeAsync(() => {
        const title = overlayContainerElement.querySelector('[sbbLightboxTitle]')!;
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

  describe('aria-label', () => {
    it('should be able to set a custom aria-label', () => {
      lightbox.openLightbox(PizzaMsgComponent, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef
      });
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
      expect(container.getAttribute('aria-label')).toBe('Hello there');
    });

    it('should not set the aria-labelledby automatically if it has an aria-label', fakeAsync(() => {
      lightbox.openLightbox(ContentElementLightboxComponent, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef
      });
      viewContainerFixture.detectChanges();
      tick();
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('sbb-lightbox-container')!;
      expect(container.hasAttribute('aria-labelledby')).toBe(false);
    }));
  });
});

describe('Lightbox with a parent Lightbox', () => {
  let parentLightbox: Lightbox;
  let childLightbox: Lightbox;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesLightboxComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [LightboxModule, LightboxTestModule],
      declarations: [ComponentThatProvidesLightboxComponent],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        },
        { provide: Location, useClass: SpyLocation }
      ]
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([Lightbox], (d: Lightbox) => {
    parentLightbox = d;

    fixture = TestBed.createComponent(ComponentThatProvidesLightboxComponent);
    childLightbox = fixture.componentInstance.lightbox;
    fixture.detectChanges();
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
  });

  it('should close lightboxes opened by a parent when calling closeAll on a child Lightbox', fakeAsync(() => {
    parentLightbox.openLightbox(PizzaMsgComponent);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );

    childLightbox.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on child Lightbox to close lightbox opened by parent'
    );
  }));

  it('should close lightboxes opened by a child when calling closeAll on a parent Lightbox', fakeAsync(() => {
    childLightbox.openLightbox(PizzaMsgComponent);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a lightbox to be opened'
    );

    parentLightbox.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on parent Lightbox to close lightbox opened by child'
    );
  }));

  it('should close the top lightbox via the escape key', fakeAsync(() => {
    childLightbox.openLightbox(PizzaMsgComponent);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-lightbox-container')).toBeNull();
  }));
});
