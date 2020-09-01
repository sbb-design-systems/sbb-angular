import { Directionality } from '@angular/cdk/bidi';
import { A, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer, ScrollStrategy } from '@angular/cdk/overlay';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
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
  ViewContainerRef,
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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import { dispatchKeyboardEvent } from '@sbb-esta/angular-core/testing';
import { Subject } from 'rxjs';

import { Dialog, DialogModule, DialogRef, DIALOG_DATA } from '../index';

// tslint:disable-next-line:directive-selector
@Directive({ selector: 'sbb-dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'hello',
})
class ComponentWithOnPushViewContainerComponent {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'sbb-arbitrary-component',
  template: `<sbb-dir-with-view-container></sbb-dir-with-view-container>`,
})
class ComponentWithChildViewContainerComponent {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'sbb-arbitrary-component-with-template-ref',
  template: `<ng-template let-data let-dialogRef="dialogRef">
    Cheese {{ localValue }} {{ data?.value }}{{ setDialogRef(dialogRef) }}</ng-template
  >`,
})
class ComponentWithTemplateRefComponent {
  localValue: string;
  dialogRef: DialogRef<any>;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  setDialogRef(dialogRef: DialogRef<any>): string {
    this.dialogRef = dialogRef;
    return '';
  }
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Pizza</p> <input> <button>Close</button>' })
class PizzaMsgComponent {
  constructor(
    public dialogRef: DialogRef<PizzaMsgComponent>,
    public dialogInjector: Injector,
    public directionality: Directionality
  ) {}
}

@Component({
  template: `
    <sbb-dialog-header>This is the title</sbb-dialog-header>
    <sbb-dialog-content>Lorem ipsum dolor sit amet.</sbb-dialog-content>
    <sbb-dialog-footer>
      <button sbbDialogClose>Close</button>
      <button class="close-with-true" [sbbDialogClose]="true">Close and return true</button>
      <button
        class="close-with-aria-label"
        aria-label="Best close button ever"
        [sbbDialogClose]="true"
      ></button>
      <button class="with-submit" type="submit" sbbDialogClose>Should have submit</button>
    </sbb-dialog-footer>
  `,
})
class ContentElementDialogComponent {}

@Component({
  template: `
    <ng-template>
      <sbb-dialog-header>This is the title</sbb-dialog-header>
      <sbb-dialog-content>Lorem ipsum dolor sit amet.</sbb-dialog-content>
      <sbb-dialog-footer>
        <button sbbDialogClose>Close</button>
        <button class="close-with-true" [sbbDialogClose]="true">Close and return true</button>
        <button
          class="close-with-aria-label"
          aria-label="Best close button ever"
          [sbbDialogClose]="true"
        ></button>
        <button class="with-submit" type="submit" sbbDialogClose>Should have submit</button>
      </sbb-dialog-footer>
    </ng-template>
  `,
})
class ComponentWithContentElementTemplateRefComponent {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
}

@Component({
  template: '',
  providers: [Dialog],
})
class ComponentThatProvidesDialogComponent {
  constructor(public dialog: Dialog) {}
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '' })
class DialogWithInjectedDataComponent {
  constructor(@Inject(DIALOG_DATA) public data: any) {}
}

@Component({ template: '<p>Pasta</p>' })
class DialogWithoutFocusableElementsComponent {}

// Create a real (non-test) NgModule as a workaround for
// https://github.com/angular/angular/issues/10760
const TEST_DIRECTIVES = [
  ComponentWithChildViewContainerComponent,
  ComponentWithTemplateRefComponent,
  PizzaMsgComponent,
  DirectiveWithViewContainer,
  ComponentWithOnPushViewContainerComponent,
  ContentElementDialogComponent,
  DialogWithInjectedDataComponent,
  DialogWithoutFocusableElementsComponent,
  ComponentWithContentElementTemplateRefComponent,
];

@NgModule({
  imports: [DialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    ComponentWithChildViewContainerComponent,
    ComponentWithTemplateRefComponent,
    PizzaMsgComponent,
    ContentElementDialogComponent,
    DialogWithInjectedDataComponent,
    DialogWithoutFocusableElementsComponent,
  ],
})
class DialogTestModule {}

