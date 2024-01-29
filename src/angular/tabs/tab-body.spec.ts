import { Direction, Directionality } from '@angular/cdk/bidi';
import { TemplatePortal } from '@angular/cdk/portal';
import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { Subject } from 'rxjs';

import { SbbTabBody } from './tab-body';

describe('SbbTabBody', () => {
  let dir: Direction = 'ltr';
  const dirChange: Subject<Direction> = new Subject<Direction>();

  beforeEach(waitForAsync(() => {
    dir = 'ltr';
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule],
      providers: [
        { provide: Directionality, useFactory: () => ({ value: dir, change: dirChange }) },
      ],
    });

    TestBed.compileComponents();
  }));

  describe('when initialized as center', () => {
    let fixture: ComponentFixture<SimpleTabBodyApp>;

    it('should be show position if origin is unchanged', () => {
      fixture = TestBed.createComponent(SimpleTabBodyApp);
      fixture.componentInstance.position = 0;
      fixture.detectChanges();

      expect(fixture.componentInstance.tabBody._position).toBe('show');
    });

    it('should be show position if origin is explicitly set to null', () => {
      fixture = TestBed.createComponent(SimpleTabBodyApp);
      fixture.componentInstance.position = 0;

      // It can happen that the `origin` is explicitly set to null through the Angular input
      // binding. This test should ensure that the body does properly such origin value.
      // The `SbbTab` class sets the origin by default to null. See related issue: #12455
      fixture.componentInstance.origin = null;
      fixture.detectChanges();

      expect(fixture.componentInstance.tabBody._position).toBe('show');
    });

    describe('in LTR direction', () => {
      beforeEach(() => {
        dir = 'ltr';
        fixture = TestBed.createComponent(SimpleTabBodyApp);
      });
      it('should be show position with negative or zero origin', () => {
        fixture.componentInstance.position = 0;
        fixture.componentInstance.origin = 0;
        fixture.detectChanges();

        expect(fixture.componentInstance.tabBody._position).toBe('show');
      });

      it('should be show position with positive nonzero origin', () => {
        fixture.componentInstance.position = 0;
        fixture.componentInstance.origin = 1;
        fixture.detectChanges();

        expect(fixture.componentInstance.tabBody._position).toBe('show');
      });
    });

    describe('in RTL direction', () => {
      beforeEach(() => {
        dir = 'rtl';
        fixture = TestBed.createComponent(SimpleTabBodyApp);
      });

      it('should be show position with negative or zero origin', () => {
        fixture.componentInstance.position = 0;
        fixture.componentInstance.origin = 0;
        fixture.detectChanges();

        expect(fixture.componentInstance.tabBody._position).toBe('show');
      });

      it('should be show position with positive nonzero origin', () => {
        fixture.componentInstance.position = 0;
        fixture.componentInstance.origin = 1;
        fixture.detectChanges();

        expect(fixture.componentInstance.tabBody._position).toBe('show');
      });
    });
  });

  describe('should properly set the position', () => {
    let fixture: ComponentFixture<SimpleTabBodyApp>;

    beforeEach(() => {
      dir = 'ltr';
      fixture = TestBed.createComponent(SimpleTabBodyApp);
      fixture.detectChanges();
    });

    it('to be hidden position with negative position', () => {
      fixture.componentInstance.position = -1;
      fixture.detectChanges();

      expect(fixture.componentInstance.tabBody._position).toBe('hidden');
    });

    it('to be show position with zero position', () => {
      fixture.componentInstance.position = 0;
      fixture.detectChanges();

      expect(fixture.componentInstance.tabBody._position).toBe('show');
    });

    it('to be hidden position with positive position', () => {
      fixture.componentInstance.position = 1;
      fixture.detectChanges();

      expect(fixture.componentInstance.tabBody._position).toBe('hidden');
    });
  });

  it('should mark the tab body content as a scrollable container', () => {
    TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [NoopAnimationsModule, ScrollingModule, SbbIconTestingModule],
      })
      .compileComponents();

    const fixture = TestBed.createComponent(SimpleTabBodyApp);
    const tabBodyContent = fixture.nativeElement.querySelector('.sbb-tab-body-content');
    const scrollable = fixture.debugElement.query(By.directive(CdkScrollable));

    expect(scrollable).toBeTruthy();
    expect(scrollable.nativeElement).toBe(tabBodyContent);
  });
});

@Component({
  template: `
    <ng-template>Tab Body Content</ng-template>
    <sbb-tab-body [content]="content" [position]="position" [origin]="origin"></sbb-tab-body>
  `,
  standalone: true,
  imports: [SbbTabBody],
})
class SimpleTabBodyApp implements AfterContentInit {
  content: TemplatePortal;
  position: number;
  origin: number | null;

  @ViewChild(SbbTabBody) tabBody: SbbTabBody;
  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngAfterContentInit() {
    this.content = new TemplatePortal(this.template, this._viewContainerRef);
  }
}
