import { BACKSPACE, DELETE } from '@angular/cdk/keycodes';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createKeyboardEvent, dispatchFakeEvent } from '@sbb-esta/angular/core/testing';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbIconTestingModule } from '@sbb-esta/angular/icon/testing';

import { SbbChip, SbbChipEvent } from './chip';
import { SbbChipList } from './chip-list';
import { SbbChipsModule } from './chips.module';

describe('SbbChip', () => {
  let fixture: ComponentFixture<any>;
  let chipDebugElement: DebugElement;
  let chipNativeElement: HTMLElement;
  let chipInstance: SbbChip;

  describe('SbbBasicChip', () => {
    it('adds a class to indicate that it is a basic chip', () => {
      fixture = TestBed.createComponent(BasicChip);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('sbb-basic-chip');
      expect(chip.classList).toContain('sbb-chip');
      expect(chip.classList).toContain('sbb-basic-chip');
    });

    it('should be able to set a static tabindex', () => {
      fixture = TestBed.createComponent(BasicChipWithStaticTabindex);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('sbb-basic-chip');
      expect(chip.getAttribute('tabindex')).toBe('3');
    });

    it('should be able to set a dynamic tabindex', () => {
      fixture = TestBed.createComponent(BasicChipWithBoundTabindex);
      fixture.detectChanges();

      const chip = fixture.nativeElement.querySelector('sbb-basic-chip');
      expect(chip.getAttribute('tabindex')).toBe('12');

      fixture.componentInstance.tabindex = 15;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(chip.getAttribute('tabindex')).toBe('15');
    });

    it('should have the correct role', () => {
      fixture = TestBed.createComponent(BasicChip);
      fixture.detectChanges();
      chipDebugElement = fixture.debugElement.query(By.directive(SbbChip))!;
      chipNativeElement = chipDebugElement.nativeElement;

      expect(chipNativeElement.getAttribute('role')).toBe('option');
    });

    it('should be able to set a custom role', () => {
      fixture = TestBed.createComponent(BasicChip);
      fixture.detectChanges();
      chipDebugElement = fixture.debugElement.query(By.directive(SbbChip))!;
      chipInstance = chipDebugElement.injector.get<SbbChip>(SbbChip);
      chipNativeElement = chipDebugElement.nativeElement;

      chipInstance.role = 'gridcell';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(chipNativeElement.getAttribute('role')).toBe('gridcell');
    });
  });

  describe('SbbChip', () => {
    let testComponent: SingleChip;

    beforeEach(() => {
      fixture = TestBed.createComponent(SingleChip);
      fixture.detectChanges();

      chipDebugElement = fixture.debugElement.query(By.directive(SbbChip))!;
      chipNativeElement = chipDebugElement.nativeElement;
      chipInstance = chipDebugElement.injector.get<SbbChip>(SbbChip);
      testComponent = fixture.debugElement.componentInstance;
    });

    describe('basic behaviors', () => {
      it('adds the `sbb-chip` class', () => {
        expect(chipNativeElement.classList).toContain('sbb-chip');
      });

      it('does not add the `sbb-basic-chip` class', () => {
        expect(chipNativeElement.classList).not.toContain('sbb-basic-chip');
      });

      it('emits focus only once for multiple clicks', () => {
        let counter = 0;
        chipInstance._onFocus.subscribe(() => {
          counter++;
        });

        chipNativeElement.focus();
        chipNativeElement.focus();
        fixture.detectChanges();

        expect(counter).toBe(1);
      });

      it('emits destroy on destruction', () => {
        spyOn(testComponent, 'chipDestroy').and.callThrough();

        // Force a destroy callback
        testComponent.shouldShow = false;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(testComponent.chipDestroy).toHaveBeenCalledTimes(1);
      });

      it('allows removal', () => {
        spyOn(testComponent, 'chipRemove');

        chipInstance.remove();
        fixture.detectChanges();

        expect(testComponent.chipRemove).toHaveBeenCalledWith({ chip: chipInstance });
      });

      it('should not prevent the default click action', () => {
        const event = dispatchFakeEvent(chipNativeElement, 'click');
        fixture.detectChanges();

        expect(event.defaultPrevented).toBe(false);
      });

      it('should prevent the default click action when the chip is disabled', () => {
        chipInstance.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        const event = dispatchFakeEvent(chipNativeElement, 'click');
        fixture.detectChanges();

        expect(event.defaultPrevented).toBe(true);
      });

      it('should return the chip text if value is undefined', () => {
        expect(chipInstance.value.trim()).toBe(fixture.componentInstance.name);
      });

      it('should return the chip value if defined', () => {
        fixture.componentInstance.value = 123;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipInstance.value).toBe(123);
      });

      it('should return the chip value if set to null', () => {
        fixture.componentInstance.value = null;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipInstance.value).toBeNull();
      });
    });

    describe('keyboard behavior', () => {
      describe('when removable is true', () => {
        beforeEach(() => {
          testComponent.removable = true;
          fixture.detectChanges();
        });

        it('DELETE emits the (removed) event', () => {
          const deleteEvent = createKeyboardEvent('keydown', DELETE);

          spyOn(testComponent, 'chipRemove');

          // Use the delete to remove the chip
          chipInstance._handleKeydown(deleteEvent);
          fixture.detectChanges();

          expect(testComponent.chipRemove).toHaveBeenCalled();
        });

        it('BACKSPACE emits the (removed) event', () => {
          const backspaceEvent = createKeyboardEvent('keydown', BACKSPACE);

          spyOn(testComponent, 'chipRemove');

          // Use the delete to remove the chip
          chipInstance._handleKeydown(backspaceEvent);
          fixture.detectChanges();

          expect(testComponent.chipRemove).toHaveBeenCalled();
        });
      });

      describe('when removable is false', () => {
        beforeEach(() => {
          testComponent.removable = false;
          fixture.changeDetectorRef.markForCheck();
          fixture.detectChanges();
        });

        it('DELETE does not emit the (removed) event', () => {
          const deleteEvent = createKeyboardEvent('keydown', DELETE);

          spyOn(testComponent, 'chipRemove');

          // Use the delete to remove the chip
          chipInstance._handleKeydown(deleteEvent);
          fixture.detectChanges();

          expect(testComponent.chipRemove).not.toHaveBeenCalled();
        });

        it('BACKSPACE does not emit the (removed) event', () => {
          const backspaceEvent = createKeyboardEvent('keydown', BACKSPACE);

          spyOn(testComponent, 'chipRemove');

          // Use the delete to remove the chip
          chipInstance._handleKeydown(backspaceEvent);
          fixture.detectChanges();

          expect(testComponent.chipRemove).not.toHaveBeenCalled();
        });
      });

      it('should update the aria-label for disabled chips', () => {
        expect(chipNativeElement.getAttribute('aria-disabled')).toBe('false');

        testComponent.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipNativeElement.getAttribute('aria-disabled')).toBe('true');
      });

      it('should make disabled chips non-focusable', () => {
        expect(chipNativeElement.getAttribute('tabindex')).toBe('-1');

        testComponent.disabled = true;
        fixture.changeDetectorRef.markForCheck();
        fixture.detectChanges();

        expect(chipNativeElement.getAttribute('tabindex')).toBeFalsy();
      });
    });
  });
});

