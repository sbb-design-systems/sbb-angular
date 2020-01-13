import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { DefaultTooltipComponent } from './default-tooltip.component';

describe('StatusTooltipComponent', () => {
  let component: DefaultTooltipComponent;
  let fixture: ComponentFixture<DefaultTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [DefaultTooltipComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultTooltipComponent);
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
