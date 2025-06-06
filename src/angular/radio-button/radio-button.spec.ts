import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { dispatchFakeEvent } from '@sbb-esta/angular/core/testing';

import { SbbRadioButton, SbbRadioChange, SbbRadioGroup } from './radio-button';
import { SbbRadioButtonModule } from './radio-button.module';

@Component({
  template: `
    <sbb-radio-group
      [disabled]="isGroupDisabled"
      [required]="isGroupRequired"
      [value]="groupValue"
      name="test-name"
    >
      @if (isFirstShown) {
        <sbb-radio-button value="fire" [disabled]="isFirstDisabled"> Charmander </sbb-radio-button>
      }
      <sbb-radio-button value="water"> Squirtle </sbb-radio-button>
      <sbb-radio-button value="leaf"> Bulbasaur </sbb-radio-button>
    </sbb-radio-group>
  `,
  imports: [FormsModule, ReactiveFormsModule, SbbRadioButtonModule],
})
class RadiosInsideRadioGroup {
  isFirstDisabled = false;
  isGroupDisabled = false;
  isGroupRequired = false;
  groupValue: string | null = null;
  isFirstShown = true;
}

@Component({
  template: `
    <sbb-radio-button name="season" value="spring">Spring</sbb-radio-button>
    <sbb-radio-button name="season" value="summer">Summer</sbb-radio-button>
    <sbb-radio-button name="season" value="autum">Autumn</sbb-radio-button>

    <sbb-radio-button name="weather" value="warm">Spring</sbb-radio-button>
    <sbb-radio-button name="weather" value="hot">Summer</sbb-radio-button>
    <sbb-radio-button name="weather" value="cool">Autumn</sbb-radio-button>

    <span id="xyz">Baby Banana</span>
    <span id="abc">A smaller banana</span>
    <sbb-radio-button
      name="fruit"
      value="banana"
      [aria-label]="ariaLabel"
      [aria-labelledby]="ariaLabelledby"
      [aria-describedby]="ariaDescribedby"
    >
    </sbb-radio-button>
    <sbb-radio-button name="fruit" value="raspberry">Raspberry</sbb-radio-button>
    <sbb-radio-button id="nameless" value="no-name">No name</sbb-radio-button>
  `,
  imports: [FormsModule, ReactiveFormsModule, SbbRadioButtonModule],
})
class StandaloneRadioButtons {
  ariaLabel = 'Banana';
  ariaLabelledby = 'xyz';
  ariaDescribedby = 'abc';
}

@Component({
  template: `
    <sbb-radio-group name="test-name">
      <sbb-radio-button value="fire">Charmander</sbb-radio-button>
      <sbb-radio-button value="water">Squirtle</sbb-radio-button>
      <sbb-radio-button value="leaf" checked>Bulbasaur</sbb-radio-button>
    </sbb-radio-group>
  `,
  imports: [FormsModule, ReactiveFormsModule, SbbRadioButtonModule],
})
class RadiosInsidePreCheckedRadioGroup {}

@Component({
  template: `
    <sbb-radio-group [name]="groupName" [(ngModel)]="modelValue" (change)="lastEvent = $event">
      @for (option of options; track option) {
        <sbb-radio-button [value]="option.value">
          {{ option.label }}
        </sbb-radio-button>
      }
    </sbb-radio-group>
  `,
  imports: [FormsModule, ReactiveFormsModule, SbbRadioButtonModule],
})
class RadioGroupWithNgModel {
  modelValue: string;
  groupName = 'radio-group';
  options = [
    { label: 'Vanilla', value: 'vanilla' },
    { label: 'Chocolate', value: 'chocolate' },
    { label: 'Strawberry', value: 'strawberry' },
  ];
  lastEvent: SbbRadioChange;
}

@Component({
  template: ` <sbb-radio-button>One</sbb-radio-button> `,
  imports: [SbbRadioButtonModule],
})
class DisableableSbbRadioButton {
  @ViewChild(SbbRadioButton) radioButton: SbbRadioButton;

  set disabled(value: boolean) {
    this.radioButton.disabled = value;
  }
}

@Component({
  template: `
    <sbb-radio-group [formControl]="formControl">
      <sbb-radio-button value="1">One</sbb-radio-button>
      <sbb-radio-button value="2">Two</sbb-radio-button>
    </sbb-radio-group>
  `,
  imports: [ReactiveFormsModule, SbbRadioButtonModule],
})
class RadioGroupWithFormControl {
  @ViewChild(SbbRadioGroup) group: SbbRadioGroup;
  formControl = new FormControl('');
}

