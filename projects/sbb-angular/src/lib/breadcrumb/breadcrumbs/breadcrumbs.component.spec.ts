import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { CommonModule, Location } from '@angular/common';
import { DropdownModule } from '../../dropdown/dropdown';
import { IconArrowLeftModule, IconArrowSmallDownModule, IconHomeModule, IconLhMountainsViewsModule } from '../../svg-icons/svg-icons';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [
        CommonModule,
        DropdownModule,
        IconArrowLeftModule,
        IconArrowSmallDownModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
