import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { SpyLocation } from '@angular/common/testing';
import {
  Component,
  Directive,
  Injector,
  NgZone,
  provideZoneChangeDetection,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbDialog } from '@sbb-esta/angular/dialog/dialog';
import { SbbDialogRef } from '@sbb-esta/angular/dialog/dialog-ref';
import { SbbDialogModule } from '@sbb-esta/angular/dialog/dialog.module';
import { Subject } from 'rxjs';

describe('SbbDialog Zone.js integration', () => {
  let dialog: SbbDialog;
  const scrolledSubject = new Subject<void>();

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbDialogModule,
        NoopAnimationsModule,
        ComponentWithChildViewContainer,
        PizzaMsg,
        DirectiveWithViewContainer,
      ],
      providers: [
        provideZoneChangeDetection(),
        { provide: Location, useClass: SpyLocation },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject,
            register: () => {},
            deregister: () => {},
          }),
        },
      ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([SbbDialog], (d: SbbDialog) => {
    dialog = d;
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should invoke the afterClosed callback inside the NgZone', fakeAsync(
    inject([NgZone], (zone: NgZone) => {
      const dialogRef = dialog.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
      const afterCloseCallback = jasmine.createSpy('afterClose callback');

      dialogRef.afterClosed().subscribe(() => {
        afterCloseCallback(NgZone.isInAngularZone());
      });
      zone.run(() => {
        dialogRef.close();
        viewContainerFixture.detectChanges();
        flush();
      });

      expect(afterCloseCallback).toHaveBeenCalledWith(true);
    }),
  ));
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
  template: `@if (showChildView) {
    <dir-with-view-container></dir-with-view-container>
  }`,
  standalone: true,
  imports: [DirectiveWithViewContainer],
})
class ComponentWithChildViewContainer {
  showChildView = true;

  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

/** Simple component for testing ComponentPortal. */
@Component({
  template: '<p>Pizza</p> <input> <button>Close</button>',
  standalone: true,
})
class PizzaMsg {
  constructor(
    public dialogRef: SbbDialogRef<PizzaMsg>,
    public dialogInjector: Injector,
    public directionality: Directionality,
  ) {}
}