@Component({
  template: ` <sbb-radio-button [tabIndex]="tabIndex"></sbb-radio-button> `,
  imports: [SbbRadioButtonModule],
})
class FocusableSbbRadioButton {
  tabIndex: number;
}

@Component({
  selector: 'transcluding-wrapper',
  template: ` <div><ng-content></ng-content></div> `,
})
class TranscludingWrapper {}

@Component({
  template: `
    <sbb-radio-group name="group" [(ngModel)]="modelValue">
      @for (option of options; track option) {
        <transcluding-wrapper>
          <sbb-radio-button [value]="option.value">{{ option.label }}</sbb-radio-button>
        </transcluding-wrapper>
      }
    </sbb-radio-group>
  `,
  imports: [FormsModule, SbbRadioButtonModule, TranscludingWrapper],
})
class InterleavedRadioGroup {
  modelValue = 'strawberry';
  options = [
    { label: 'Vanilla', value: 'vanilla' },
    { label: 'Chocolate', value: 'chocolate' },
    { label: 'Strawberry', value: 'strawberry' },
  ];
}

@Component({
  template: ` <sbb-radio-button tabindex="5"></sbb-radio-button> `,
  imports: [SbbRadioButtonModule],
})
class RadioButtonWithPredefinedTabindex {}

@Component({
  template: `
    <sbb-radio-button
      aria-label="Radio button"
      aria-describedby="something"
      aria-labelledby="something-else"
    ></sbb-radio-button>
  `,
  imports: [SbbRadioButtonModule],
})
class RadioButtonWithPredefinedAriaAttributes {}

@Component({
  // Note that this is somewhat of a contrived template, but it is required to
  // reproduce the issue. It was taken for a specific user report at #25831.
  template: `
    @if (true) {
      <sbb-radio-group [formControl]="controls.predecessor">
        <sbb-radio-button value="predecessor"></sbb-radio-button>
      </sbb-radio-group>
    }
    <sbb-radio-group [formControl]="controls.target" #preselectedGroup>
      <sbb-radio-button value="a"></sbb-radio-button>
      @if (true) {
        <sbb-radio-button value="b" #preselectedRadio></sbb-radio-button>
      }
    </sbb-radio-group>
  `,
  imports: [ReactiveFormsModule, SbbRadioButtonModule],
})
class PreselectedRadioWithStaticValueAndNgIf {
  @ViewChild('preselectedGroup', { read: SbbRadioGroup }) preselectedGroup: SbbRadioGroup;
  @ViewChild('preselectedRadio', { read: SbbRadioButton })
  preselectedRadio: SbbRadioButton;

  controls = {
    predecessor: new FormControl('predecessor'),
    target: new FormControl('b'),
  };
}

