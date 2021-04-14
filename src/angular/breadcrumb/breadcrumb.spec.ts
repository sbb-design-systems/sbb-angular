import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

import { SbbBreadcrumb } from './breadcrumb';

describe('SbbBreadcrumb', () => {
  let component: SbbBreadcrumb;
  let fixture: ComponentFixture<SbbBreadcrumb>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SbbBreadcrumb],
        imports: [CommonModule, SbbMenuModule, SbbIconModule, SbbIconTestingModule],
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
