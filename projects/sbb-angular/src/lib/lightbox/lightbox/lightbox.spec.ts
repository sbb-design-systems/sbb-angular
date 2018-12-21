// import {
//   ComponentFixture,
//   fakeAsync,
//   flushMicrotasks,
//   inject,
//   TestBed,
//   tick,
//   flush,
// } from '@angular/core/testing';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   Directive,
//   Inject,
//   Injector,
//   NgModule,
//   TemplateRef,
//   ViewChild,
//   ViewContainerRef
// } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { Location } from '@angular/common';
// import { SpyLocation } from '@angular/common/testing';
// import { LightboxContainerComponent } from './lightbox-container.component';
// import { OverlayContainer, ScrollStrategy, ScrollDispatcher, Overlay } from '@angular/cdk/overlay';
// import { A, ESCAPE } from '@angular/cdk/keycodes';
// import { dispatchKeyboardEvent } from '../../_common/testing/dispatch-events';
// import {
//   LIGHTBOX_DATA,
//   Lightbox,
//   LightboxModule,
//   LightboxRef,
//   LIGHTBOX_DEFAULT_OPTIONS
// } from '../lightbox';
// import { Subject } from 'rxjs';


// describe('MatDialog', () => {
//   let lightbox: Lightbox;
//   let overlayContainer: OverlayContainer;
//   let overlayContainerElement: HTMLElement;
//   const scrolledSubject = new Subject();

//   let testViewContainerRef: ViewContainerRef;
//   let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainerComponent>;
//   let mockLocation: SpyLocation;

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [LightboxModule, LightboxTestModule],
//       providers: [
//         { provide: Location, useClass: SpyLocation },
//         {
//           provide: ScrollDispatcher, useFactory: () => ({
//             scrolled: () => scrolledSubject.asObservable()
//           })
//         },
//       ],
//     });

//     TestBed.compileComponents();
//   }));

//   beforeEach(inject([Lightbox, Location, OverlayContainer],
//     (d: Lightbox, l: Location, oc: OverlayContainer) => {
//       lightbox = d;
//       mockLocation = l as SpyLocation;
//       overlayContainer = oc;
//       overlayContainerElement = oc.getContainerElement();
//     }));

//   afterEach(() => {
//     overlayContainer.ngOnDestroy();
//   });

//   beforeEach(() => {
//     viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainerComponent);

//     viewContainerFixture.detectChanges();
//     testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
//   });

//   it('should open a lightbox with a component', () => {
//     const lightboxRef = lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: testViewContainerRef
//     });

//     viewContainerFixture.detectChanges();

//     expect(overlayContainerElement.textContent).toContain('Pizza');
//     expect(lightboxRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
//     expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);

//     viewContainerFixture.detectChanges();
//     const dialogContainerElement = overlayContainerElement.querySelector('sbb-lightbox-container');
//     expect(dialogContainerElement.getAttribute('role')).toBe('dialog');
//   });

//   it('should open a dialog with a template', () => {
//     const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRefComponent);
//     templateRefFixture.componentInstance.localValue = 'Bees';
//     templateRefFixture.detectChanges();

//     const data = { value: 'Knees' };

//     const lightboxRef = lightbox.open(templateRefFixture.componentInstance.templateRef, { data });

//     viewContainerFixture.detectChanges();

//     expect(overlayContainerElement.textContent).toContain('Cheese Bees Knees');
//     expect(templateRefFixture.componentInstance.lightRef).toBe(lightboxRef);

//     viewContainerFixture.detectChanges();

//     const dialogContainerElement = overlayContainerElement.querySelector('sbb-lightbox-container');
//     expect(dialogContainerElement.getAttribute('role')).toBe('dialog');

//     lightboxRef.close();
//   });

//   it('should emit when dialog opening animation is complete', fakeAsync(() => {
//     const lightboxRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     const spy = jasmine.createSpy('afterOpen spy');

//     lightboxRef.afterOpen().subscribe(spy);

//     viewContainerFixture.detectChanges();

//     // callback should not be called before animation is complete
//     expect(spy).not.toHaveBeenCalled();

//     flushMicrotasks();
//     expect(spy).toHaveBeenCalled();
//   }));

//   it('should use injector from viewContainerRef for DialogInjector', () => {
//     const lightboxRef = lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: testViewContainerRef
//     });

//     viewContainerFixture.detectChanges();

//     const dialogInjector = lightboxRef.componentInstance.lightboxInjector;

