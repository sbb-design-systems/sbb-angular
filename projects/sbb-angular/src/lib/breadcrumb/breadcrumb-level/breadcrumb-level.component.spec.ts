import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbLevelComponent } from './breadcrumb-level.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from '../../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule } from '../../svg-icons/svg-icons';

describe('BreadcrumbLevelComponent', () => {
  let component: BreadcrumbLevelComponent;
  let fixture: ComponentFixture<BreadcrumbLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbLevelComponent],
      imports: [
        CommonModule,
        DropdownModule,
        IconArrowLeftModule,
        IconArrowSmallDownModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
