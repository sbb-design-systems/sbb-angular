import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';
import { PaginationItemComponent } from '../pagination-item/pagination-item.component';
import { IconCommonModule } from '../../svg-icons-components/icon-common.module';
import { PageDescriptor } from '../pagination';
import { NavigationExtras } from '@angular/router';
import { PaginationModule } from '../pagination.module';
import { Component, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { dispatchEvent } from '../../_common/testing/dispatch-events';
import { createMouseEvent } from '../../_common/testing/event-objects';


@Component({
  selector: 'sbb-pagination-test',
  template: `<sbb-pagination #pagination
    (pageChange)="onPageChange($event)"
    [linkGenerator]="linkGenerator"
    [maxPage]="maxPage"
    [initialPage]="initialPage"></sbb-pagination>`
})
export class PaginationTestComponent {

  maxPage = 5;
  initialPage = 1;

  @ViewChild('pagination') pagination: PaginationComponent;

  onPageChange($event) {
    console.log($event);
  }

  linkGenerator = (page: PageDescriptor): NavigationExtras & { routerLink: string | any[] } => {
    console.log('calling linkGenerator');
    return {
      routerLink: ['.'],
      queryParams: { page: page.index },
      queryParamsHandling: 'merge',
    };
  }

}

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [IconCommonModule],
      declarations: [PaginationComponent, PaginationItemComponent]
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
      imports: [PaginationModule],
      declarations: [PaginationTestComponent]
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

  describe('when clicking on the left arrow', () => {
    it('should go to the next page', () => {
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item'));
      dispatchEvent(pageNumbers[pageNumbers.length - 1 ].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(6);
    });
  });

  describe('when clicking on the right arrow', () => {
    it('should go to the previous page', () => {
      const pageNumbers = fixture.debugElement.queryAll(By.css('.sbb-pagination-item'));
      dispatchEvent(pageNumbers[0].nativeElement, createMouseEvent('click'));
      fixture.detectChanges();
      expect(component.pagination.initialPage).toBe(4);
    });
  });

});