//     expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);
//     expect(dialogInjector.get<DirectiveWithViewContainerDirective>(DirectiveWithViewContainerDirective)).toBeTruthy(
//       'Expected the dialog component to be created with the injector from the viewContainerRef.'
//     );
//   });

//   it('should open a lightbox with a component and no ViewContainerRef', () => {
//     const lightboxRef = lightbox.open(PizzaMsgComponent);

//     viewContainerFixture.detectChanges();

//     expect(overlayContainerElement.textContent).toContain('Pizza');
//     expect(lightboxRef.componentInstance instanceof PizzaMsgComponent).toBe(true);
//     expect(lightboxRef.componentInstance.lightboxRef).toBe(lightboxRef);

//     viewContainerFixture.detectChanges();
//     const lightboxContainerElement = overlayContainerElement.querySelector('sbb-lightbox-container');
//     expect(lightboxContainerElement.getAttribute('role')).toBe('dialog');
//   });

//   it('should apply the configured role to the dialog element', () => {
//     lightbox.open(PizzaMsgComponent, { role: 'alertdialog' });

//     viewContainerFixture.detectChanges();

//     const lightboxContainerElement = overlayContainerElement.querySelector('sbb-lightbox-container');
//     expect(lightboxContainerElement.getAttribute('role')).toBe('alertdialog');
//   });

//   it('should apply the specified `aria-describedby`', () => {
//     lightbox.open(PizzaMsgComponent, { ariaDescribedBy: 'description-element' });

//     viewContainerFixture.detectChanges();


//     // I've arrived here
//     const lightboxContainerElement = overlayContainerElement.querySelector('sbb-lightbox-container');
//     expect(lightboxContainerElement.getAttribute('aria-describedby')).toBe('description-element');
//   });

//   it('should close a dialog and get back a result', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     const afterCloseCallback = jasmine.createSpy('afterClose callback');

//     dialogRef.afterClosed().subscribe(afterCloseCallback);
//     dialogRef.close('Charmander');
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(afterCloseCallback).toHaveBeenCalledWith('Charmander');
//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeNull();
//   }));

//   it('should dispatch the beforeClose and afterClose events when the ' +
//     'overlay is detached externally', fakeAsync(inject([Overlay], (overlay: Overlay) => {
//       const dialogRef = lightbox.open(PizzaMsgComponent, {
//         viewContainerRef: testViewContainerRef,
//         scrollStrategy: overlay.scrollStrategies.close()
//       });
//       const beforeCloseCallback = jasmine.createSpy('beforeClosed callback');
//       const afterCloseCallback = jasmine.createSpy('afterClosed callback');

//       dialogRef.beforeClose().subscribe(beforeCloseCallback);
//       dialogRef.afterClosed().subscribe(afterCloseCallback);

//       scrolledSubject.next();
//       viewContainerFixture.detectChanges();
//       flush();

//       expect(beforeCloseCallback).toHaveBeenCalledTimes(1);
//       expect(afterCloseCallback).toHaveBeenCalledTimes(1);
//     })));

//   it('should close a dialog and get back a result before it is closed', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });

//     flush();
//     viewContainerFixture.detectChanges();

//     // beforeClose should emit before dialog container is destroyed
//     const beforeCloseHandler = jasmine.createSpy('beforeClose callback').and.callFake(() => {
//       expect(overlayContainerElement.querySelector('mat-dialog-container'))
//         .not.toBeNull('dialog container exists when beforeClose is called');
//     });

//     dialogRef.beforeClose().subscribe(beforeCloseHandler);
//     dialogRef.close('Bulbasaur');
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(beforeCloseHandler).toHaveBeenCalledWith('Bulbasaur');
//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeNull();
//   }));

//   it('should close a dialog via the escape key', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: testViewContainerRef
//     });

//     dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeNull();
//   }));

//   it('should close from a ViewContainerRef with OnPush change detection', fakeAsync(() => {
//     const onPushFixture = TestBed.createComponent(ComponentWithOnPushViewContainerComponent);

//     onPushFixture.detectChanges();

//     const dialogRef = lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: onPushFixture.componentInstance.viewContainerRef
//     });

//     flushMicrotasks();
//     onPushFixture.detectChanges();
//     flushMicrotasks();

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length)
//       .toBe(1, 'Expected one open dialog.');

//     dialogRef.close();
//     flushMicrotasks();
//     onPushFixture.detectChanges();
//     tick(500);

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length)
//       .toBe(0, 'Expected no open dialogs.');
//   }));

