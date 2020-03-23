import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICON_META } from '@sbb-esta/angular-icons/experimental/_meta';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'sbb-experimental-icon-search',
  templateUrl: './experimental-icon-search.component.html',
  styleUrls: ['./experimental-icon-search.component.css']
})
export class ExperimentalIconSearchComponent {
  form: FormGroup;

  icons: Observable<
    { attributeSelector: string; elementSelector: string; portal: ComponentPortal<any> }[]
  >;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      filter: '',
      color: false,
      fixed: false
    });
    this.icons = this.form.controls.filter.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      map(f =>
        ICON_META.filter(
          i => i.elementSelector.substring(4).includes(f) || i.elementSelector.includes(f)
        ).map(i => ({
          ...i,
          portal: new ComponentPortal<any>(i.component)
        }))
      )
    );
  }
}
