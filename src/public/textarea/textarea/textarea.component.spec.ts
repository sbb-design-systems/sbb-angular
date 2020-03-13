import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  clearElement,
  dispatchFakeEvent,
  dispatchMouseEvent,
  typeInElement
} from '@sbb-esta/angular-core/testing';
import { FieldModule, FormErrorDirective } from '@sbb-esta/angular-public';
import { configureTestSuite } from 'ng-bullet';

import { TextareaComponent } from './textarea.component';

@Component({
  selector: 'sbb-textarea-test',
  template: `
    <sbb-textarea
      [(ngModel)]="textArea1"
      [minlength]="minlength"
      [maxlength]="maxlength"
      [required]="required"
      [readonly]="readonly"
      [disabled]="disabled"
    ></sbb-textarea>
  `
})
class TextareaTestComponent {
  required: boolean;
  readonly: boolean;
  disabled: boolean;
  minlength: number;
  maxlength: number;
  textArea1: string;
}

@Component({
  selector: 'sbb-textarea-sbb-field',
  template: `
    <form [formGroup]="form">
      <sbb-field label="Textarea">
        <sbb-textarea formControlName="textarea" [maxlength]="200" [minlength]="20"></sbb-textarea>
        <sbb-form-error *ngIf="form.get('textarea').errors?.minlength"
          >A length of 20 chars is required!</sbb-form-error
        >
      </sbb-field>
    </form>
  `
})
class TextareaSbbFieldTestComponent {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('SBB')
  });
}

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule],
      declarations: [TextareaComponent]
    }).overrideComponent(TextareaComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('TextareaComponent behaviour', () => {
  let component: TextareaTestComponent;
  let fixture: ComponentFixture<TextareaTestComponent>;
  let innerComponent: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule, FormsModule],
      declarations: [TextareaTestComponent, TextareaComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaTestComponent);
    component = fixture.componentInstance;
    innerComponent = fixture.debugElement.query(By.directive(TextareaComponent));
    fixture.detectChanges();
  });

  it('should be required', () => {
    component.required = true;
    const textarea = innerComponent.query(By.css('textarea'));
    clearElement(textarea.nativeElement);
    fixture.detectChanges();
    expect(innerComponent.classes['ng-invalid'] && innerComponent.classes['ng-dirty']).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.ng-invalid'))
        .borderTopColor
    ).toBe('rgb(235, 0, 0)');
  });

  it('should be readonly attribute', () => {
    component.readonly = true;
    fixture.detectChanges();
    expect(innerComponent.attributes['ng-reflect-readonly']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('[readonly]')).toBeTruthy();
  });

  it('should be disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect(innerComponent.attributes['ng-reflect-disabled']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.disabled')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.disabled')).borderTopColor
    ).toBe('rgb(210, 210, 210)');
  });

  it('should have a min length attribute', () => {
    component.minlength = 20;
    const textarea = innerComponent.query(
      e => e.nativeElement.nodeName.toLowerCase() === 'textarea'
    );
    typeInElement(textarea.nativeElement, 'SBB');
    fixture.detectChanges();
    expect(innerComponent.attributes['minlength']).toBeTruthy();
    expect(fixture.debugElement.nativeElement.querySelector('.ng-invalid')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.ng-invalid'))
        .borderTopColor
    ).toBe('rgb(235, 0, 0)');
  });

  // See https://github.com/sbb-design-systems/sbb-angular/issues/106
  it('should update the inner value twice', async () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    typeInElement(textarea, 'test1');
    fixture.detectChanges();
    expect(component.textArea1).toEqual('test1');
    component.textArea1 = 'test2';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(textarea.value).toEqual('test2');
    clearElement(textarea);
    typeInElement(textarea, 'test3');
    fixture.detectChanges();
    expect(component.textArea1).toEqual('test3');
    component.textArea1 = 'test4';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(textarea.value).toEqual('test4');
  });

  it('should focus textarea when clicking on host', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();

    dispatchMouseEvent(innerComponent.nativeElement, 'click');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });

  it('should focus textarea when host was focused', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();

    dispatchMouseEvent(innerComponent.nativeElement, 'focus');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });
});

describe('TextareaComponent digits counter', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule],
      declarations: [TextareaComponent]
    }).overrideComponent(TextareaComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    component.maxlength = 20;
    component.value = 'SBB';
    fixture.detectChanges();
  });

  it('should appear on the bottom right', () => {
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeTruthy();
  });

  it('should have a 16 value', () => {
    component.writeValue(component.value + ' ');
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv.nativeElement.textContent.trim()).toBe('Noch 16 Zeichen');
  });

  it('should disappear', () => {
    component.maxlength = null;
    fixture.detectChanges();
    const counterDiv = fixture.debugElement.query(By.css('div'));
    expect(counterDiv).toBeNull();
  });
});

describe('TextareaComponent reactive forms in sbb-field behaviour', () => {
  let component: TextareaSbbFieldTestComponent;
  let fixture: ComponentFixture<TextareaSbbFieldTestComponent>;
  let sbbTextareaComponent: DebugElement;
  let textarea: HTMLTextAreaElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [TextFieldModule, ReactiveFormsModule, FormsModule, FieldModule],
      declarations: [TextareaSbbFieldTestComponent, TextareaComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaSbbFieldTestComponent);
    component = fixture.componentInstance;
    sbbTextareaComponent = fixture.debugElement.query(By.directive(TextareaComponent));
    textarea = fixture.debugElement.query(By.css('textarea')).nativeElement;
    fixture.detectChanges();
  });

  it('should forward focus when clicking sbb-field label', () => {
    const label = fixture.debugElement.query(By.css('label'));
    spyOn(textarea, 'focus');

    expect(textarea.focus).not.toHaveBeenCalled();
    dispatchMouseEvent(label.nativeElement, 'click');
    fixture.detectChanges();

    expect(textarea.focus).toHaveBeenCalled();
  });

  it('should display form error when entering too less chars', () => {
    textarea.focus();

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeFalsy();

    dispatchFakeEvent(textarea, 'blur');

    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(FormErrorDirective))).toBeTruthy();
  });

  it('should be disabled', () => {
    expect(fixture.debugElement.nativeElement.querySelector('.disabled')).toBeFalsy();

    component.form.get('textarea').disable();

    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('.disabled')).toBeTruthy();
    expect(
      getComputedStyle(fixture.debugElement.nativeElement.querySelector('.disabled')).borderTopColor
    ).toBe('rgb(210, 210, 210)');
  });

  it('should correctly update value', () => {
    expect(component.form.get('textarea').value).toBe('SBB');

    typeInElement(textarea, ' is cool');

    fixture.detectChanges();
    expect(component.form.get('textarea').value).toBe('SBB is cool');
  });
});