//   it('should close when clicking on the overlay backdrop', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: testViewContainerRef
//     });

//     viewContainerFixture.detectChanges();

//     const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

//     backdrop.click();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeFalsy();
//   }));

//   it('should emit the backdropClick stream when clicking on the overlay backdrop', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, {
//       viewContainerRef: testViewContainerRef
//     });

//     const spy = jasmine.createSpy('backdropClick spy');
//     dialogRef.backdropClick().subscribe(spy);

//     viewContainerFixture.detectChanges();

//     const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

//     backdrop.click();
//     expect(spy).toHaveBeenCalledTimes(1);

//     viewContainerFixture.detectChanges();
//     flush();

//     // Additional clicks after the dialog has closed should not be emitted
//     backdrop.click();
//     expect(spy).toHaveBeenCalledTimes(1);
//   }));

//   it('should emit the keyboardEvent stream when key events target the overlay', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });

//     const spy = jasmine.createSpy('keyboardEvent spy');
//     dialogRef.keydownEvents().subscribe(spy);

//     viewContainerFixture.detectChanges();

//     const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
//     const container = overlayContainerElement.querySelector('mat-dialog-container') as HTMLElement;
//     dispatchKeyboardEvent(document.body, 'keydown', A);
//     dispatchKeyboardEvent(document.body, 'keydown', A, backdrop);
//     dispatchKeyboardEvent(document.body, 'keydown', A, container);

//     expect(spy).toHaveBeenCalledTimes(3);
//   }));

//   it('should notify the observers if a dialog has been opened', () => {
//     lightbox.afterOpen.subscribe(ref => {
//       expect(lightbox.open(PizzaMsgComponent, {
//         viewContainerRef: testViewContainerRef
//       })).toBe(ref);
//     });
//   });

//   it('should notify the observers if all open dialogs have finished closing', fakeAsync(() => {
//     const ref1 = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     const ref2 = lightbox.open(ContentElementDialogComponent, { viewContainerRef: testViewContainerRef });
//     const spy = jasmine.createSpy('afterAllClosed spy');

//     lightbox.afterAllClosed.subscribe(spy);

//     ref1.close();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(spy).not.toHaveBeenCalled();

//     ref2.close();
//     viewContainerFixture.detectChanges();
//     flush();
//     expect(spy).toHaveBeenCalled();
//   }));

//   it('should emit the afterAllClosed stream on subscribe if there are no open dialogs', () => {
//     const spy = jasmine.createSpy('afterAllClosed spy');

//     lightbox.afterAllClosed.subscribe(spy);

//     expect(spy).toHaveBeenCalled();
//   });

//   it('should should override the width of the overlay pane', () => {
//     lightbox.open(PizzaMsgComponent, {
//       width: '500px'
//     });

//     viewContainerFixture.detectChanges();

//     const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

//     expect(overlayPane.style.width).toBe('500px');
//   });

//   it('should should override the height of the overlay pane', () => {
//     lightbox.open(PizzaMsgComponent, {
//       height: '100px'
//     });

//     viewContainerFixture.detectChanges();

//     const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

//     expect(overlayPane.style.height).toBe('100px');
//   });

//   it('should close all of the dialogs', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent);
//     lightbox.open(PizzaMsgComponent);
//     lightbox.open(PizzaMsgComponent);

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(3);

//     lightbox.closeAll();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(0);
//   }));

//   it('should set the proper animation states', () => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     const dialogContainer: LightboxContainerComponent =
//       viewContainerFixture.debugElement.query(By.directive(LightboxContainerComponent)).componentInstance;

//     expect(dialogContainer.state).toBe('enter');

//     dialogRef.close();

//     expect(dialogContainer.state).toBe('exit');
//   });

//   it('should close all dialogs when the user goes forwards/backwards in history', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent);
//     lightbox.open(PizzaMsgComponent);

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(2);

//     mockLocation.simulateUrlPop('');
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(0);
//   }));

//   it('should close all open dialogs when the location hash changes', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent);
//     lightbox.open(PizzaMsgComponent);

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(2);

//     mockLocation.simulateHashChange('');
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(0);
//   }));

//   it('should allow the consumer to disable closing a dialog on navigation', fakeAsync(() => {
//     lightbox.open(PizzaMsgComponent);
//     lightbox.open(PizzaMsgComponent, { closeOnNavigation: false });

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(2);

