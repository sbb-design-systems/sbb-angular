import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconLinkComponent } from './icon-link.component';

describe('IconLinkComponent', () => {
  let component: IconLinkComponent;
  let fixture: ComponentFixture<IconLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
