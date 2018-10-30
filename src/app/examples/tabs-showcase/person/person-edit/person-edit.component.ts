import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {
  
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
    let dataModel = this.personForm.value;
    this.savePerson.emit(dataModel);
  }
}