//     mockLocation.simulateUrlPop('');
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelectorAll('mat-dialog-container').length).toBe(1);
//   }));

//   it('should have the componentInstance available in the afterClosed callback', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent);
//     const spy = jasmine.createSpy('afterClosed spy');

//     flushMicrotasks();
//     viewContainerFixture.detectChanges();
//     flushMicrotasks();

//     dialogRef.afterClosed().subscribe(() => {
//       spy();
//       expect(dialogRef.componentInstance).toBeTruthy('Expected component instance to be defined.');
//     });

//     dialogRef.close();

//     flushMicrotasks();
//     viewContainerFixture.detectChanges();
//     tick(500);

//     // Ensure that the callback actually fires.
//     expect(spy).toHaveBeenCalled();
//   }));

//   it('should be able to attach a custom scroll strategy', fakeAsync(() => {
//     const scrollStrategy: ScrollStrategy = {
//       attach: () => { },
//       enable: jasmine.createSpy('scroll strategy enable spy'),
//       disable: () => { }
//     };

//     lightbox.open(PizzaMsgComponent, { scrollStrategy });
//     expect(scrollStrategy.enable).toHaveBeenCalled();
//   }));

//   describe('passing in data', () => {
//     it('should be able to pass in data', () => {
//       const config = {
//         data: {
//           stringParam: 'hello',
//           dateParam: new Date()
//         }
//       };

//       const instance = lightbox.open(DialogWithInjectedDataComponent, config).componentInstance;

//       expect(instance.data.stringParam).toBe(config.data.stringParam);
//       expect(instance.data.dateParam).toBe(config.data.dateParam);
//     });

//     it('should default to null if no data is passed', () => {
//       expect(() => {
//         const dialogRef = lightbox.open(DialogWithInjectedDataComponent);
//         expect(dialogRef.componentInstance.data).toBeNull();
//       }).not.toThrow();
//     });
//   });

//   it('should not keep a reference to the component after the dialog is closed', fakeAsync(() => {
//     const dialogRef = lightbox.open(PizzaMsgComponent);

//     expect(dialogRef.componentInstance).toBeTruthy();

//     dialogRef.close();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(dialogRef.componentInstance).toBeFalsy('Expected reference to have been cleared.');
//   }));

//   it('should assign a unique id to each dialog', () => {
//     const one = lightbox.open(PizzaMsgComponent);
//     const two = lightbox.open(PizzaMsgComponent);

//     expect(one.id).toBeTruthy();
//     expect(two.id).toBeTruthy();
//     expect(one.id).not.toBe(two.id);
//   });

//   it('should allow for the id to be overwritten', () => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { id: 'pizza' });
//     expect(dialogRef.id).toBe('pizza');
//   });

//   it('should throw when trying to open a dialog with the same id as another dialog', () => {
//     lightbox.open(PizzaMsgComponent, { id: 'pizza' });
//     expect(() => lightbox.open(PizzaMsgComponent, { id: 'pizza' })).toThrowError(/must be unique/g);
//   });

//   it('should be able to find a dialog by id', () => {
//     const dialogRef = lightbox.open(PizzaMsgComponent, { id: 'pizza' });
//     expect(lightbox.getLightboxById('pizza')).toBe(dialogRef);
//   });

//   it('should toggle `aria-hidden` on the overlay container siblings', fakeAsync(() => {
//     const sibling = document.createElement('div');
//     overlayContainerElement.parentNode.appendChild(sibling);

//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to be hidden');
//     expect(overlayContainerElement.hasAttribute('aria-hidden'))
//       .toBe(false, 'Expected overlay container not to be hidden.');

//     dialogRef.close();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(sibling.hasAttribute('aria-hidden'))
//       .toBe(false, 'Expected sibling to no longer be hidden.');
//     sibling.parentNode.removeChild(sibling);
//   }));

//   it('should restore `aria-hidden` to the overlay container siblings on close', fakeAsync(() => {
//     const sibling = document.createElement('div');

//     sibling.setAttribute('aria-hidden', 'true');
//     overlayContainerElement.parentNode.appendChild(sibling);

//     const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to be hidden.');

//     dialogRef.close();
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(sibling.getAttribute('aria-hidden')).toBe('true', 'Expected sibling to remain hidden.');
//     sibling.parentNode.removeChild(sibling);
//   }));

//   it('should not set `aria-hidden` on `aria-live` elements', fakeAsync(() => {
//     const sibling = document.createElement('div');

