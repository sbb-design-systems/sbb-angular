import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SbbIcon, SbbIconModule } from '@sbb-esta/angular-core/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular-core/icon/testing';

import { SbbChip } from './chip.component';

@Component({
  selector: 'sbb-test-chip',
  template: `
    <sbb-chip [disabled]="disabled" [label]="label" (dismissed)="dismissed($event)"></sbb-chip>
  `,
})
class ChipTestComponent {
  disabled = false;
  label = 'Label';

  dismissed(_event: any) {}
}

describe('SbbChip', () => {
  let component: ChipTestComponent;
  let fixture: ComponentFixture<ChipTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbbChip, ChipTestComponent],
      imports: [CommonModule, SbbIconModule, SbbIconTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a dismissable chip with default label', () => {
    const chips = fixture.debugElement.queryAll(By.directive(SbbChip));
    const crossIcon = fixture.debugElement.query(By.directive(SbbIcon));
    const label = fixture.debugElement.query(By.css('.sbb-chip-label'));
    expect(chips.length).toBe(1);
    expect(crossIcon).toBeDefined();
    expect(label.nativeElement.innerHTML).toBe(component.label);
    expect(chips[0].classes['sbb-chip-disabled']).toBeFalsy();
    expect(chips[0].classes['sbb-chip-active']).toBe(true);
  });

  it('should show a disabled chip', () => {
    component.disabled = true;
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(By.directive(SbbChip));
    const crossIcon = fixture.debugElement.query(By.directive(SbbIcon));
    expect(crossIcon).toBeNull();
    expect(chips[0].classes['sbb-chip-disabled']).toBe(true);
    expect(chips[0].classes['sbb-chip-active']).toBeFalsy();
  });

  it('should emit dismissed event when dismissed button is pressed', () => {
    const dismissedSpy = spyOn(component, 'dismissed');
    const dismissButton = fixture.debugElement.query(By.css('.sbb-chip-close-button'));
    dismissButton.nativeElement.click();

    expect(dismissedSpy).toHaveBeenCalledTimes(1);
    expect(dismissedSpy).toHaveBeenCalledWith(jasmine.any(SbbChip));
  });

  it('should hide chip when dismissed button is pressed', () => {
    const dismissButton = fixture.debugElement.query(By.css('.sbb-chip-close-button'));
    dismissButton.nativeElement.click();
    fixture.detectChanges();

    const chips = fixture.debugElement.queryAll(By.directive(SbbChip));
    chips.forEach((chip) => expect(chip.attributes['aria-hidden']).toBe('true'));
    chips.forEach((chip) => expect(chip.properties['hidden']).toBe(true));
  });
});
