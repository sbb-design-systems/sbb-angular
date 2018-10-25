import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputFieldShowcaseComponent } from './input-field-showcase.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FieldModule } from 'sbb-angular';
import { equal } from 'assert';

describe('InputFieldShowcaseComponent', () => {

  let component: InputFieldShowcaseComponent;
  let fixture: ComponentFixture<InputFieldShowcaseComponent>;
  let debugElement: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, FieldModule],
      declarations: [InputFieldShowcaseComponent]
    })
    .overrideComponent(InputFieldShowcaseComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFieldShowcaseComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the input to the correct property', () => {
      // first round of change detection ...
      fixture.detectChanges();
      // get the input element ...
      const input = debugElement.query(By.css('#simpleInput'));
      const inputElement = input.nativeElement;
      // set its value ...
      inputElement.value = 'test value';
      inputElement.dispatchEvent(new Event('input'));
      // do the comparison ...
      expect(component.inputText).toBe('test value');
  });

  it('should bind the input to the correct input type', () => {
      // first round of change detection ...
      fixture.detectChanges();
      // get the input element ...
      const input = debugElement.query(By.css('#simpleInput'));
      const inputElement = input.nativeElement;
      // do the comparison ...
      expect(inputElement.type).toBe('text');
      expect(component.inputType).toBe('text');
  });

  /*
  it('input should be disappeared', () => {
    component.disabled = true;
    // first round of change detection ...
    fixture.detectChanges();
    // get the input element ...
    const input = debugElement.query(By.css('#simpleInput'));
    expect(input).toBeNull();
  });
  */

  it('should be readonly attribute', () => {
     component.readonly = true;
     // first round of change detection ...
     fixture.detectChanges();
     expect(fixture.debugElement.nativeElement.querySelector('[readonly]')).toBeTruthy();
  });

  it('should have at least 7 types of input type', () => {
      // first round of change detection ...
      fixture.detectChanges();
      expect(component.types).toEqual(['text', 'password', 'number', 'file', 'email', 'datetime', 'datetime-local']);
  });

  it('should have password in model input type', async(() => {
     // change model ...
     component.inputType = component.types[1];
     component.placeholder = component.placeholderPassword;
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[1]);
     expect(component.placeholder).toBe(component.placeholderPassword);
  }));

  it('should have number in model input type', async(() => {
     // change model ...
    component.inputType = component.types[2];
    component.placeholder = component.placeholderNumber;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
    // do the comparison ...
    expect(select).toBeTruthy();
    expect(component.inputType).toBe(component.types[2]);
    expect(component.placeholder).toBe(component.placeholderNumber);
  }));

  it('should have file in model input type', async(() => {
     // change model ...
     component.inputType = component.types[3];
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[3]);
  }));

  it('should have email in model input type', async(() => {
     // change model ...
     component.inputType = component.types[4];
     component.placeholder = component.placeholderEmail;
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[4]);
     expect(component.placeholder).toBe(component.placeholderEmail);
  }));

  it('should have date-time in model input type', async(() => {
     // change model ...
     component.inputType = component.types[5];
     component.placeholder = component.placeholderDatetime;
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[5]);
     expect(component.placeholder).toBe(component.placeholderDatetime);
  }));

  it('should have datetime-local in model input type', async(() => {
     // change model ...
     component.inputType = component.types[6];
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[6]);
  }));

  it('should have text in model input type', async(() => {
     // change model ...
     component.inputType = component.types[0];
     component.placeholder = component.placeholderText;
     fixture.detectChanges();
     const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
     // do the comparison ...
     expect(select).toBeTruthy();
     expect(component.inputType).toBe(component.types[0]);
     expect(component.placeholder).toBe(component.placeholderText);
  }));

  it('should have attribute disabled', async(() => {
    // change model ...
    component.disabled = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
    // do the comparison ...
    expect(select).toBeTruthy();
    expect(select.disabled).toBeFalsy();
  }));

  it('should have attribute readonly', async(() => {
    // change model ...
    component.readonly = true;
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('#dropdown')).nativeElement;
    // do the comparison ...
    expect(select).toBeTruthy();
    expect(select.readonly).toBeFalsy();
  }));

});