//     sibling.setAttribute('aria-live', 'polite');
//     overlayContainerElement.parentNode.appendChild(sibling);

//     lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });
//     viewContainerFixture.detectChanges();
//     flush();

//     expect(sibling.hasAttribute('aria-hidden'))
//       .toBe(false, 'Expected live element not to be hidden.');
//     sibling.parentNode.removeChild(sibling);
//   }));

//   describe('panelClass option', () => {
//     it('should have custom panel class', () => {
//       lightbox.open(PizzaMsgComponent, {
//         panelClass: 'custom-panel-class',
//         viewContainerRef: testViewContainerRef
//       });

//       viewContainerFixture.detectChanges();

//       expect(overlayContainerElement.querySelector('.custom-panel-class')).toBeTruthy();
//     });
//   });

//   describe('focus management', () => {
//     // When testing focus, all of the elements must be in the DOM.
//     beforeEach(() => document.body.appendChild(overlayContainerElement));
//     afterEach(() => document.body.removeChild(overlayContainerElement));

//     it('should focus the first tabbable element of the dialog on open', fakeAsync(() => {
//       lightbox.open(PizzaMsgComponent, {
//         viewContainerRef: testViewContainerRef
//       });

//       viewContainerFixture.detectChanges();
//       flushMicrotasks();

//       expect(document.activeElement.tagName)
//         .toBe('INPUT', 'Expected first tabbable element (input) in the dialog to be focused.');
//     }));

//     it('should allow disabling focus of the first tabbable element', fakeAsync(() => {
//       lightbox.open(PizzaMsgComponent, {
//         viewContainerRef: testViewContainerRef,
//         autoFocus: false
//       });

//       viewContainerFixture.detectChanges();
//       flushMicrotasks();

//       expect(document.activeElement.tagName).not.toBe('INPUT');
//     }));

//     it('should re-focus trigger element when dialog closes', fakeAsync(() => {
//       // Create a element that has focus before the dialog is opened.
//       const button = document.createElement('button');
//       button.id = 'dialog-trigger';
//       document.body.appendChild(button);
//       button.focus();

//       const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });

//       flushMicrotasks();
//       viewContainerFixture.detectChanges();
//       flushMicrotasks();

//       expect(document.activeElement.id)
//         .not.toBe('dialog-trigger', 'Expected the focus to change when dialog was opened.');

//       dialogRef.close();
//       expect(document.activeElement.id).not.toBe('dialog-trigger',
//         'Expcted the focus not to have changed before the animation finishes.');

//       flushMicrotasks();
//       viewContainerFixture.detectChanges();
//       tick(500);

//       expect(document.activeElement.id).toBe('dialog-trigger',
//         'Expected that the trigger was refocused after the dialog is closed.');

//       document.body.removeChild(button);
//     }));

//     it('should allow the consumer to shift focus in afterClosed', fakeAsync(() => {
//       // Create a element that has focus before the dialog is opened.
//       const button = document.createElement('button');
//       const input = document.createElement('input');

//       button.id = 'dialog-trigger';
//       input.id = 'input-to-be-focused';

//       document.body.appendChild(button);
//       document.body.appendChild(input);
//       button.focus();

//       const dialogRef = lightbox.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });

//       tick(500);
//       viewContainerFixture.detectChanges();

//       dialogRef.afterClosed().subscribe(() => input.focus());
//       dialogRef.close();

//       tick(500);
//       viewContainerFixture.detectChanges();
//       flushMicrotasks();

//       expect(document.activeElement.id).toBe('input-to-be-focused',
//         'Expected that the trigger was refocused after the dialog is closed.');

//       document.body.removeChild(button);
//       document.body.removeChild(input);
//     }));

//     it('should move focus to the container if there are no focusable elements in the dialog',
//       fakeAsync(() => {
//         lightbox.open(DialogWithoutFocusableElementsComponent);

//         viewContainerFixture.detectChanges();
//         flushMicrotasks();

//         expect(document.activeElement.tagName)
//           .toBe('MAT-DIALOG-CONTAINER', 'Expected dialog container to be focused.');
//       }));

//   });

//   describe('dialog content elements', () => {
//     let dialogRef: LightboxRef<any>;

//     describe('inside component dialog', () => {
//       beforeEach(fakeAsync(() => {
//         dialogRef = lightbox.open(ContentElementDialogComponent, { viewContainerRef: testViewContainerRef });
//         viewContainerFixture.detectChanges();
//         flush();
//       }));

