import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import {
  DropdownTriggerDirective,
  DropdownOriginDirective,
  DropdownItemDirective,
  DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER
} from '../dropdown';
import { CommonModule } from '@angular/common';
import { IconCommonModule } from '../../svg-icons-components/icon-common.module';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdownComponent,
        DropdownItemDirective,
        DropdownOriginDirective,
        DropdownTriggerDirective
      ],
      imports: [
        CommonModule,
        IconCommonModule
      ],
      providers: [DROPDOWN_SCROLL_STRATEGY_FACTORY_PROVIDER]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
