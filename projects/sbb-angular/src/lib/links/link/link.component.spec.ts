import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-icon-arrow-down',
  template: ''
})
class IconArrowDownComponent { }

@Component({
  selector: 'sbb-icon-download',
  template: ''
})
class IconDownloadComponent { }

describe('IconLinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LinkComponent,

        // mock components
        IconArrowDownComponent,
        IconDownloadComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