//       runContentElementTests();
//     });

//     describe('inside template portal', () => {
//       beforeEach(fakeAsync(() => {
//         const fixture = TestBed.createComponent(ComponentWithContentElementTemplateRefComponent);
//         fixture.detectChanges();

//         dialogRef = lightbox.open(fixture.componentInstance.templateRef, {
//           viewContainerRef: testViewContainerRef
//         });

//         viewContainerFixture.detectChanges();
//         flush();
//       }));

//       runContentElementTests();
//     });

//     function runContentElementTests() {
//       it('should close the dialog when clicking on the close button', fakeAsync(() => {
//         expect(overlayContainerElement.querySelectorAll('.mat-dialog-container').length).toBe(1);

//         (overlayContainerElement.querySelector('button[mat-dialog-close]') as HTMLElement).click();
//         viewContainerFixture.detectChanges();
//         flush();

//         expect(overlayContainerElement.querySelectorAll('.mat-dialog-container').length).toBe(0);
//       }));

//       it('should not close if [mat-dialog-close] is applied on a non-button node', () => {
//         expect(overlayContainerElement.querySelectorAll('.mat-dialog-container').length).toBe(1);

//         (overlayContainerElement.querySelector('div[mat-dialog-close]') as HTMLElement).click();

//         expect(overlayContainerElement.querySelectorAll('.mat-dialog-container').length).toBe(1);
//       });

//       it('should allow for a user-specified aria-label on the close button', fakeAsync(() => {
//         const button = overlayContainerElement.querySelector('.close-with-aria-label');
//         expect(button.getAttribute('aria-label')).toBe('Best close button ever');
//       }));

//       it('should override the "type" attribute of the close button', () => {
//         const button = overlayContainerElement.querySelector('button[mat-dialog-close]');

//         expect(button.getAttribute('type')).toBe('button');
//       });

//       it('should return the [mat-dialog-close] result when clicking the close button',
//         fakeAsync(() => {
//           const afterCloseCallback = jasmine.createSpy('afterClose callback');
//           dialogRef.afterClosed().subscribe(afterCloseCallback);

//           (overlayContainerElement.querySelector('button.close-with-true') as HTMLElement).click();
//           viewContainerFixture.detectChanges();
//           flush();

//           expect(afterCloseCallback).toHaveBeenCalledWith(true);
//         }));

//       it('should set the aria-labelledby attribute to the id of the title', fakeAsync(() => {
//         const title = overlayContainerElement.querySelector('[mat-dialog-title]');
//         const container = overlayContainerElement.querySelector('mat-dialog-container');

//         flush();
//         viewContainerFixture.detectChanges();

//         expect(title.id).toBeTruthy('Expected title element to have an id.');
//         expect(container.getAttribute('aria-labelledby'))
//           .toBe(title.id, 'Expected the aria-labelledby to match the title id.');
//       }));
//     }
//   });

//   describe('aria-label', () => {
//     it('should be able to set a custom aria-label', () => {
//       lightbox.open(PizzaMsgComponent, {
//         ariaLabel: 'Hello there',
//         viewContainerRef: testViewContainerRef
//       });
//       viewContainerFixture.detectChanges();

//       const container = overlayContainerElement.querySelector('mat-dialog-container');
//       expect(container.getAttribute('aria-label')).toBe('Hello there');
//     });

//     it('should not set the aria-labelledby automatically if it has an aria-label', fakeAsync(() => {
//       lightbox.open(ContentElementDialogComponent, {
//         ariaLabel: 'Hello there',
//         viewContainerRef: testViewContainerRef
//       });
//       viewContainerFixture.detectChanges();
//       tick();
//       viewContainerFixture.detectChanges();

//       const container = overlayContainerElement.querySelector('mat-dialog-container');
//       expect(container.hasAttribute('aria-labelledby')).toBe(false);
//     }));
//   });

// });

// describe('MatDialog with a parent MatDialog', () => {
//   let parentDialog: Lightbox;
//   let childDialog: Lightbox;
//   let overlayContainerElement: HTMLElement;
//   let fixture: ComponentFixture<ComponentThatProvidesMatDialogComponent>;

//   beforeEach(fakeAsync(() => {
//     TestBed.configureTestingModule({
//       imports: [LightboxModule, LightboxTestModule],
//       declarations: [ComponentThatProvidesMatDialogComponent],
//       providers: [
//         {
//           provide: OverlayContainer, useFactory: () => {
//             overlayContainerElement = document.createElement('div');
//             return { getContainerElement: () => overlayContainerElement };
//           }
//         },
//         { provide: Location, useClass: SpyLocation }
//       ],
//     });

