import { Directionality } from '@angular/cdk/bidi';
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
import { SbbLightbox } from '@sbb-esta/angular/lightbox/lightbox';
import { SbbLightboxRef } from '@sbb-esta/angular/lightbox/lightbox-ref';
import { SbbLightboxModule } from '@sbb-esta/angular/lightbox/lightbox.module';

describe('SbbLightbox Zone.js integration', () => {
  let lightbox: SbbLightbox;

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

    TestBed.compileComponents();
  }));

  beforeEach(inject([SbbLightbox], (d: SbbLightbox) => {
    lightbox = d;
  }));

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

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
    }),
  ));
});

/** Simple component for testing ComponentPortal. */
@Component({
  template: '<p>Pizza</p> <input> <button>Close</button>',
  standalone: true,
})
class PizzaMsg {
  constructor(
    public lightboxRef: SbbLightboxRef<PizzaMsg>,
    public lightboxInjector: Injector,
    public directionality: Directionality,
  ) {}
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
