import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StatusTooltipComponent } from './status-tooltip.component';

describe('StatusTooltipComponent', () => {
  let component: StatusTooltipComponent;
  let fixture: ComponentFixture<StatusTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [StatusTooltipComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set text', () => {
    component.text = 'Status';
    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.sbb-status-tooltip')).nativeElement.textContent
    ).toBe('Status');
  });
});
