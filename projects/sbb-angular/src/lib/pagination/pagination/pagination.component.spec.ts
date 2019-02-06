import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';
import { IconCommonModule } from '../../svg-icons-components/icon-common.module';
import { PaginationModule } from '../pagination.module';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { dispatchEvent } from '../../_common/testing/dispatch-events';
import { createMouseEvent } from '../../_common/testing/event-objects';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

@Component({
  selector: 'sbb-pagination-test',
  template: `<sbb-pagination #pagination
    (pageChange)="onPageChange($event)"
    [maxPage]="maxPage"
    [initialPage]="initialPage"></sbb-pagination>
    `
})
export class PaginationTestComponent {

  maxPage = 5;
  initialPage = 1;

  @ViewChild('pagination') pagination: PaginationComponent;

  onPageChange($event) {
    console.log($event);
  }

}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCommonModule, CommonModule, RouterTestingModule],
      declarations: [PaginationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.maxPage = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('PaginationComponent behaviour', () => {
  let component: PaginationTestComponent;
  let fixture: ComponentFixture<PaginationTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PaginationModule, RouterTestingModule],
      declarations: [PaginationTestComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationTestComponent);
    component = fixture.componentInstance;
    component.maxPage = 10;
    component.initialPage = 5;
    fixture.detectChanges();
  });

  describe('with more than 5 pages', () => {
    describe('ellipsis', () => {
      it('should show one ellipsis with first,second and third page selected', () => {
        component.maxPage = 10;
        component.initialPage = 1;
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 2;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 3;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 4;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });

      it('should show one ellipsis with last, last -1 and last-2 page selected', () => {
        component.maxPage = 10;
        component.initialPage = 10;
        fixture.detectChanges();
        let ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 9;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 8;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(1);
        component.initialPage = 7;
        fixture.detectChanges();
        ellipsisItems = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-ellipsis'));
        expect(ellipsisItems.length).toBe(2);
      });
    });

  });


  describe('when clicking on the left arrow', () => {
    it('should go to the next page', () => {
      component.maxPage = 10;
      component.initialPage = 5;
      fixture.detectChanges();
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(pageNumbers[1].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(6);
    });

  });

  describe('when clicking on the right arrow', () => {
    it('should go to the previous page', () => {
      component.maxPage = 10;
      component.initialPage = 5;
      fixture.detectChanges();
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item-boundary'));
      dispatchEvent(pageNumbers[0].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(4);
    });
  });

});

