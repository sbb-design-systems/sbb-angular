import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusShowcaseComponent } from './status-showcase.component';

describe('StatusShowcaseComponent', () => {
  let component: StatusShowcaseComponent;
  let fixture: ComponentFixture<StatusShowcaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusShowcaseComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
