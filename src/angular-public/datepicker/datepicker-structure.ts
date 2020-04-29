import { DateInputDirective } from './date-input/date-input.directive';

export interface DatepickerStructure<D> {
  slave: DatepickerStructure<D> | null;
  master: DatepickerStructure<D> | null;
  datepickerInput: DateInputDirective<D>;
}
