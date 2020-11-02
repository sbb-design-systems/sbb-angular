import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';
import { SbbDropdownModule } from '@sbb-esta/angular-public/dropdown';

import { SbbBreadcrumb } from './breadcrumb.component';

describe('SbbBreadcrumb', () => {
  let component: SbbBreadcrumb;
  let fixture: ComponentFixture<SbbBreadcrumb>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbBreadcrumb],
        imports: [CommonModule, SbbDropdownModule, SbbIconModule, SbbIconTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbBreadcrumb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
