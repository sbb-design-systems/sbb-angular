import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replacePipe'
})
export class ReplacePipe implements PipeTransform {
  transform(input: string, pattern: string, replacement: string): any {
    let newValue = input.replace('<' + pattern + '>', replacement);
    newValue = newValue.replace('</' + pattern + '>', replacement);

    return newValue;
  }
}
