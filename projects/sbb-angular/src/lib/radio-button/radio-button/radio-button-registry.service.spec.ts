import { TestBed } from '@angular/core/testing';

import { RadioButtonRegistryService } from './radio-button-registry.service';

describe('RadioButtonRegistryService', () => {

  let service: RadioButtonRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ RadioButtonRegistryService ]
    });
    service = TestBed.get(RadioButtonRegistryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not have radio buttons', () => {
    expect(Object.keys(service.accessors).length).toBe(0);
  });

  it('should have a radio button', () => {
    const component = jasmine.createSpyObj('RadioButtonComponent', ['writeValue']);
    component.name = 'test-name';
    service.add(component);

    expect(service.accessors['test-name'].length).toBe(1);
  });

  it('should have a radio button group', () => {
    const component = jasmine.createSpyObj('RadioButtonComponent', ['writeValue']);
    component.name = 'test-name';
    component.inputId = 'test-comp-id-1';
    service.add(component);

    component.name = 'test-name';
    component.inputId = 'test-comp-id-2';
    service.add(component);

    expect(Object.keys(service.accessors).length).toBe(1);
  });

  it('should have a radio button checked in the same group', () => {
    const component = jasmine.createSpyObj('RadioButtonComponent', ['writeValue', 'uncheck']);
    component.uncheck.and.callFake(() => {
      component.checked = false;
    });
    component.name = 'test-name';
    component.inputId = 'test-comp-id-1';
    service.add(component);

    const component2 = jasmine.createSpyObj('RadioButtonComponent', ['writeValue', 'uncheck']);
    component2.uncheck.and.callFake(() => {
      component2.checked = false;
    });
    component2.name = 'test-name';
    component2.inputId = 'test-comp-id-2';
    service.add(component2);

    component.checked = true;
    service.select(component);

    expect(service.accessors['test-name'][0].checked).toBeTruthy();
    expect(service.accessors['test-name'][1].checked).toBeFalsy();

    component2.checked = true;
    service.select(component2);

    expect(service.accessors['test-name'][0].checked).toBeFalsy();
    expect(service.accessors['test-name'][1].checked).toBeTruthy();
  });

  it('should be empty on remove', () => {
    const component = jasmine.createSpyObj('RadioButtonComponent', ['writeValue']);
    component.name = 'test-name';
    component.inputId = 'test-comp-id-1';
    service.add(component);

    expect(service.accessors['test-name'].length).toBe(1);
    service.remove(component);

    expect(service.accessors['test-name'].length).toBe(0);
  });
});
