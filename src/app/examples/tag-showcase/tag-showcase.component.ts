import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Tag } from 'sbb-angular';
import { Subscription, Observable, of, pipe } from 'rxjs';
import { switchMap, map, mergeAll, mergeMap, skipUntil, skip, last } from 'rxjs/operators';

const tagItems: Tag[] = [
  {
    label: 'Services',
    amount: 8,
    selected: false
  },
  {
    label: 'Restaurants / Take Away',
    amount: 9,
    selected: true
  },
  {
    label: 'Blumen',
    amount: 10,
    selected: false
  },
  {
    label: 'Elektronik / Musik / Foto',
    amount: 11,
    selected: false
  }
];

const tagItems2 = tagItems.map((t: Tag) => Object.assign({}, t));

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

    this._tagFormSubscription = this.tags.valueChanges
      .subscribe(() => {
        this.tags.controls.map((c, i) => {
          this.tagItemsReactive[i].selected = c.value;
        });
      });

    this._checkboxSubscription = this.disableCheckbox
      .valueChanges.subscribe(
        (val) => {
          if (val) {
            this.tags.controls[1].disable();
            this.tags.controls[2].disable();
          } else {
            this.tags.controls[1].enable();
            this.tags.controls[2].enable();
          }
        }
      );

    this._changeAmountSubscription = this.changeAmount
      .valueChanges.subscribe(
        (val) => {
          this.tagItems[1].amount = val;
          this.tagItemsReactive[1].amount = val;
        }
      );
  }

  ngOnDestroy() {
    this._tagFormSubscription.unsubscribe();
    this._checkboxSubscription.unsubscribe();
    this._changeAmountSubscription.unsubscribe();
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

    this.tagItems.push(itemToAdd);
    this.tagItemsReactive.push(itemToAdd);
    this.tags.push(new FormControl(itemToAdd.selected));
  }

  reset() {
    this.tagItems = tagItems.slice();
    this.tagItemsReactive = tagItems2.slice();
    this.form.setControl('tags', this.buildTags());
  }

}