//     TestBed.compileComponents();
//   }));

//   beforeEach(inject([Lightbox], (d: Lightbox) => {
//     parentDialog = d;

//     fixture = TestBed.createComponent(ComponentThatProvidesMatDialogComponent);
//     childDialog = fixture.componentInstance.dialog;
//     fixture.detectChanges();
//   }));

//   afterEach(() => {
//     overlayContainerElement.innerHTML = '';
//   });

//   it('should close dialogs opened by a parent when calling closeAll on a child MatDialog',
//     fakeAsync(() => {
//       parentDialog.open(PizzaMsgComponent);
//       fixture.detectChanges();
//       flush();

//       expect(overlayContainerElement.textContent)
//         .toContain('Pizza', 'Expected a dialog to be opened');

//       childDialog.closeAll();
//       fixture.detectChanges();
//       flush();

//       expect(overlayContainerElement.textContent.trim())
//         .toBe('', 'Expected closeAll on child MatDialog to close dialog opened by parent');
//     }));

//   it('should close dialogs opened by a child when calling closeAll on a parent MatDialog',
//     fakeAsync(() => {
//       childDialog.open(PizzaMsgComponent);
//       fixture.detectChanges();

//       expect(overlayContainerElement.textContent)
//         .toContain('Pizza', 'Expected a dialog to be opened');

//       parentDialog.closeAll();
//       fixture.detectChanges();
//       flush();

//       expect(overlayContainerElement.textContent.trim())
//         .toBe('', 'Expected closeAll on parent MatDialog to close dialog opened by child');
//     }));

//   it('should close the top dialog via the escape key', fakeAsync(() => {
//     childDialog.open(PizzaMsgComponent);

//     dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
//     fixture.detectChanges();
//     flush();

//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeNull();
//   }));
// });

// describe('MatDialog with default options', () => {
//   let dialog: Lightbox;
//   let overlayContainer: OverlayContainer;
//   let overlayContainerElement: HTMLElement;

//   let testViewContainerRef: ViewContainerRef;
//   let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainerComponent>;

//   beforeEach(fakeAsync(() => {
//     const defaultConfig = {
//       hasBackdrop: false,
//       disableClose: true,
//       width: '100px',
//       height: '100px',
//       minWidth: '50px',
//       minHeight: '50px',
//       maxWidth: '150px',
//       maxHeight: '150px',
//       autoFocus: false,
//     };

//     TestBed.configureTestingModule({
//       imports: [LightboxModule, LightboxTestModule],
//       providers: [
//         { provide: LIGHTBOX_DEFAULT_OPTIONS, useValue: defaultConfig },
//       ],
//     });

//     TestBed.compileComponents();
//   }));

//   beforeEach(inject([Lightbox, OverlayContainer],
//     (d: Lightbox, oc: OverlayContainer) => {
//       dialog = d;
//       overlayContainer = oc;
//       overlayContainerElement = oc.getContainerElement();
//     }));

//   afterEach(() => {
//     overlayContainer.ngOnDestroy();
//   });

//   beforeEach(() => {
//     viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainerComponent);

//     viewContainerFixture.detectChanges();
//     testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
//   });

//   it('should use the provided defaults', () => {
//     dialog.open(PizzaMsgComponent, { viewContainerRef: testViewContainerRef });

//     viewContainerFixture.detectChanges();

//     expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeFalsy();

//     dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
//     expect(overlayContainerElement.querySelector('mat-dialog-container')).toBeTruthy();

//     expect(document.activeElement.tagName).not.toBe('INPUT');

//     const overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
//     expect(overlayPane.style.width).toBe('100px');
//     expect(overlayPane.style.height).toBe('100px');
//     expect(overlayPane.style.minWidth).toBe('50px');
//     expect(overlayPane.style.minHeight).toBe('50px');
//     expect(overlayPane.style.maxWidth).toBe('150px');
//     expect(overlayPane.style.maxHeight).toBe('150px');
//   });

// });


// // tslint:disable-next-line:directive-selector
// @Directive({ selector: 'dir-with-view-container' })
// class DirectiveWithViewContainerDirective {
//   constructor(public viewContainerRef: ViewContainerRef) { }
// }

