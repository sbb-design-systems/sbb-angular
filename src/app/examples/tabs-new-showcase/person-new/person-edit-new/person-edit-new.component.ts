import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'person-edit-new',
  templateUrl: './person-edit-new.component.html',
  styleUrls: ['./person-edit-new.component.scss']
})
export class PersonEditNewComponent implements OnInit {

  personForm: FormGroup;

  @Input() person;
  @Output() savePerson = new EventEmitter<any>();

  constructor(private fb: FormBuilder) {
    this.personForm = this.fb.group({
      id: '',
      name: '',
      surname: ''
    });
  }

  ngOnInit() {
    this.personForm.setValue({
      id: this.person.id || -1,
      name: this.person.name || '',
      surname: this.person.surname || ''
    });
  }

  onPersonFormSubmit() {
    const dataModel = this.personForm.value;
    this.savePerson.emit(dataModel);
  }
}
