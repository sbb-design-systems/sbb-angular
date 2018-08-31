import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SbbAngularComponent } from './sbb-angular.component';

describe('SbbAngularComponent', () => {
  let component: SbbAngularComponent;
  let fixture: ComponentFixture<SbbAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SbbAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbbAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