// @Component({
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: 'hello',
// })
// class ComponentWithOnPushViewContainerComponent {
//   constructor(public viewContainerRef: ViewContainerRef) { }
// }

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'arbitrary-component',
//   template: `<dir-with-view-container></dir-with-view-container>`,
// })
// class ComponentWithChildViewContainerComponent {
//   @ViewChild(DirectiveWithViewContainerDirective) childWithViewContainer: DirectiveWithViewContainerDirective;

//   get childViewContainer() {
//     return this.childWithViewContainer.viewContainerRef;
//   }
// }

// @Component({
//   // tslint:disable-next-line:component-selector
//   selector: 'arbitrary-component-with-template-ref',
//   template: `<ng-template let-data let-dialogRef="dialogRef">
//       Cheese {{localValue}} {{data?.value}}{{setDialogRef(dialogRef)}}</ng-template>`,
// })
// class ComponentWithTemplateRefComponent {
//   localValue: string;
//   lightRef: LightboxRef<any>;

//   @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

//   setDialogRef(dialogRef: LightboxRef<any>): string {
//     this.lightRef = dialogRef;
//     return '';
//   }
// }

// /** Simple component for testing ComponentPortal. */
// @Component({ template: '<p>Pizza</p> <input> <button>Close</button>' })
// class PizzaMsgComponent {
//   constructor(public lightboxRef: LightboxRef<PizzaMsgComponent>,
//     public lightboxInjector: Injector) { }
// }

// @Component({
//   template: `
//     <h1 mat-dialog-title>This is the title</h1>
//     <mat-dialog-content>Lorem ipsum dolor sit amet.</mat-dialog-content>
//     <mat-dialog-actions>
//       <button mat-dialog-close>Close</button>
//       <button class="close-with-true" [mat-dialog-close]="true">Close and return true</button>
//       <button
//         class="close-with-aria-label"
//         aria-label="Best close button ever"
//         [mat-dialog-close]="true">Close</button>
//       <div mat-dialog-close>Should not close</div>
//     </mat-dialog-actions>
//   `
// })
// class ContentElementDialogComponent { }

// @Component({
//   template: `
//     <ng-template>
//       <h1 mat-dialog-title>This is the title</h1>
//       <mat-dialog-content>Lorem ipsum dolor sit amet.</mat-dialog-content>
//       <mat-dialog-actions>
//         <button mat-dialog-close>Close</button>
//         <button class="close-with-true" [mat-dialog-close]="true">Close and return true</button>
//         <button
//           class="close-with-aria-label"
//           aria-label="Best close button ever"
//           [mat-dialog-close]="true">Close</button>
//         <div mat-dialog-close>Should not close</div>
//       </mat-dialog-actions>
//     </ng-template>
//   `
// })
// class ComponentWithContentElementTemplateRefComponent {
//   @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
// }

// @Component({
//   template: '',
//   providers: [Lightbox]
// })
// class ComponentThatProvidesMatDialogComponent {
//   constructor(public dialog: Lightbox) { }
// }

// /** Simple component for testing ComponentPortal. */
// @Component({ template: '' })
// class DialogWithInjectedDataComponent {
//   constructor(@Inject(LIGHTBOX_DATA) public data: any) { }
// }

// @Component({ template: '<p>Pasta</p>' })
// class DialogWithoutFocusableElementsComponent { }

// // Create a real (non-test) NgModule as a workaround for
// // https://github.com/angular/angular/issues/10760
// const TEST_DIRECTIVES = [
//   ComponentWithChildViewContainerComponent,
//   ComponentWithTemplateRefComponent,
//   PizzaMsgComponent,
//   DirectiveWithViewContainerDirective,
//   ComponentWithOnPushViewContainerComponent,
//   ContentElementDialogComponent,
//   DialogWithInjectedDataComponent,
//   DialogWithoutFocusableElementsComponent,
//   ComponentWithContentElementTemplateRefComponent,
// ];

// @NgModule({
//   imports: [LightboxModule, NoopAnimationsModule],
//   exports: TEST_DIRECTIVES,
//   declarations: TEST_DIRECTIVES,
//   entryComponents: [
//     ComponentWithChildViewContainerComponent,
//     ComponentWithTemplateRefComponent,
//     PizzaMsgComponent,
//     ContentElementDialogComponent,
//     DialogWithInjectedDataComponent,
//     DialogWithoutFocusableElementsComponent,
//   ],
// })
// class LightboxTestModule { }
