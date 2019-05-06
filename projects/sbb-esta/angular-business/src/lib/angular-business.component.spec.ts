import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularBusinessComponent } from './angular-business.component';

describe('AngularBusinessComponent', () => {
  let component: AngularBusinessComponent;
  let fixture: ComponentFixture<AngularBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
