import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Tag } from 'sbb-angular';
import { Subscription } from 'rxjs';

const tagItems: Tag[] = [
  {
    id: 'tag-1',
    label: 'Services',
    amount: 8,
    selected: false
  },
  {
    id: 'tag-2',
    label: 'Restaurants / Take Away',
    amount: 9,
    selected: false
  },
  {
    id: 'tag-3',
    label: 'Blumen',
    amount: 10,
    selected: false
  },
  {
    id: 'tag-4',
    label: 'Elektronik / Musik / Foto',
    amount: 11,
    selected: false
  }
];

const tagItems2: Tag[] = [
  {
    id: 'tag-2-1',
    label: 'Services',
    amount: 8,
    selected: false
  },
  {
    id: 'tag-2-2',
    label: 'Restaurants / Take Away',
    amount: 9,
    selected: false
  },
  {
    id: 'tag-2-3',
    label: 'Blumen',
    amount: 10,
    selected: false
  },
  {
    id: 'tag-2-4',
    label: 'Elektronik / Musik / Foto',
    amount: 11,
    selected: false
  }
];

@Component({
  selector: 'sbb-tag-showcase',
  templateUrl: './tag-showcase.component.html',
  styleUrls: ['./tag-showcase.component.scss']
})
export class TagShowcaseComponent implements OnInit, OnDestroy {

  form: FormGroup;
  disableCheckbox: FormControl;
  tagsOutput: any;
  tagItems: Tag[] = tagItems.slice();
  tagItemsReactive: Tag[] = tagItems2.slice();
  disableOne = false;
  changeAmount: FormControl;

  get tags() {
    return this.form.get('tags') as FormArray;
  }

  private _tagFormSubscription = Subscription.EMPTY;
  private _checkboxSubscription = Subscription.EMPTY;
  private _changeAmountSubscription = Subscription.EMPTY;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      tags: this.buildTags()
    });

    this.disableCheckbox = new FormControl(false);

    this.changeAmount = new FormControl();
  }

  ngOnInit() {
    this._tagFormSubscription = this.subscribeOnTags();
    this._checkboxSubscription = this.subscribeOnDisableCheckbox();
    this._changeAmountSubscription = this.subscribeOnChangeAmount();
  }

  ngOnDestroy() {
    this._tagFormSubscription.unsubscribe();
    this._checkboxSubscription.unsubscribe();
    this._changeAmountSubscription.unsubscribe();
  }

  subscribeOnTags(): Subscription {
    return this.tags.valueChanges
    .subscribe(() => {
      this.tags.controls.map((c, i) => {
        this.tagItemsReactive[i].selected = c.value;
      });
    });
  }

  subscribeOnDisableCheckbox(): Subscription {
    return this.disableCheckbox
    .valueChanges.subscribe(
      (val) => {
        const control1 = this.tags.controls[1];
        const control2 = this.tags.controls[2];

        if (val && control1 && control2) {
          control1.disable();
          control2.disable();
        } else if (control1 && control2) {
          control1.enable();
          control2.enable();
        }
      }
    );
  }

  subscribeOnChangeAmount(): Subscription {
    return this.changeAmount
    .valueChanges.subscribe(
      (val) => {
        this.tagItems[1].amount = val;
        this.tagItemsReactive[1].amount = val;
      }
    );
  }

  buildTags(): FormArray {
    const arr = this.tagItemsReactive.map(tag => {
      return this.formBuilder.control(tag.selected);
    });

    return this.formBuilder.array(arr);
  }

  removeOneItem() {
    this.tagItems.splice(-1);
    this.tagItemsReactive.splice(-1);
    this.tags.removeAt(this.tags.length - 1);
  }

  addOneItem() {
    const itemToAdd: Tag = {
      label: 'New Item',
      amount: 20,
      selected: true
    };

    this.tagItems.push(Object.assign({}, itemToAdd));
    this.tagItemsReactive.push(Object.assign({}, itemToAdd));
    this.tags.push(new FormControl(itemToAdd.selected));
  }

  reset() {
    this.tagItems = tagItems.slice();
    this.tagItemsReactive = tagItems2.slice();
    this.form.setControl('tags', this.buildTags());
    this._tagFormSubscription = this.subscribeOnTags();
  }

}