describe('RadioButton', () => {
  describe('inside of a group', () => {
    let fixture: ComponentFixture<RadiosInsideRadioGroup>;
    let groupDebugElement: DebugElement;
    let radioDebugElements: DebugElement[];
    let radioLabelElements: HTMLLabelElement[];
    let radioInputElements: HTMLInputElement[];
    let groupInstance: SbbRadioGroup;
    let radioInstances: SbbRadioButton[];
    let testComponent: RadiosInsideRadioGroup;

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(RadiosInsideRadioGroup);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(SbbRadioGroup))!;
      groupInstance = groupDebugElement.injector.get<SbbRadioGroup>(SbbRadioGroup);

      radioDebugElements = fixture.debugElement.queryAll(By.directive(SbbRadioButton));
      radioInstances = radioDebugElements.map((debugEl) => debugEl.componentInstance);

      radioLabelElements = radioDebugElements.map(
        (debugEl) => debugEl.query(By.css('label'))!.nativeElement,
      );
      radioInputElements = radioDebugElements.map(
        (debugEl) => debugEl.query(By.css('input'))!.nativeElement,
      );
    }));

    it('should set individual radio names based on the group name', () => {
      expect(groupInstance.name).toBeTruthy();
      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }
    });

    it('should coerce the disabled binding on the radio group', () => {
      (testComponent as any).isGroupDisabled = '';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
      expect(groupInstance.disabled).toBe(true);
    });

    it('should disable click interaction when the group is disabled', () => {
      testComponent.isGroupDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(false);
    });

    it('should disable each individual radio when the group is disabled', () => {
      testComponent.isGroupDisabled = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      for (const radio of radioInstances) {
        expect(radio.disabled).toBe(true);
      }
    });

    it('should set required to each radio button when the group is required', () => {
      testComponent.isGroupRequired = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      for (const radio of radioInstances) {
        expect(radio.required).toBe(true);
      }
    });

    it('should update the group value when one of the radios changes', () => {
      expect(groupInstance.value).toBeFalsy();

      radioInstances[0].checked = true;
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
    });

    it('should update the group and radios when one of the radios is clicked', () => {
      expect(groupInstance.value).toBeFalsy();

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBe(true);
      expect(radioInstances[1].checked).toBe(false);

      radioLabelElements[1].click();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(groupInstance.selected).toBe(radioInstances[1]);
      expect(radioInstances[0].checked).toBe(false);
      expect(radioInstances[1].checked).toBe(true);
    });

    it('should check a radio upon interaction with the underlying native radio button', () => {
      radioInputElements[0].click();
      fixture.detectChanges();

      expect(radioInstances[0].checked).toBe(true);
      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
    });

    it('should emit a change event from radio buttons', () => {
      expect(radioInstances[0].checked).toBe(false);

      const spies = radioInstances.map((radio, index) =>
        jasmine.createSpy(`onChangeSpy ${index} for ${radio.name}`),
      );

      spies.forEach((spy, index) => radioInstances[index].change.subscribe(spy));

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(spies[0]).toHaveBeenCalled();

      radioLabelElements[1].click();
      fixture.detectChanges();

      // To match the native radio button behavior, the change event shouldn't
      // be triggered when the radio got unselected.
      expect(spies[0]).toHaveBeenCalledTimes(1);
      expect(spies[1]).toHaveBeenCalledTimes(1);
    });

    it(`should not emit a change event from the radio group when change group value programmatically`, () => {
      expect(groupInstance.value).toBeFalsy();

      const changeSpy = jasmine.createSpy('radio-group change listener');
      groupInstance.change.subscribe(changeSpy);

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);

      groupInstance.value = 'water';
      fixture.detectChanges();

      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the group and radios when updating the group value', () => {
      expect(groupInstance.value).toBeFalsy();

      testComponent.groupValue = 'fire';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('fire');
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(radioInstances[0].checked).toBe(true);
      expect(radioInstances[1].checked).toBe(false);

      testComponent.groupValue = 'water';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(groupInstance.selected).toBe(radioInstances[1]);
      expect(radioInstances[0].checked).toBe(false);
      expect(radioInstances[1].checked).toBe(true);
    });

    it('should deselect all of the radios when the group value is cleared', () => {
      radioInstances[0].checked = true;

      expect(groupInstance.value).toBeTruthy();

      groupInstance.value = null;

      expect(radioInstances.every((radio) => !radio.checked)).toBe(true);
    });

    it(`should update the group's selected radio to null when unchecking that radio programmatically`, () => {
      const changeSpy = jasmine.createSpy('radio-group change listener');
      groupInstance.change.subscribe(changeSpy);
      radioInstances[0].checked = true;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeTruthy();

      radioInstances[0].checked = false;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeFalsy();
      expect(radioInstances.every((radio) => !radio.checked)).toBe(true);
      expect(groupInstance.selected).toBeNull();
    });

    it('should not fire a change event from the group when a radio checked state changes', () => {
      const changeSpy = jasmine.createSpy('radio-group change listener');
      groupInstance.change.subscribe(changeSpy);
      radioInstances[0].checked = true;

      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBeTruthy();
      expect(groupInstance.value).toBe('fire');

      radioInstances[1].checked = true;

      fixture.detectChanges();

      expect(groupInstance.value).toBe('water');
      expect(changeSpy).not.toHaveBeenCalled();
    });

    it(`should update checked status if changed value to radio group's value`, () => {
      const changeSpy = jasmine.createSpy('radio-group change listener');
      groupInstance.change.subscribe(changeSpy);
      groupInstance.value = 'apple';

      expect(changeSpy).not.toHaveBeenCalled();
      expect(groupInstance.value).toBe('apple');
      expect(groupInstance.selected).withContext('expect group selected to be null').toBeFalsy();
      expect(radioInstances[0].checked)
        .withContext('should not select the first button')
        .toBeFalsy();
      expect(radioInstances[1].checked)
        .withContext('should not select the second button')
        .toBeFalsy();
      expect(radioInstances[2].checked)
        .withContext('should not select the third button')
        .toBeFalsy();

      radioInstances[0].value = 'apple';

      fixture.detectChanges();

      expect(groupInstance.selected)
        .withContext('expect group selected to be first button')
        .toBe(radioInstances[0]);
      expect(radioInstances[0].checked)
        .withContext('expect group select the first button')
        .toBeTruthy();
      expect(radioInstances[1].checked)
        .withContext('should not select the second button')
        .toBeFalsy();
      expect(radioInstances[2].checked)
        .withContext('should not select the third button')
        .toBeFalsy();
    });

    it('should set the input tabindex based on the selected radio button', () => {
      const getTabIndexes = () => {
        return radioInputElements.map((element) =>
          parseInt(element.getAttribute('tabindex') || '', 10),
        );
      };

      expect(getTabIndexes()).toEqual([0, 0, 0]);

      radioLabelElements[0].click();
      fixture.detectChanges();

      expect(getTabIndexes()).toEqual([0, -1, -1]);

      radioLabelElements[1].click();
      fixture.detectChanges();

      expect(getTabIndexes()).toEqual([-1, 0, -1]);

      radioLabelElements[2].click();
      fixture.detectChanges();

      expect(getTabIndexes()).toEqual([-1, -1, 0]);
    });

    it('should set the input tabindex correctly with a pre-checked radio button', () => {
      const precheckedFixture = TestBed.createComponent(RadiosInsidePreCheckedRadioGroup);
      precheckedFixture.detectChanges();

      const radios: NodeListOf<HTMLElement> =
        precheckedFixture.nativeElement.querySelectorAll('sbb-radio-button input');

      expect(
        Array.from(radios).map((radio) => {
          return radio.getAttribute('tabindex');
        }),
      ).toEqual(['-1', '-1', '0']);
    });

    it('should clear the selected radio button but preserve the value on destroy', () => {
      radioLabelElements[0].click();
      fixture.detectChanges();
      expect(groupInstance.selected).toBe(radioInstances[0]);
      expect(groupInstance.value).toBe('fire');

      fixture.componentInstance.isFirstShown = false;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(groupInstance.selected).toBe(null);
      expect(groupInstance.value).toBe('fire');
    });
  });

  describe('group with ngModel', () => {
    let fixture: ComponentFixture<RadioGroupWithNgModel>;
    let groupDebugElement: DebugElement;
    let radioDebugElements: DebugElement[];
    let innerRadios: DebugElement[];
    let radioLabelElements: HTMLLabelElement[];
    let groupInstance: SbbRadioGroup;
    let radioInstances: SbbRadioButton[];
    let testComponent: RadioGroupWithNgModel;
    let groupNgModel: NgModel;

    beforeEach(() => {
      fixture = TestBed.createComponent(RadioGroupWithNgModel);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      groupDebugElement = fixture.debugElement.query(By.directive(SbbRadioGroup))!;
      groupInstance = groupDebugElement.injector.get<SbbRadioGroup>(SbbRadioGroup);
      groupNgModel = groupDebugElement.injector.get<NgModel>(NgModel);

      radioDebugElements = fixture.debugElement.queryAll(By.directive(SbbRadioButton));
      radioInstances = radioDebugElements.map((debugEl) => debugEl.componentInstance);
      innerRadios = fixture.debugElement.queryAll(By.css('input[type="radio"]'));

      radioLabelElements = radioDebugElements.map(
        (debugEl) => debugEl.query(By.css('label'))!.nativeElement,
      );
    });

    it('should set individual radio names based on the group name', () => {
      expect(groupInstance.name).toBeTruthy();
      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }

      groupInstance.name = 'new name';

      for (const radio of radioInstances) {
        expect(radio.name).toBe(groupInstance.name);
      }
    });

    it('should update the name of radio DOM elements if the name of the group changes', () => {
      const nodes: HTMLInputElement[] = innerRadios.map((radio) => radio.nativeElement);

      expect(nodes.every((radio) => radio.getAttribute('name') === groupInstance.name))
        .withContext('Expected all radios to have the initial name.')
        .toBe(true);

      fixture.componentInstance.groupName = 'changed-name';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(groupInstance.name).toBe('changed-name');
      expect(nodes.every((radio) => radio.getAttribute('name') === groupInstance.name))
        .withContext('Expected all radios to have the new name.')
        .toBe(true);
    });

    it('should check the corresponding radio button on group value change', () => {
      expect(groupInstance.value).toBeFalsy();
      for (const radio of radioInstances) {
        expect(radio.checked).toBeFalsy();
      }

      groupInstance.value = 'vanilla';
      for (const radio of radioInstances) {
        expect(radio.checked).toBe(groupInstance.value === radio.value);
      }
      expect(groupInstance.selected!.value).toBe(groupInstance.value);
    });

    it('should have the correct control state initially and after interaction', () => {
      // The control should start off valid, pristine, and untouched.
      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(true);
      expect(groupNgModel.touched).toBe(false);

      // After changing the value programmatically, the control should stay pristine
      // but remain untouched.
      radioInstances[1].checked = true;
      fixture.detectChanges();

      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(true);
      expect(groupNgModel.touched).toBe(false);

      // After a user interaction occurs (such as a click), the control should become dirty and
      // now also be touched.
      radioLabelElements[2].click();
      fixture.detectChanges();

      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(false);
      expect(groupNgModel.touched).toBe(false);

      // Blur the input element in order to verify that the ng-touched state has been set to true.
      // The touched state should be only set to true after the form control has been blurred.
      dispatchFakeEvent(innerRadios[2].nativeElement, 'blur');

      expect(groupNgModel.valid).toBe(true);
      expect(groupNgModel.pristine).toBe(false);
      expect(groupNgModel.touched).toBe(true);
    });

    it('should write to the radio button based on ngModel', fakeAsync(() => {
      testComponent.modelValue = 'chocolate';
      fixture.changeDetectorRef.markForCheck();

      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(innerRadios[1].nativeElement.checked).toBe(true);
      expect(radioInstances[1].checked).toBe(true);
    }));

    it('should update the ngModel value when selecting a radio button', () => {
      dispatchFakeEvent(innerRadios[1].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.modelValue).toBe('chocolate');
    });

    it('should update the model before firing change event', () => {
      expect(testComponent.modelValue).toBeUndefined();
      expect(testComponent.lastEvent).toBeUndefined();

      dispatchFakeEvent(innerRadios[1].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.lastEvent.value).toBe('chocolate');

      dispatchFakeEvent(innerRadios[0].nativeElement, 'change');
      fixture.detectChanges();
      expect(testComponent.lastEvent.value).toBe('vanilla');
    });
  });

  describe('group with FormControl', () => {
    it('should toggle the disabled state', () => {
      const fixture = TestBed.createComponent(RadioGroupWithFormControl);
      fixture.detectChanges();

      expect(fixture.componentInstance.group.disabled).toBeFalsy();

      fixture.componentInstance.formControl.disable();
      fixture.detectChanges();

      expect(fixture.componentInstance.group.disabled).toBeTruthy();

      fixture.componentInstance.formControl.enable();
      fixture.detectChanges();

      expect(fixture.componentInstance.group.disabled).toBeFalsy();
    });

    it('should have a selected button when one matches the initial value', () => {
      const fixture = TestBed.createComponent(RadioGroupWithFormControl);
      fixture.componentInstance.formControl.setValue('2');
      fixture.detectChanges();

      expect(fixture.componentInstance.group.selected?.value).toBe('2');
    });
  });

  describe('disableable', () => {
    let fixture: ComponentFixture<DisableableSbbRadioButton>;
    let radioInstance: SbbRadioButton;
    let radioNativeElement: HTMLInputElement;
    let testComponent: DisableableSbbRadioButton;

    beforeEach(() => {
      fixture = TestBed.createComponent(DisableableSbbRadioButton);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;
      const radioDebugElement = fixture.debugElement.query(By.directive(SbbRadioButton))!;
      radioInstance = radioDebugElement.injector.get<SbbRadioButton>(SbbRadioButton);
      radioNativeElement = radioDebugElement.nativeElement.querySelector('input');
    });

    it('should toggle the disabled state', () => {
      expect(radioInstance.disabled).toBeFalsy();
      expect(radioNativeElement.disabled).toBeFalsy();

      testComponent.disabled = true;
      fixture.detectChanges();
      expect(radioInstance.disabled).toBeTruthy();
      expect(radioNativeElement.disabled).toBeTruthy();

      testComponent.disabled = false;
      fixture.detectChanges();
      expect(radioInstance.disabled).toBeFalsy();
      expect(radioNativeElement.disabled).toBeFalsy();
    });
  });

  describe('as standalone', () => {
    let fixture: ComponentFixture<StandaloneRadioButtons>;
    let radioDebugElements: DebugElement[];
    let seasonRadioInstances: SbbRadioButton[];
    let weatherRadioInstances: SbbRadioButton[];
    let fruitRadioInstances: SbbRadioButton[];
    let fruitRadioNativeInputs: HTMLElement[];
    let testComponent: StandaloneRadioButtons;

    beforeEach(() => {
      fixture = TestBed.createComponent(StandaloneRadioButtons);
      fixture.detectChanges();

      testComponent = fixture.debugElement.componentInstance;

      radioDebugElements = fixture.debugElement.queryAll(By.directive(SbbRadioButton));
      seasonRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'season')
        .map((debugEl) => debugEl.componentInstance);
      weatherRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'weather')
        .map((debugEl) => debugEl.componentInstance);
      fruitRadioInstances = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'fruit')
        .map((debugEl) => debugEl.componentInstance);

      const fruitRadioNativeElements = radioDebugElements
        .filter((debugEl) => debugEl.componentInstance.name === 'fruit')
        .map((debugEl) => debugEl.nativeElement);

      fruitRadioNativeInputs = [];
      for (const element of fruitRadioNativeElements) {
        fruitRadioNativeInputs.push(<HTMLElement>element.querySelector('input'));
      }
    });

    it('should uniquely select radios by a name', () => {
      seasonRadioInstances[0].checked = true;
      weatherRadioInstances[1].checked = true;

      fixture.detectChanges();
      expect(seasonRadioInstances[0].checked).toBe(true);
      expect(seasonRadioInstances[1].checked).toBe(false);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(true);
      expect(weatherRadioInstances[2].checked).toBe(false);

      seasonRadioInstances[1].checked = true;
      fixture.detectChanges();
      expect(seasonRadioInstances[0].checked).toBe(false);
      expect(seasonRadioInstances[1].checked).toBe(true);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(true);
      expect(weatherRadioInstances[2].checked).toBe(false);

      weatherRadioInstances[2].checked = true;
      expect(seasonRadioInstances[0].checked).toBe(false);
      expect(seasonRadioInstances[1].checked).toBe(true);
      expect(seasonRadioInstances[2].checked).toBe(false);
      expect(weatherRadioInstances[0].checked).toBe(false);
      expect(weatherRadioInstances[1].checked).toBe(false);
      expect(weatherRadioInstances[2].checked).toBe(true);
    });

    it('should add required attribute to the underlying input element if defined', () => {
      const radioInstance = seasonRadioInstances[0];
      radioInstance.required = true;
      fixture.detectChanges();

      expect(radioInstance.required).toBe(true);
    });

    it('should add value attribute to the underlying input element', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('value')).toBe('banana');
      expect(fruitRadioNativeInputs[1].getAttribute('value')).toBe('raspberry');
    });

    it('should add aria-label attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Banana');
    });

    it('should not add aria-label attribute if not defined', () => {
      expect(fruitRadioNativeInputs[1].hasAttribute('aria-label')).toBeFalsy();
    });

    it('should change aria-label attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Banana');

      testComponent.ariaLabel = 'Pineapple';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-label')).toBe('Pineapple');
    });

    it('should add aria-labelledby attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('xyz');
    });

    it('should not add aria-labelledby attribute if not defined', () => {
      expect(fruitRadioNativeInputs[1].hasAttribute('aria-labelledby')).toBeFalsy();
    });

    it('should change aria-labelledby attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('xyz');

      testComponent.ariaLabelledby = 'uvw';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-labelledby')).toBe('uvw');
    });

    it('should add aria-describedby attribute to the underlying input element if defined', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe('abc');
    });

    it('should not add aria-describedby attribute if not defined', () => {
      expect(fruitRadioNativeInputs[1].hasAttribute('aria-describedby')).toBeFalsy();
    });

    it('should change aria-describedby attribute if property is changed at runtime', () => {
      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe('abc');

      testComponent.ariaDescribedby = 'uvw';
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(fruitRadioNativeInputs[0].getAttribute('aria-describedby')).toBe('uvw');
    });

    it('should focus on underlying input element when focus() is called', () => {
      for (let i = 0; i < fruitRadioInstances.length; i++) {
        expect(document.activeElement).not.toBe(fruitRadioNativeInputs[i]);
        fruitRadioInstances[i].focus();
        fixture.detectChanges();

        expect(document.activeElement).toBe(fruitRadioNativeInputs[i]);
      }
    });

    it('should not add the "name" attribute if it is not passed in', () => {
      const radio = fixture.debugElement.nativeElement.querySelector('#nameless input');
      expect(radio.hasAttribute('name')).toBe(false);
    });
  });

  describe('with tabindex', () => {
    let fixture: ComponentFixture<FocusableSbbRadioButton>;

    beforeEach(() => {
      fixture = TestBed.createComponent(FocusableSbbRadioButton);
      fixture.detectChanges();
    });

    it('should forward focus to native input', () => {
      const radioButtonEl = fixture.debugElement.query(By.css('.sbb-radio-button'))!.nativeElement;
      const inputEl = fixture.debugElement.query(By.css('input'))!.nativeElement;

      radioButtonEl.focus();
      // Focus events don't always fire in tests, so we need to fake it.
      dispatchFakeEvent(radioButtonEl, 'focus');
      fixture.detectChanges();

      expect(document.activeElement).toBe(inputEl);
    });

    it('should allow specifying an explicit tabindex for a single radio-button', () => {
      const radioButtonInput = fixture.debugElement.query(By.css('.sbb-radio-button input'))!
        .nativeElement as HTMLInputElement;

      expect(radioButtonInput.tabIndex)
        .withContext('Expected the tabindex to be set to "0" by default.')
        .toBe(0);

      fixture.componentInstance.tabIndex = 4;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();

      expect(radioButtonInput.tabIndex)
        .withContext('Expected the tabindex to be set to "4".')
        .toBe(4);
    });

    it('should remove the tabindex from the host element', () => {
      const predefinedFixture = TestBed.createComponent(RadioButtonWithPredefinedTabindex);
      predefinedFixture.detectChanges();

      const radioButtonEl = predefinedFixture.debugElement.query(
        By.css('.sbb-radio-button'),
      )!.nativeElement;

      expect(radioButtonEl.hasAttribute('tabindex')).toBe(false);
    });

    it('should remove the aria attributes from the host element', () => {
      const predefinedFixture = TestBed.createComponent(RadioButtonWithPredefinedAriaAttributes);
      predefinedFixture.detectChanges();

      const radioButtonEl = predefinedFixture.debugElement.query(
        By.css('.sbb-radio-button'),
      )!.nativeElement;

      expect(radioButtonEl.hasAttribute('aria-label')).toBe(false);
      expect(radioButtonEl.hasAttribute('aria-describedby')).toBe(false);
      expect(radioButtonEl.hasAttribute('aria-labelledby')).toBe(false);
    });
  });

  describe('group interspersed with other tags', () => {
    let fixture: ComponentFixture<InterleavedRadioGroup>;
    let groupDebugElement: DebugElement;
    let groupInstance: SbbRadioGroup;
    let radioDebugElements: DebugElement[];
    let radioInstances: SbbRadioButton[];

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(InterleavedRadioGroup);
      fixture.detectChanges();

      groupDebugElement = fixture.debugElement.query(By.directive(SbbRadioGroup))!;
      groupInstance = groupDebugElement.injector.get<SbbRadioGroup>(SbbRadioGroup);
      radioDebugElements = fixture.debugElement.queryAll(By.directive(SbbRadioButton));
      radioInstances = radioDebugElements.map((debugEl) => debugEl.componentInstance);
    }));

    it('should initialize selection of radios based on model value', () => {
      expect(groupInstance.selected).toBe(radioInstances[2]);
    });
  });

  it('should preselect a radio button with a static value and an ngIf', () => {
    const fixture = TestBed.createComponent(PreselectedRadioWithStaticValueAndNgIf);
    fixture.detectChanges();

    expect(fixture.componentInstance.preselectedGroup.value).toBe('b');
    expect(fixture.componentInstance.preselectedRadio.checked).toBe(true);
  });
});
