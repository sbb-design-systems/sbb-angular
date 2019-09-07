import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconChevronRightModule, IconChevronSmallDownModule } from '@sbb-esta/angular-icons';
import { DropdownModule } from '@sbb-esta/angular-public/dropdown';
import { configureTestSuite } from 'ng-bullet';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [CommonModule, DropdownModule, IconChevronRightModule, IconChevronSmallDownModule]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
