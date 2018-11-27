import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  template: `<sbb-spinner bdColor="rgba(0, 0, 0, 0.3)"
                          mode="medium"
                          srAltText="Loading please wait"></sbb-spinner>`
})
class SpinnerTestComponent  {
}

describe('SpinnerComponent', () => {
  let component: SpinnerTestComponent;
  let fixture: ComponentFixture<SpinnerTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerTestComponent, SpinnerComponent, LoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

