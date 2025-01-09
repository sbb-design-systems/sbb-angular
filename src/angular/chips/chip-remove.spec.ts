import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { dispatchMouseEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbChip } from './chip';
import { SbbChipsModule } from './chips.module';

describe('Chip Remove', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SbbChipsModule,
        SbbIconModule,
        SbbIconTestingModule,
        TestChip,
        ChipWithoutRemoveIcon,
      ],
    });
  }));

  describe('basic behavior', () => {
    let fixture: ComponentFixture<TestChip>;
    let testChip: TestChip;
    let chipDebugElement: DebugElement;
    let chipNativeElement: HTMLElement;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(TestChip);
      testChip = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      chipDebugElement = fixture.debugElement.query(By.directive(SbbChip))!;
      chipNativeElement = chipDebugElement.nativeElement;
    }));

    it('should apply a CSS class to the remove icon', () => {
      const buttonElement = chipNativeElement.querySelector('button')!;

      expect(buttonElement.classList).toContain('sbb-chip-remove');
    });

    it('should ensure that the button cannot submit its parent form', () => {
      const buttonElement = chipNativeElement.querySelector('button')!;

      expect(buttonElement.getAttribute('type')).toBe('button');
    });

    it('should not set the `type` attribute on non-button elements', () => {
      const buttonElement = chipNativeElement.querySelector('span.sbb-chip-remove')!;

      expect(buttonElement.hasAttribute('type')).toBe(false);
    });

    it('should emit (removed) on click', () => {
      const buttonElement = chipNativeElement.querySelector('button')!;

      testChip.removable = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      spyOn(testChip, 'didRemove');

      buttonElement.click();
      fixture.detectChanges();

      expect(testChip.didRemove).toHaveBeenCalled();
    });

    it('should not remove if parent chip is disabled', () => {
      const buttonElement = chipNativeElement.querySelector('button')!;

      testChip.disabled = true;
      testChip.removable = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      spyOn(testChip, 'didRemove');

      buttonElement.click();
      fixture.detectChanges();

      expect(testChip.didRemove).not.toHaveBeenCalled();
    });

    it('should prevent the default click action', () => {
      const buttonElement = chipNativeElement.querySelector('button')!;
      const event = dispatchMouseEvent(buttonElement, 'click');
      fixture.detectChanges();

      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('icon fallback behavior', () => {
    let fixture: ComponentFixture<ChipWithoutRemoveIcon>;
    let testChip: ChipWithoutRemoveIcon;
    let chipDebugElement: DebugElement;
    let chipNativeElement: HTMLElement;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(ChipWithoutRemoveIcon);
      testChip = fixture.debugElement.componentInstance;
      fixture.detectChanges();

      chipDebugElement = fixture.debugElement.query(By.directive(SbbChip))!;
      chipNativeElement = chipDebugElement.nativeElement;
    }));

    it('should fallback to default remove icon', () => {
      const iconElement = chipNativeElement.querySelector('sbb-icon')!;

      expect(iconElement).toBeTruthy();
      expect(iconElement.getAttribute('svgIcon')).toBe('cross-small');
      expect(iconElement.hasAttribute('sbbChipRemove')).toBeTrue();
    });

    it('should hide fallback icon because it is not removable', () => {
      testChip.removable = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      const iconElement = chipNativeElement.querySelector('sbb-icon')!;

      expect(iconElement).toBeFalsy();
    });
  });
});

@Component({
  template: `
    <sbb-chip [removable]="removable" [disabled]="disabled" (removed)="didRemove()">
      <button sbbChipRemove></button>
      <span sbbChipRemove></span>
    </sbb-chip>
  `,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class TestChip {
  removable: boolean;
  disabled = false;

  didRemove() {}
}

@Component({
  template: ` <sbb-chip [removable]="removable"> </sbb-chip> `,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class ChipWithoutRemoveIcon {
  removable = true;
}
