import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { SpyLocation } from '@angular/common/testing';
import {
  Component,
  Directive,
  inject,
  NgZone,
  provideZoneChangeDetection,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { SbbDialog, SbbDialogModule } from './index';

describe('SbbDialog Zone.js integration', () => {
  let dialog: SbbDialog;
  let zone: NgZone;
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

    dialog = TestBed.inject(SbbDialog);
    zone = TestBed.inject(NgZone);
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should invoke the afterClosed callback inside the NgZone', fakeAsync(() => {
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
  }));
});

@Directive({
  selector: 'dir-with-view-container',
  standalone: true,
})
class DirectiveWithViewContainer {
  viewContainerRef = inject(ViewContainerRef);
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
  directionality = inject(Directionality);
}
