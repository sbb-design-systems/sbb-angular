import { Directionality } from '@angular/cdk/bidi';
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

import { SbbLightbox, SbbLightboxModule } from './index';

describe('SbbLightbox Zone.js integration', () => {
  let lightbox: SbbLightbox;
  let zone: NgZone;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbLightboxModule,
        NoopAnimationsModule,
        ComponentWithChildViewContainer,
        PizzaMsg,
        DirectiveWithViewContainer,
      ],
      providers: [provideZoneChangeDetection()],
    });

    lightbox = TestBed.inject(SbbLightbox);
    zone = TestBed.inject(NgZone);
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should invoke the afterClosed callback inside the NgZone', fakeAsync(() => {
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
  }));
});

/** Simple component for testing ComponentPortal. */
@Component({
  template: '<p>Pizza</p> <input> <button>Close</button>',
})
class PizzaMsg {
  directionality = inject(Directionality);
}
@Directive({
  selector: 'dir-with-view-container',
})
class DirectiveWithViewContainer {
  viewContainerRef = inject(ViewContainerRef);
}

@Component({
  selector: 'arbitrary-component',
  template: `@if (showChildView) {
    <dir-with-view-container></dir-with-view-container>
  }`,
  imports: [DirectiveWithViewContainer],
})
class ComponentWithChildViewContainer {
  showChildView = true;

  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}
