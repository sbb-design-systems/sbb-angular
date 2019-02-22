import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuComponent } from './usermenu.component';
import { CommonModule } from '@angular/common';
import { DropdownModule } from '../../dropdown/dropdown';
import { IconArrowSmallDownModule } from '../../svg-icons/base/arrows/icon-arrow-small-down.module';
import { IconUserModule } from '../../svg-icons/base/icon-user.module';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserMenuComponent],
      imports: [CommonModule, DropdownModule, IconArrowSmallDownModule, IconUserModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
