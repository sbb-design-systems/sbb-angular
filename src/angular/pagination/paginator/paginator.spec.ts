import { Component, Provider, Type, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { dispatchMouseEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbPaginationModule } from '../pagination.module';

import {
  SbbPaginator,
  SbbPaginatorDefaultOptions,
  SBB_PAGINATOR_DEFAULT_OPTIONS,
} from './paginator';

@Component({
  template: `
    <sbb-paginator
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [length]="length"
      [disabled]="disabled"
      (page)="pageEvent($event)"
    >
    </sbb-paginator>
  `,
  imports: [SbbPaginationModule],
  standalone: true,
})
class SbbPaginatorTestComponent {
  pageIndex = 0;
  pageSize = 10;
  length = 100;
  disabled: boolean;
  pageEvent = jasmine.createSpy('page event');

  @ViewChild(SbbPaginator) paginator: SbbPaginator;
}

@Component({
  template: `
    <!-- order of attributes is important for test -->
    <sbb-paginator (page)="pageEvent($event)" [pageSize]="10" [length]="100" [pageIndex]="5">
    </sbb-paginator>
  `,
  imports: [SbbPaginationModule],
  standalone: true,
})
class SbbPaginatorInitializedTestComponent {
  pageEvent = jasmine.createSpy('page event');

  @ViewChild(SbbPaginator) paginator: SbbPaginator;
}

@Component({
  template: ` <sbb-paginator></sbb-paginator> `,
  imports: [SbbPaginationModule],
  standalone: true,
})
class SbbPaginatorWithoutInputsTestComponent {
  @ViewChild(SbbPaginator) paginator: SbbPaginator;
}

@Component({
  template: ` <sbb-paginator pageIndex="0" pageSize="10" length="100"> </sbb-paginator> `,
  imports: [SbbPaginationModule],
  standalone: true,
})
class SbbPaginatorWithStringValuesTestComponent {
  @ViewChild(SbbPaginator) paginator: SbbPaginator;
}

describe('SbbPaginator', () => {
  function createComponent<T>(type: Type<T>, providers: Provider[] = []): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, SbbIconTestingModule, type],
      providers: [...providers],
    }).compileComponents();

    const fixture = TestBed.createComponent(type);
    fixture.detectChanges();
    return fixture;
  }

  describe('when navigating with the next and previous buttons', () => {
    it('should be able to go to the next page', () => {
      const fixture = createComponent(SbbPaginatorTestComponent);
      const component = fixture.componentInstance;
      const paginator = component.paginator;
      expect(paginator.pageIndex).toBe(0);

      dispatchMouseEvent(getNextButton(fixture), 'click');

      expect(paginator.pageIndex).toBe(1);
      expect(component.pageEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          previousPageIndex: 0,
          pageIndex: 1,
        }),
      );
    });

    it('should be able to go to the previous page', () => {
      const fixture = createComponent(SbbPaginatorTestComponent);
      const component = fixture.componentInstance;
      const paginator = component.paginator;
      paginator.pageIndex = 1;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(paginator.pageIndex).toBe(1);

      dispatchMouseEvent(getPreviousButton(fixture), 'click');

      expect(paginator.pageIndex).toBe(0);
      expect(component.pageEvent).toHaveBeenCalledWith(
        jasmine.objectContaining({
          previousPageIndex: 1,
          pageIndex: 0,
        }),
      );
    });
  });

  it('should mark itself as initialized', fakeAsync(() => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    let isMarkedInitialized = false;
    paginator.initialized.subscribe(() => (isMarkedInitialized = true));

    tick();
    expect(isMarkedInitialized).toBeTruthy();
  }));

  it('should not allow a negative pageSize', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    paginator.pageSize = -1337;
    expect(paginator.pageSize).toBeGreaterThanOrEqual(0);
  });

  it('should not allow a negative pageIndex', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    paginator.pageIndex = -42;
    expect(paginator.pageIndex).toBeGreaterThanOrEqual(0);
  });

  it('should not allow a pageIndex greater than max page', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    component.pageIndex = 10;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).toHaveBeenCalledTimes(1);
    expect(paginator.pageIndex).toBe(9);
  });

  it('should correct down index when decrease length and pageIndex would be out of range', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    component.pageIndex = 9;
    component.length = 90;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).toHaveBeenCalledTimes(2);
    expect(paginator.pageIndex).toBe(8);
  });

  it('should not touch pageIndex when decrease length and pageIndex would be in range', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    component.length = 90;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).not.toHaveBeenCalled();
    expect(paginator.pageIndex).toBe(0);
  });

  it('should handle length 0 correctly', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;
    component.pageIndex = 10;
    component.length = 0;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).toHaveBeenCalledTimes(2);
    expect(paginator.pageIndex).toBe(0);
  });

  it('should not emit pageEvent when not initialized', () => {
    const fixture = createComponent(SbbPaginatorInitializedTestComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.pageEvent).not.toHaveBeenCalled();
  });

  it('should default the page size to 50', () => {
    const fixture = createComponent(SbbPaginatorWithoutInputsTestComponent);
    fixture.detectChanges();

    expect(fixture.componentInstance.paginator.pageSize).toEqual(50);
  });

  it('should be able to change the page size while keeping the first item present', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;

    // Start on the third page of a list of 100 with a page size of 10.
    component.pageIndex = 4;
    component.pageSize = 10;
    component.length = 100;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    // The first item of the page should be item with index 40
    expect(paginator.pageIndex * paginator.pageSize).toBe(40);

    // The first item on the page is now 25. Change the page size to 25 so that we should now be
    // on the second page where the top item is index 25.
    component.pageEvent.calls.reset();
    // containing the previous page's first item.
    const startIndex2 = paginator.pageIndex * paginator.pageSize;

    paginator.pageSize = 25;
    paginator.pageIndex = Math.floor(startIndex2 / 25) || 0;

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 1,
        pageSize: 25,
      }),
    );

    // The first item on the page is still 25. Change the page size to 8 so that we should now be
    // on the fourth page where the top item is index 24.
    component.pageEvent.calls.reset();
    // containing the previous page's first item.
    const startIndex1 = paginator.pageIndex * paginator.pageSize;

    paginator.pageSize = 8;
    paginator.pageIndex = Math.floor(startIndex1 / 8) || 0;

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 3,
        pageSize: 8,
      }),
    );

    // The first item on the page is 24. Change the page size to 16 so that we should now be
    // on the first page where the top item is index 0.
    component.pageEvent.calls.reset();
    // containing the previous page's first item.
    const startIndex = paginator.pageIndex * paginator.pageSize;

    paginator.pageSize = 25;
    paginator.pageIndex = Math.floor(startIndex / 25) || 0;

    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 0,
        pageSize: 25,
      }),
    );
  });

  it('should keep track of the right number of pages', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    const paginator = component.paginator;

    component.pageSize = 10;
    component.length = 100;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(paginator.numberOfPages()).toBe(10);

    component.pageSize = 10;
    component.length = 0;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(paginator.numberOfPages()).toBe(0);

    component.pageSize = 10;
    component.length = 10;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(paginator.numberOfPages()).toBe(1);
  });

  it('should emit PageEvent when changing pageSize but not changing index', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    component.pageEvent.calls.reset();

    component.pageSize = 11;

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pageIndex: 0,
        pageSize: 11,
      }),
    );
  });

  it('should not emit PageEvent when only changing length after pageSize has changed', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const component = fixture.componentInstance;
    component.pageSize = 11;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    component.pageEvent.calls.reset();

    component.length = 99;

    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(component.pageEvent).not.toHaveBeenCalled();
  });

  it('should handle the number inputs being passed in as strings', () => {
    const fixture = createComponent(SbbPaginatorWithStringValuesTestComponent);
    fixture.detectChanges();

    const withStringPaginator = fixture.componentInstance.paginator;
    expect(withStringPaginator.pageIndex).toEqual(0);
    expect(withStringPaginator.length).toEqual(100);
    expect(withStringPaginator.pageSize).toEqual(10);
  });

  it('should be able to disable all the controls in the paginator via the binding', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);

    fixture.componentInstance.pageIndex = 1;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getFirstButton(fixture).hasAttribute('disabled')).toBe(false);
    expect(getLastButton(fixture).hasAttribute('disabled')).toBe(false);

    fixture.componentInstance.disabled = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getFirstButton(fixture).hasAttribute('disabled')).toBe(true);
    expect(getLastButton(fixture).hasAttribute('disabled')).toBe(true);
  });

  it('should should disable previous button when on first page', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const paginator = fixture.componentInstance.paginator;

    paginator.pageIndex = 1;
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(false);

    paginator.firstPage();
    fixture.detectChanges();

    expect(getPreviousButton(fixture).hasAttribute('disabled')).toBe(true);
  });

  it('should should disable next button when on last page', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const paginator = fixture.componentInstance.paginator;

    paginator.pageIndex = 1;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();

    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(false);

    paginator.lastPage();
    fixture.detectChanges();

    expect(getNextButton(fixture).hasAttribute('disabled')).toBe(true);
  });

  it('should be able to configure the default options via a provider', () => {
    const fixture = createComponent(SbbPaginatorWithoutInputsTestComponent, [
      {
        provide: SBB_PAGINATOR_DEFAULT_OPTIONS,
        useValue: {
          pageSize: 7,
        } as SbbPaginatorDefaultOptions,
      },
    ]);
    const paginator = fixture.componentInstance.paginator;

    expect(paginator.pageSize).toBe(7);
  });

  it('should set `role="group"` on the host element', () => {
    const fixture = createComponent(SbbPaginatorTestComponent);
    const hostElement = fixture.nativeElement.querySelector('sbb-paginator');
    expect(hostElement.getAttribute('role')).toBe('group');
  });

  describe('with more than 5 pages', () => {
    describe('ellipsis', () => {
      it('should show one ellipsis with first,second and third page selected', () => {
        const fixture = createComponent(SbbPaginatorTestComponent);
        const component = fixture.componentInstance;
        component.pageIndex = 0;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 1;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 2;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 3;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });

      it('should show one ellipsis with last, last -1 and last-2 page selected', () => {
        const fixture = createComponent(SbbPaginatorTestComponent);
        const component = fixture.componentInstance;
        component.pageIndex = 9;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 8;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 7;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.pageIndex = 6;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-paginator-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });
    });
  });
});

function getPreviousButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.sbb-paginator-item-boundary');
}

function getNextButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelectorAll('.sbb-paginator-item-boundary')[1];
}

function getFirstButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.sbb-paginator-item:nth-child(2)>button');
}

function getLastButton(fixture: ComponentFixture<any>) {
  return fixture.nativeElement.querySelector('.sbb-paginator-item:nth-last-child(2)>button');
}