@Component({
  template: ` <sbb-chip-list>
    @if (shouldShow) {
      <div>
        <sbb-chip
          [removable]="removable"
          [disabled]="disabled"
          (focus)="chipFocus($event)"
          (destroyed)="chipDestroy($event)"
          (removed)="chipRemove($event)"
          [value]="value"
        >
          {{ name }}
        </sbb-chip>
      </div>
    }
  </sbb-chip-list>`,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class SingleChip {
  @ViewChild(SbbChipList) chipList: SbbChipList;
  disabled: boolean = false;
  name: string = 'Test';
  removable: boolean = true;
  shouldShow: boolean = true;
  value: any;

  chipFocus: (event: FocusEvent) => void = () => {};
  chipDestroy: (event?: SbbChipEvent) => void = () => {};
  chipRemove: (event?: SbbChipEvent) => void = () => {};
}

@Component({
  template: `<sbb-basic-chip>Hello</sbb-basic-chip>`,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class BasicChip {}

@Component({
  template: `<sbb-basic-chip tabindex="3">Hello</sbb-basic-chip>`,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class BasicChipWithStaticTabindex {}

@Component({
  template: `<sbb-basic-chip [tabIndex]="tabindex">Hello</sbb-basic-chip>`,
  imports: [SbbChipsModule, SbbIconModule, SbbIconTestingModule],
})
class BasicChipWithBoundTabindex {
  tabindex = 12;
}
