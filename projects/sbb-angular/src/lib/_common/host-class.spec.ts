import { Component, ElementRef, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostClass } from './host-class';

describe('HostClass', () => {

  @Component({
    selector: 'sbb-test',
    template: '',
    providers: [HostClass],
  })
  class TestComponent {
    get classList() { return Array.from(this.elementRef.nativeElement.classList); }

    constructor(
      public readonly hostClass: HostClass,
      public readonly elementRef: ElementRef,
    ) { }
  }

  describe('standalone mode', () => {
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have given class after applying', () => {
      const expectedClass = 'test';
      expect(component.classList.length).toBe(0);
      component.hostClass.apply(expectedClass);
      expect(component.classList.length).toBe(1);
      expect(component.classList[0]).toBe(expectedClass);
    });

    it('should have given class array after applying', () => {
      const expectedClasses = ['test', 'test2'];
      expect(component.classList.length).toBe(0);
      component.hostClass.apply(expectedClasses);
      expect(component.classList).toEqual(expectedClasses);
    });

    it('should have given class object after applying', () => {
      const expectedClasses = { test: true, test1: false };
      expect(component.classList.length).toBe(0);
      component.hostClass.apply(expectedClasses);
      expect(component.classList)
        .toEqual(Object.keys(expectedClasses).filter(k => expectedClasses[k]));
    });
  });

  describe('in template with class, [class.binding] and [ngClass]', () => {
    let component: WrappedTestComponent;
    let fixture: ComponentFixture<WrappedTestComponent>;
    const existingClasses = ['attributeClass', 'ngClass', 'bindingClass'];

    @Component({
      selector: 'sbb-wrapped-test',
      template: `
        <sbb-test class="attributeClass"
                  [ngClass]="{ ngClass: true, ngClassFalse: false }"
                  [class.bindingClass]="true"></sbb-test>
      `,
    })
    class WrappedTestComponent {
      @ViewChild(TestComponent) test: TestComponent;
      get classList() { return this.test.classList; }
      get hostClass() { return this.test.hostClass; }
    }

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, WrappedTestComponent],
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(WrappedTestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should have given class after applying', () => {
      const expectedClass = 'test';
      expect(component.classList).toEqual(existingClasses);
      component.hostClass.apply(expectedClass);
      expect(component.classList).toEqual([...existingClasses, expectedClass]);
    });

    it('should have given class array after applying', () => {
      const expectedClasses = ['test', 'test2'];
      expect(component.classList).toEqual(existingClasses);
      component.hostClass.apply(expectedClasses);
      expect(component.classList).toEqual([...existingClasses, ...expectedClasses]);
    });

    it('should have given class object after applying', () => {
      const expectedClasses = { test: true, test1: false };
      expect(component.classList).toEqual(existingClasses);
      component.hostClass.apply(expectedClasses);
      expect(component.classList)
        .toEqual([...existingClasses, ...Object.keys(expectedClasses).filter(k => expectedClasses[k])]);
    });
  });
});