describe('SbbDialog', () => {
  let dialog: Dialog;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const scrolledSubject = new Subject();

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainerComponent>;
  let mockLocation: SpyLocation;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule, DialogTestModule, SbbIconTestingModule],
      providers: [
        { provide: Location, useClass: SpyLocation },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable(),
          }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject(
    [Dialog, Location, OverlayContainer],
    (d: Dialog, l: Location, oc: OverlayContainer) => {
      dialog = d;
      mockLocation = l as SpyLocation;
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

  it('should open a dialog with a component', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(dialogRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
    expect(dialogRef.componentInstance!.dialogRef).toBe(dialogRef);

    viewContainerFixture.detectChanges();
    const dialogContainerElement = overlayContainerElement.querySelector('sbb-dialog-container')!;
    expect(dialogContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should open a dialog with a template', () => {
    const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRefComponent);
    templateRefFixture.componentInstance.localValue = 'Bees';
    templateRefFixture.detectChanges();

    const data = { value: 'Knees' };

    const dialogRef = dialog.openDialog(templateRefFixture.componentInstance.templateRef, { data });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Cheese Bees Knees');
    expect(templateRefFixture.componentInstance.dialogRef).toBe(dialogRef);

    viewContainerFixture.detectChanges();

    const dialogContainerElement = overlayContainerElement.querySelector('sbb-dialog-container')!;
    expect(dialogContainerElement.getAttribute('role')).toBe('dialog');

    dialogRef.close();
  });

  it('should emit when dialog opening animation is compconste', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });
    const spy = jasmine.createSpy('afterOpen spy');

    dialogRef.afterOpen().subscribe(spy);

    viewContainerFixture.detectChanges();

    // callback should not be called before animation is compconste
    expect(spy).not.toHaveBeenCalled();

    flushMicrotasks();
    expect(spy).toHaveBeenCalled();
  }));

  it('should use injector from viewContainerRef for DialogInjector', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    const dialogInjector = dialogRef.componentInstance!.dialogInjector;

    expect(dialogRef.componentInstance!.dialogRef).toBe(dialogRef);
    expect(dialogInjector.get<DirectiveWithViewContainer>(DirectiveWithViewContainer)).toBeTruthy(
      'Expected the dialog component to be created with the injector from the viewContainerRef.'
    );
  });

  it('should open a dialog with a component and no ViewContainerRef', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent);

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(dialogRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
    expect(dialogRef.componentInstance!.dialogRef).toBe(dialogRef);

    viewContainerFixture.detectChanges();
    const dialogContainerElement = overlayContainerElement.querySelector('sbb-dialog-container')!;
    expect(dialogContainerElement.getAttribute('role')).toBe('dialog');
  });

  it('should apply the configured role to the dialog element', () => {
    dialog.openDialog(PizzaMsgComponent, { role: 'alertdialog' });

    viewContainerFixture.detectChanges();

    const dialogContainerElement = overlayContainerElement.querySelector('sbb-dialog-container')!;
    expect(dialogContainerElement.getAttribute('role')).toBe('alertdialog');
  });

  it('should apply the specified `aria-describedby`', () => {
    dialog.openDialog(PizzaMsgComponent, { ariaDescribedBy: 'description-element' });

    viewContainerFixture.detectChanges();

    const dialogContainerElement = overlayContainerElement.querySelector('sbb-dialog-container')!;
    expect(dialogContainerElement.getAttribute('aria-describedby')).toBe('description-element');
  });

  it('should close a dialog and get back a result', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });
    const afterCloseCallback = jasmine.createSpy('afterClose callback');

    dialogRef.afterClosed().subscribe(afterCloseCallback);
    dialogRef.close('Charmander');
    viewContainerFixture.detectChanges();
    flush();

    expect(afterCloseCallback).toHaveBeenCalledWith('Charmander');
    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeNull();
  }));

  it('should dispose of dialog if view container is destroyed while animating', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    dialogRef.close();
    viewContainerFixture.detectChanges();
    viewContainerFixture.destroy();
    flush();

    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeNull();
  }));

  it(
    'should dispatch the beforeClose and afterClosed events when the ' +
      'overlay is detached externally',
    fakeAsync(
      inject([Overlay], (overlay: Overlay) => {
        const dialogRef = dialog.openDialog(PizzaMsgComponent, {
          viewContainerRef: testViewContainerRef,
          scrollStrategy: overlay.scrollStrategies.close(),
        });
        const beforeCloseCallback = jasmine.createSpy('beforeClose callback');
        const afterCloseCallback = jasmine.createSpy('afterClosed callback');

        dialogRef.beforeClose().subscribe(beforeCloseCallback);
        dialogRef.afterClosed().subscribe(afterCloseCallback);

        scrolledSubject.next();
        viewContainerFixture.detectChanges();
        flush();

        expect(beforeCloseCallback).toHaveBeenCalledTimes(1);
        expect(afterCloseCallback).toHaveBeenCalledTimes(1);
      })
    )
  );

  it('should close a dialog and get back a result before it is closed', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    flush();
    viewContainerFixture.detectChanges();

    // beforeClose should emit before dialog container is destroyed
    const beforeCloseHandler = jasmine.createSpy('beforeClose callback').and.callFake(() => {
      expect(overlayContainerElement.querySelector('sbb-dialog-container')).not.toBeNull(
        'dialog container exists when beforeClose is called'
      );
    });

    dialogRef.beforeClose().subscribe(beforeCloseHandler);
    dialogRef.close('Bulbasaur');
    viewContainerFixture.detectChanges();
    flush();

    expect(beforeCloseHandler).toHaveBeenCalledWith('Bulbasaur');
    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeNull();
  }));

  it('should close a dialog via the escape key', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    const event = dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeNull();
  }));

  it('should close from a ViewContainerRef with OnPush change detection', fakeAsync(() => {
    const onPushFixture = TestBed.createComponent(ComponentWithOnPushViewContainerComponent);

    onPushFixture.detectChanges();

    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: onPushFixture.componentInstance.viewContainerRef,
    });

    flushMicrotasks();
    onPushFixture.detectChanges();
    flushMicrotasks();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(
      1,
      'Expected one open dialog.'
    );

    dialogRef.close();
    flushMicrotasks();
    onPushFixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(
      0,
      'Expected no open dialogs.'
    );
  }));

  it('should close when clicking on the overlay backdrop', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector(
      '.sbb-overlay-background'
    ) as HTMLElement;

    backdrop.click();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeFalsy();
  }));

  it('should emit the backdropClick stream when clicking on the overlay backdrop', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    const spy = jasmine.createSpy('backdropClick spy');
    dialogRef.backdropClick().subscribe(spy);

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector(
      '.sbb-overlay-background'
    ) as HTMLElement;

    backdrop.click();
    expect(spy).toHaveBeenCalledTimes(1);

    viewContainerFixture.detectChanges();
    flush();

    // Additional clicks after the dialog has closed should not be emitted
    backdrop.click();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should emit the keyboardEvent stream when key events target the overlay', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });

    const spy = jasmine.createSpy('keyboardEvent spy');
    dialogRef.keydownEvents().subscribe(spy);

    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector(
      '.sbb-overlay-background'
    ) as HTMLElement;
    const container = overlayContainerElement.querySelector('sbb-dialog-container') as HTMLElement;
    dispatchKeyboardEvent(document.body, 'keydown', A);
    dispatchKeyboardEvent(backdrop, 'keydown', A);
    dispatchKeyboardEvent(container, 'keydown', A);

    expect(spy).toHaveBeenCalledTimes(3);
  }));

  it('should notify the observers if a dialog has been opened', () => {
    dialog.afterOpen.subscribe((ref) => {
      expect(
        dialog.openDialog(PizzaMsgComponent, {
          viewContainerRef: testViewContainerRef,
        })
      ).toBe(ref);
    });
  });

  it('should notify the observers if all open dialogs have finished closing', fakeAsync(() => {
    const ref1 = dialog.openDialog(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
    const ref2 = dialog.openDialog(ContentElementDialogComponent, {
      viewContainerRef: testViewContainerRef,
    });
    const spy = jasmine.createSpy('afterAllClosed spy');

    dialog.afterAllClosed.subscribe(spy);

    ref1.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(spy).not.toHaveBeenCalled();

    ref2.close();
    viewContainerFixture.detectChanges();
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit the afterAllClosed stream on subscribe if there are no open dialogs', () => {
    const spy = jasmine.createSpy('afterAllClosed spy');

    dialog.afterAllClosed.subscribe(spy);

    expect(spy).toHaveBeenCalled();
  });

  it('should override the width of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      width: '500px',
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('500px');
  });

  it('should override the height of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      height: '100px',
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.height).toBe('100px');
  });

  it('should override the min-width of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      minWidth: '500px',
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.minWidth).toBe('500px');
  });

  it('should override the max-width of the overlay pane', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent);

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.maxWidth).toBe(
      '80vw',
      'Expected dialog to set a default max-width on overlay pane'
    );

    dialogRef.close();

    tick(500);
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    dialog.openDialog(PizzaMsgComponent, {
      maxWidth: '100px',
    });

    viewContainerFixture.detectChanges();

    overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.maxWidth).toBe('100px');
  }));

  it('should override the min-height of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      minHeight: '300px',
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.minHeight).toBe('300px');
  });

  it('should override the max-height of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      maxHeight: '100px',
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.maxHeight).toBe('100px');
  });

  it('should override the top offset of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      position: {
        top: '100px',
      },
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginTop).toBe('100px');
  });

  it('should override the bottom offset of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      position: {
        bottom: '200px',
      },
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginBottom).toBe('200px');
  });

  it('should override the left offset of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      position: {
        left: '250px',
      },
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginLeft).toBe('250px');
  });

  it('should override the right offset of the overlay pane', () => {
    dialog.openDialog(PizzaMsgComponent, {
      position: {
        right: '125px',
      },
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginRight).toBe('125px');
  });

  it('should allow for the position to be updated', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      position: {
        left: '250px',
      },
    });

    viewContainerFixture.detectChanges();

    const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginLeft).toBe('250px');

    dialogRef.updatePosition({ left: '500px' });

    expect(overlayPane.style.marginLeft).toBe('500px');
  });

  it('should use the passed in ViewContainerRef from the config', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, {
      viewContainerRef: testViewContainerRef,
    });
    viewContainerFixture.detectChanges();
    flush();

    // One view ref is for the container and one more for the component with the content.
    expect(testViewContainerRef.length).toBe(2);

    dialogRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(testViewContainerRef.length).toBe(0);
  }));

  it('should close all of the dialogs', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(3);

    dialog.closeAll();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(0);
  }));

  it('should close all dialogs when the user goes forwards/backwards in history', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(0);
  }));

  it('should close all open dialogs when the location hash changes', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(2);

    mockLocation.simulateHashChange('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(0);
  }));

  it('should close all of the dialogs when the injectable is destroyed', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent);

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(3);

    dialog.ngOnDestroy();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(0);
  }));

  it('should allow the consumer to disable closing a dialog on navigation', fakeAsync(() => {
    dialog.openDialog(PizzaMsgComponent);
    dialog.openDialog(PizzaMsgComponent, { closeOnNavigation: false });

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('sbb-dialog-container').length).toBe(1);
  }));

  it('should have the componentInstance available in the afterClosed callback', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent);
    const spy = jasmine.createSpy('afterClosed spy');

    flushMicrotasks();
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    dialogRef.afterClosed().subscribe(() => {
      spy();
      expect(dialogRef.componentInstance).toBeTruthy('Expected component instance to be defined.');
    });

    dialogRef.close();

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

    dialog.openDialog(PizzaMsgComponent, { scrollStrategy });
    expect(scrollStrategy.enable).toHaveBeenCalled();
  }));

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      const config = {
        data: {
          stringParam: 'hello',
          dateParam: new Date(),
        },
      };

      const instance = dialog.openDialog(DialogWithInjectedDataComponent, config).componentInstance;

      expect(instance!.data.stringParam).toBe(config.data.stringParam);

      expect(instance!.data.dateParam).toBe(config.data.dateParam);
    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        const dialogRef = dialog.openDialog(DialogWithInjectedDataComponent);
        expect(dialogRef.componentInstance!.data).toBeNull();
      }).not.toThrow();
    });
  });

  it('should not keep a reference to the component after the dialog is closed', fakeAsync(() => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent);

    expect(dialogRef.componentInstance).toBeTruthy();

    dialogRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(dialogRef.componentInstance).toBeFalsy('Expected reference to have been cleared.');
  }));

  it('should assign a unique id to each dialog', () => {
    const one = dialog.openDialog(PizzaMsgComponent);
    const two = dialog.openDialog(PizzaMsgComponent);

    expect(one.id).toBeTruthy();
    expect(two.id).toBeTruthy();
    expect(one.id).not.toBe(two.id);
  });

  it('should allow for the id to be overwritten', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, { id: 'pizza' });
    expect(dialogRef.id).toBe('pizza');
  });

  it('should throw when trying to open a dialog with the same id as another dialog', () => {
    dialog.openDialog(PizzaMsgComponent, { id: 'pizza' });
    expect(() => dialog.openDialog(PizzaMsgComponent, { id: 'pizza' })).toThrowError(
      /must be unique/g
    );
  });

  it('should be able to find a dialog by id', () => {
    const dialogRef = dialog.openDialog(PizzaMsgComponent, { id: 'pizza' });
    expect(dialog.getDialogById('pizza')).toBe(dialogRef);
  });

  describe('disableClose option', () => {
    it('should prevent closing via clicks on the backdrop', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      const backdrop = overlayContainerElement.querySelector(
        '.sbb-overlay-background'
      ) as HTMLElement;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeTruthy();
    }));

    it('should prevent closing via the escape key', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeTruthy();
    }));

    it('should allow for the disableClose option to be updated while open', fakeAsync(() => {
      const dialogRef = dialog.openDialog(PizzaMsgComponent, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      const backdrop = overlayContainerElement.querySelector(
        '.sbb-overlay-background'
      ) as HTMLElement;
      backdrop.click();

      expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeTruthy();

      dialogRef.disableClose = false;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeFalsy();
    }));

    it('should recapture focus when clicking on the backdrop', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      const backdrop = overlayContainerElement.querySelector(
        '.sbb-overlay-background'
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
        dialog.openDialog(PizzaMsgComponent, {
          disableClose: true,
          viewContainerRef: testViewContainerRef,
          autoFocus: false,
        });

        viewContainerFixture.detectChanges();
        flushMicrotasks();

        const backdrop = overlayContainerElement.querySelector(
          '.sbb-overlay-background'
        ) as HTMLElement;
        const container = overlayContainerElement.querySelector(
          '.sbb-dialog-container'
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

  describe('hasBackdrop option', () => {
    it('should have a backdrop', () => {
      dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.sbb-overlay-background')).toBeTruthy();
    });
  });

  describe('panelClass option', () => {
    it('should have custom panel class', () => {
      dialog.openDialog(PizzaMsgComponent, {
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

    it('should focus the first tabbable element of the dialog on open', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'INPUT',
        'Expected first tabbable element (input) in the dialog to be focused.'
      );
    }));

    it('should allow disabling focus of the first tabbable element', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
        autoFocus: false,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).not.toBe('INPUT');
    }));

    it('should attach the focus trap even if automatic focus is disabled', fakeAsync(() => {
      dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
        autoFocus: false,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(
        overlayContainerElement.querySelectorAll('.cdk-focus-trap-anchor').length
      ).toBeGreaterThan(0);
    }));

    it('should re-focus trigger element when dialog closes', fakeAsync(() => {
      // Create a element that has focus before the dialog is opened.
      const button = document.createElement('button');
      button.id = 'dialog-trigger';
      document.body.appendChild(button);
      button.focus();

      const dialogRef = dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected the focus to change when dialog was opened.'
      );

      dialogRef.close();
      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expcted the focus not to have changed before the animation finishes.'
      );

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      tick(500);

      expect(document.activeElement!.id).toBe(
        'dialog-trigger',
        'Expected that the trigger was refocused after the dialog is closed.'
      );

      document.body.removeChild(button);
    }));

    it('should allow the consumer to shift focus in afterClosed', fakeAsync(() => {
      // Create a element that has focus before the dialog is opened.
      const button = document.createElement('button');
      const input = document.createElement('input');

      button.id = 'dialog-trigger';
      input.id = 'input-to-be-focused';

      document.body.appendChild(button);
      document.body.appendChild(input);
      button.focus();

      const dialogRef = dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
      });

      tick(500);
      viewContainerFixture.detectChanges();

      dialogRef.afterClosed().subscribe(() => input.focus());
      dialogRef.close();

      tick(500);
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).toBe(
        'input-to-be-focused',
        'Expected that the trigger was refocused after the dialog is closed.'
      );

      document.body.removeChild(button);
      document.body.removeChild(input);
      flush();
    }));

    it('should move focus to the container if there are no focusable elements in the dialog', fakeAsync(() => {
      dialog.openDialog(DialogWithoutFocusableElementsComponent);

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName).toBe(
        'SBB-DIALOG-CONTAINER',
        'Expected dialog container to be focused.'
      );
    }));

    it('should not move focus if it was moved outside the dialog while animating', fakeAsync(() => {
      // Create a element that has focus before the dialog is opened.
      const button = document.createElement('button');
      const otherButton = document.createElement('button');
      const body = document.body;
      button.id = 'dialog-trigger';
      otherButton.id = 'other-button';
      body.appendChild(button);
      body.appendChild(otherButton);
      button.focus();

      const dialogRef = dialog.openDialog(PizzaMsgComponent, {
        viewContainerRef: testViewContainerRef,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'dialog-trigger',
        'Expected the focus to change when dialog was opened.'
      );

      // Start the closing sequence and move focus out of dialog.
      dialogRef.close();
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

  describe('dialog content elements', () => {
    let dialogRef: DialogRef<any>;

    describe('inside component dialog', () => {
      beforeEach(fakeAsync(() => {
        dialogRef = dialog.openDialog(ContentElementDialogComponent, {
          viewContainerRef: testViewContainerRef,
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

        dialogRef = dialog.openDialog(fixture.componentInstance.templateRef, {
          viewContainerRef: testViewContainerRef,
        });

        viewContainerFixture.detectChanges();
        flush();
      }));

      runContentElementTests();
    });

    function runContentElementTests() {
      it('should close the dialog when clicking on the close button', fakeAsync(() => {
        expect(overlayContainerElement.querySelectorAll('.sbb-dialog-container').length).toBe(1);

        (overlayContainerElement.querySelector('button[sbbDialogClose]') as HTMLElement).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(overlayContainerElement.querySelectorAll('.sbb-dialog-container').length).toBe(0);
      }));

      it('should allow for a user-specified aria-label on the close button', fakeAsync(() => {
        const button = overlayContainerElement.querySelector('.close-with-aria-label')!;
        expect(button.getAttribute('aria-label')).toBe('Best close button ever');
      }));

      it('should set the "type" attribute of the close button if not set manually', () => {
        const button = overlayContainerElement.querySelector('button[sbbDialogClose]')!;

        expect(button.getAttribute('type')).toBe('button');
      });

      it('should not override type attribute of the close button if set manually', () => {
        const button = overlayContainerElement.querySelector('button.with-submit')!;

        expect(button.getAttribute('type')).toBe('submit');
      });

      it('should return the [sbbDialogClose] result when clicking the close button', fakeAsync(() => {
        const afterCloseCallback = jasmine.createSpy('afterClose callback');
        dialogRef.afterClosed().subscribe(afterCloseCallback);

        (overlayContainerElement.querySelector('button.close-with-true') as HTMLElement).click();
        viewContainerFixture.detectChanges();
        flush();

        expect(afterCloseCallback).toHaveBeenCalledWith(true);
      }));
    }
  });
});

describe('Dialog with a parent Dialog', () => {
  let parentDialog: Dialog;
  let childDialog: Dialog;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesDialogComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DialogModule, DialogTestModule, SbbIconTestingModule],
      declarations: [ComponentThatProvidesDialogComponent],
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

  beforeEach(inject([Dialog], (d: Dialog) => {
    parentDialog = d;

    fixture = TestBed.createComponent(ComponentThatProvidesDialogComponent);
    childDialog = fixture.componentInstance.dialog;
    fixture.detectChanges();
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
  });

  it('should close dialogs opened by a parent when calling closeAll on a child Dialog', fakeAsync(() => {
    parentDialog.openDialog(PizzaMsgComponent);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a dialog to be opened'
    );

    childDialog.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on child Dialog to close dialog opened by parent'
    );
  }));

  it('should close dialogs opened by a child when calling closeAll on a parent Dialog', fakeAsync(() => {
    childDialog.openDialog(PizzaMsgComponent);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a dialog to be opened'
    );

    parentDialog.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim()).toBe(
      '',
      'Expected closeAll on parent Dialog to close dialog opened by child'
    );
  }));

  it('should close the top dialog via the escape key', fakeAsync(() => {
    childDialog.openDialog(PizzaMsgComponent);

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('sbb-dialog-container')).toBeNull();
  }));

  it('should not close the parent dialogs when a child is destroyed', fakeAsync(() => {
    parentDialog.openDialog(PizzaMsgComponent);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a dialog to be opened'
    );

    childDialog.ngOnDestroy();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).toContain(
      'Pizza',
      'Expected a dialog to be opened'
    );
  }));
});
