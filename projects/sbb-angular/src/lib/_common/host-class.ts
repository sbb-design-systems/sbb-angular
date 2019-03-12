import { Directive, NgModule } from '@angular/core';
import { NgClass } from '@angular/common';

@Directive({
  selector: '[sbbHostClass]',
})
// tslint:disable-next-line:directive-class-suffix
export class HostClass extends NgClass {
  apply(value: string | string[] | Set<string> | { [klass: string]: any }) {
    this.ngClass = value;
    this.ngDoCheck();
  }
}

@NgModule({
  declarations: [HostClass],
})
export class HostClassModule { }
